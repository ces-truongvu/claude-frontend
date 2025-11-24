# Component Patterns

Comprehensive guide to React component patterns used in this codebase.

## Table of Contents

1. [Compositional Architecture](#compositional-architecture)
2. [Variant-Based Components](#variant-based-components)
3. [Radix UI Wrapper Pattern](#radix-ui-wrapper-pattern)
4. [Polymorphic Components](#polymorphic-components)
5. [Context-Based Components](#context-based-components)

---

## Compositional Architecture

The project uses a compositional component pattern where complex UI elements are broken into smaller, reusable sub-components.

### Card Component Pattern

File: `src/components/ui/card.tsx:5-92`

```tsx
// Base component
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

// Sub-components
function CardHeader({ className, ...props }: React.ComponentProps<"div">) { ... }
function CardTitle({ className, ...props }: React.ComponentProps<"div">) { ... }
function CardDescription({ className, ...props }: React.ComponentProps<"div">) { ... }
function CardContent({ className, ...props }: React.ComponentProps<"div">) { ... }
function CardFooter({ className, ...props }: React.ComponentProps<"div">) { ... }

// All exported together
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

**Key Patterns:**
- Each sub-component is a separate function
- All accept `className` for style overrides via the `cn()` utility
- Use `data-slot` attributes for semantic identification
- Props are spread for maximum flexibility
- Exported as named exports, not as properties of the parent

**Usage:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer actions</CardFooter>
</Card>
```

---

## Variant-Based Components

Using `class-variance-authority` (CVA) for type-safe component variants.

### Button Component Pattern

File: `src/components/ui/button.tsx:7-37`

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  // Base classes applied to all variants
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90...",
        outline: "border bg-background shadow-xs hover:bg-accent...",
        secondary: "bg-secondary text-secondary-foreground...",
        ghost: "hover:bg-accent hover:text-accent-foreground...",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

**Props Pattern:**
```tsx
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

**Key Benefits:**
- Type-safe variant props (TypeScript autocomplete)
- Centralized styling logic
- Easy to extend with new variants
- Export both component and variants for reuse

---

## Radix UI Wrapper Pattern

Wrapping Radix UI primitives with custom styling and behavior while maintaining accessibility.

### Dialog Component Pattern

File: `src/components/ui/dialog.tsx:7-141`

```tsx
import * as DialogPrimitive from "@radix-ui/react-dialog"

// Wrap each Radix primitive
function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

// Add custom functionality
function DialogContent({
  className,
  children,
  showCloseButton = true, // Custom prop
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "bg-background fixed top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%]...",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close>
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}
```

**Pattern Benefits:**
- Maintains Radix UI accessibility features
- Adds project-specific styling
- Can extend with custom props
- All primitives exported for flexibility

---

## Polymorphic Components

Using Radix UI's `Slot` component for polymorphic behavior.

### asChild Pattern

File: `src/components/ui/button.tsx:39-58`

```tsx
import { Slot } from "@radix-ui/react-slot"

function Button({
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"
  return <Comp {...props} />
}
```

**Usage:**
```tsx
// Renders as a button
<Button>Click me</Button>

// Renders as a link with button styling
<Button asChild>
  <a href="/path">Click me</a>
</Button>
```

**Benefits:**
- Single component for multiple HTML elements
- Preserves styling regardless of element type
- Maintains type safety with TypeScript

---

## Context-Based Components

Using React Context for complex component state management.

### Sidebar with Context Pattern

File: `src/components/ui/sidebar.tsx:34-53`

```tsx
type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}
```

**Implementation Pattern:**
```tsx
function SidebarProvider({ children, defaultOpen = true, ...props }) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)
  const [_open, _setOpen] = React.useState(defaultOpen)

  // ... complex logic

  return (
    <SidebarContext.Provider value={{ /* state */ }}>
      {children}
    </SidebarContext.Provider>
  )
}
```

**Key Patterns:**
- Type-safe context with TypeScript
- Custom hook with error handling
- Controlled/uncontrolled state pattern
- Mobile-responsive behavior built-in
