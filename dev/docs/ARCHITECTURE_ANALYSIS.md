# React + TypeScript Frontend Architecture Analysis

**Project Stack:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, shadcn/ui, Radix UI

**Analysis Date:** 2025-11-24

---

## Table of Contents

1. [Component Patterns](#component-patterns)
2. [TypeScript Patterns](#typescript-patterns)
3. [Styling Conventions](#styling-conventions)
4. [Form Handling](#form-handling)
5. [Project Structure](#project-structure)
6. [Common Utilities](#common-utilities)
7. [Best Practices Summary](#best-practices-summary)

---

## Component Patterns

### 1. Component Composition Architecture

**Location:** `/home/ces-truongvu/WIP/claude-setup/presentation/demo/frontend/src/components/ui/`

The project uses a compositional component pattern where complex UI elements are broken into smaller, reusable sub-components.

#### Example: Card Component (`card.tsx:5-92`)

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

### 2. Variant-Based Components with CVA

**Pattern:** Using `class-variance-authority` (CVA) for type-safe component variants.

#### Example: Button Component (`button.tsx:7-37`)

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

### 3. Radix UI Wrapper Pattern

**Pattern:** Wrapping Radix UI primitives with custom styling and behavior.

#### Example: Dialog Component (`dialog.tsx:7-141`)

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

### 4. Polymorphic Components with Slot

**Pattern:** Using Radix UI's `Slot` component for polymorphic behavior.

#### Example: Button with asChild (`button.tsx:39-58`)

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

### 5. Context-Based Components

**Pattern:** Using React Context for complex component state management.

#### Example: Sidebar with Context (`sidebar.tsx:34-53`)

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

### 6. Form Component Pattern

**Pattern:** React Hook Form integration with context-based field management.

#### Example: Form Field (`form.tsx:32-66`)

```tsx
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}
```

**Benefits:**
- Automatic error handling
- Proper ARIA attributes
- Type-safe field names
- Reusable across forms

---

## TypeScript Patterns

### 1. Component Props Typing

**Pattern:** Extending HTML element props with custom properties.

#### Standard Pattern (`input.tsx:5-19`)

```tsx
function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return <input type={type} className={cn(...)} {...props} />
}
```

**With Additional Props (`button.tsx:39-48`):**

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
  // ...
}
```

**Key Principles:**
- Use `React.ComponentProps<"element">` for base HTML props
- Intersection types (`&`) for combining prop types
- Explicit optional props with default values
- Spread remaining props for flexibility

### 2. Generic Component Types

**Pattern:** Fully type-safe generic components.

#### Example: Form Field with Generics (`form.tsx:21-43`)

```tsx
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}
```

**Benefits:**
- Full type inference across form fields
- Autocomplete for field names
- Type-safe error messages

### 3. Variant Props with CVA

**Pattern:** Type-safe variants using `class-variance-authority`.

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(/* ... */)

// VariantProps extracts the variant types
type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }
```

**Result:** Full TypeScript autocomplete for:
- `variant`: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
- `size`: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"

### 4. Radix Primitive Type Extension

**Pattern:** Extending Radix UI component types.

```tsx
import * as SelectPrimitive from "@radix-ui/react-select"

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  // ...
}
```

**Key Points:**
- Use `React.ComponentProps<typeof Primitive>` for base types
- Add custom props via intersection
- Maintains all Radix props and types

### 5. Context Type Safety

**Pattern:** Typed contexts with error handling.

```tsx
type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  // ...
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

**Benefits:**
- Type-safe context access
- Runtime error for misuse
- No null checks needed after hook call

### 6. TypeScript Configuration

**Key Settings (`tsconfig.app.json:2-29`):**

```json
{
  "compilerOptions": {
    "strict": true,                      // Enable all strict checks
    "noUnusedLocals": true,              // Catch unused variables
    "noUnusedParameters": true,          // Catch unused function parameters
    "noFallthroughCasesInSwitch": true,  // Prevent switch fallthrough bugs
    "noUncheckedSideEffectImports": true, // Flag problematic side effects
    "erasableSyntaxOnly": true,          // Ensure TS-only syntax
    "jsx": "react-jsx",                  // Modern JSX transform
    "moduleResolution": "bundler",       // Vite-compatible resolution
    "verbatimModuleSyntax": true,        // Stricter import/export
    "paths": {
      "@/*": ["./src/*"]                 // Path alias
    }
  }
}
```

---

## Styling Conventions

### 1. Tailwind CSS 4 Usage

**Configuration:** Using Tailwind CSS 4 with Vite plugin.

#### Import Pattern (`index.css:1-2`)

```css
@import "tailwindcss";
@import "tw-animate-css";
```

**Key Features:**
- Direct CSS imports (no config file needed in TW v4)
- Animation utilities from `tw-animate-css`
- Custom variant definition

### 2. Design Token System

**Pattern:** CSS Custom Properties for theming.

#### Light Theme (`index.css:6-51`)

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  /* ... chart colors, sidebar colors */
}
```

#### Dark Theme (`index.css:126-158`)

```css
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  /* ... override all theme tokens */
}
```

#### Theme Integration (`index.css:88-124`)

```css
@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... map all custom properties to Tailwind */
}
```

**Key Benefits:**
- OKLCH color space for perceptual uniformity
- Single source of truth for colors
- Automatic dark mode support
- Can be changed at runtime

### 3. The cn() Utility Pattern

**Implementation (`utils.ts:1-6`):**

```tsx
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Purpose:**
- `clsx`: Conditionally construct className strings
- `twMerge`: Intelligently merge Tailwind classes (handles conflicts)

#### Usage Examples

```tsx
// Conditional classes
<div className={cn(
  "base-class",
  isActive && "active-class",
  { "error-class": hasError }
)} />

// Merging with conflicts (last wins)
<Button className={cn("bg-blue-500", "bg-red-500")} />
// Result: "bg-red-500" (not both)

// Component default + user override
<Button className={cn(
  "default-button-styles",
  className  // User's className can override defaults
)} />
```

### 4. Styling Patterns in Components

#### Base + Override Pattern

```tsx
function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        // Base styles (always applied)
        "border-input h-9 w-full rounded-md border bg-transparent px-3 py-1",
        // State styles
        "focus-visible:border-ring focus-visible:ring-ring/50",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        // Allow overrides
        className
      )}
      {...props}
    />
  )
}
```

#### Responsive Utilities

```tsx
// Mobile-first responsive design
"text-base md:text-sm"  // base size on mobile, sm on desktop

// Container queries
"@container/card-header grid"

// Has-selector for parent-child relationships
"has-[>svg]:px-3"  // Different padding if contains SVG

// Data attributes for styling
"data-[state=open]:animate-in"
"data-[size=sm]:h-8"
```

### 5. Animation Patterns

**Using Tailwind Animations (`accordion.tsx:56`):**

```tsx
<AccordionPrimitive.Content
  className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
>
  {children}
</AccordionPrimitive.Content>
```

**Transition Classes:**
```tsx
"transition-all"              // All properties
"transition-[color,box-shadow]"  // Specific properties
"duration-200"                // Animation duration
```

### 6. Dark Mode Pattern

**Custom Variant (`index.css:4`):**

```css
@custom-variant dark (&:is(.dark *));
```

**Usage in Components:**
```tsx
"bg-background dark:bg-input/30"
"text-foreground dark:text-muted-foreground"
"border-input dark:border-input"
```

**Key Pattern:**
- Class-based dark mode (`.dark` on parent element)
- Custom variant for scoped dark mode
- Consistent token usage across light/dark

### 7. Advanced Tailwind Techniques

#### Arbitrary Values

```tsx
"max-h-(--radix-select-content-available-height)"  // CSS custom property
"origin-(--radix-select-content-transform-origin)"
"bg-black/50"  // Opacity modifier
```

#### Group and Peer Modifiers

```tsx
// Group (parent-based styling)
"group-data-[disabled=true]:pointer-events-none"

// Peer (sibling-based styling)
"peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
```

#### Complex Selectors

```tsx
"[&_svg]:pointer-events-none"               // Descendant SVGs
"[&_svg:not([class*='size-'])]:size-4"      // Conditional descendant
"[a&]:hover:bg-primary/90"                  // When parent is anchor
"*:[span]:last:flex"                        // Last span child
```

---

## Form Handling

### 1. React Hook Form Integration

**Core Pattern:** Form component wraps React Hook Form's FormProvider.

#### Setup (`form.tsx:19`)

```tsx
const Form = FormProvider

// Usage
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

function MyForm() {
  const form = useForm({
    defaultValues: {
      username: "",
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* form fields */}
      </form>
    </Form>
  )
}
```

### 2. Field Component Pattern

**Structure:** Nested components for field structure.

```tsx
<FormField
  control={form.control}
  name="username"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Username</FormLabel>
      <FormControl>
        <Input placeholder="Enter username" {...field} />
      </FormControl>
      <FormDescription>
        Your public display name.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Component Hierarchy:**
1. `FormField` - Controller wrapper with context
2. `FormItem` - Container with unique ID generation
3. `FormLabel` - Label with error styling
4. `FormControl` - Input wrapper with ARIA attributes
5. `FormDescription` - Help text
6. `FormMessage` - Error message display

### 3. Automatic ARIA Integration

**Pattern:** Form components automatically handle accessibility.

#### FormControl Implementation (`form.tsx:107-123`)

```tsx
function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}
```

**Benefits:**
- Automatic ID generation
- Proper label associations
- Error state management
- Description linkage

### 4. Error Display Pattern

**Implementation (`form.tsx:138-156`):**

```tsx
function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children

  if (!body) {
    return null
  }

  return (
    <p
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  )
}
```

**Features:**
- Conditional rendering (only when error exists)
- Fallback to custom messages
- Proper ID for ARIA
- Consistent error styling

### 5. Zod Schema Integration

**Expected Pattern (based on dependencies):**

```tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

type FormValues = z.infer<typeof formSchema>

const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    username: "",
    email: "",
  },
})
```

**Benefits:**
- Type-safe form values
- Runtime validation
- Type inference from schema
- Consistent error messages

### 6. Form Label Error Styling

**Pattern:** Automatic error state styling.

#### FormLabel Implementation (`form.tsx:90-105`)

```tsx
function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}
```

**Key Features:**
- Data attribute for error state
- Conditional styling
- Automatic htmlFor association
- Consistent error colors

---

## Project Structure

### Directory Organization

```
/home/ces-truongvu/WIP/claude-setup/presentation/demo/frontend/
├── src/
│   ├── components/
│   │   └── ui/              # Reusable UI components (shadcn/ui)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── form.tsx
│   │       ├── input.tsx
│   │       └── ... (50+ components)
│   ├── hooks/               # Custom React hooks
│   │   └── use-mobile.ts
│   ├── lib/                 # Utility functions
│   │   └── utils.ts
│   ├── assets/              # Static assets
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Application entry
│   └── index.css            # Global styles
├── vite.config.ts           # Vite configuration
├── tsconfig.app.json        # TypeScript configuration
├── eslint.config.js         # ESLint configuration
├── package.json             # Dependencies
└── CLAUDE.md                # Project documentation
```

### Import Path Convention

**Configuration:**
- **vite.config.ts:10-12:** `alias: { "@": path.resolve(__dirname, "./src") }`
- **tsconfig.app.json:27-29:** `"paths": { "@/*": ["./src/*"] }`

**Usage Pattern:**
```tsx
// Always use @ alias for src imports
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

// Never use relative paths for src imports
// ❌ import { Button } from "../../components/ui/button"
```

**Benefits:**
- Consistent imports regardless of file location
- Easy refactoring
- Clear distinction between project and external imports
- No brittle relative path chains

### File Naming Conventions

**Patterns observed:**
- Components: `kebab-case.tsx` (e.g., `button.tsx`, `dialog.tsx`, `alert-dialog.tsx`)
- Hooks: `use-*.ts` prefix (e.g., `use-mobile.ts`)
- Utilities: `utils.ts`, singular names
- Main files: `PascalCase.tsx` for app-level components (`App.tsx`)

### Component File Structure

**Standard Pattern (single responsibility):**

```tsx
// 1. Imports
import * as React from "react"
import { ExternalDependency } from "external-package"
import { cn } from "@/lib/utils"

// 2. Type definitions
type ComponentProps = { ... }

// 3. Main component
function Component({ ...props }: ComponentProps) {
  return <div>...</div>
}

// 4. Sub-components (if applicable)
function ComponentHeader({ ...props }) { ... }
function ComponentContent({ ...props }) { ... }

// 5. Exports
export { Component, ComponentHeader, ComponentContent }
```

### Multi-Component Files

**Pattern:** Related components in single file (e.g., `card.tsx`).

**When to use:**
- Tightly coupled components
- Shared only as a set
- Common styling concerns
- Part of a compositional API

**Structure:**
```tsx
// Base component + all sub-components
function Base() { ... }
function BaseHeader() { ... }
function BaseContent() { ... }
function BaseFooter() { ... }

// All exported together
export { Base, BaseHeader, BaseContent, BaseFooter }
```

---

## Common Utilities

### 1. The cn() Utility

**Location:** `/home/ces-truongvu/WIP/claude-setup/presentation/demo/frontend/src/lib/utils.ts`

**Implementation:**
```tsx
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Purpose:**
- Combine multiple class name sources
- Handle conditional classes
- Resolve Tailwind class conflicts

**Usage Examples:**
```tsx
// Simple combination
cn("base-class", "additional-class")

// Conditional classes
cn("base", isActive && "active", isFocused && "focused")

// Object syntax
cn("base", { active: isActive, disabled: isDisabled })

// Array syntax
cn(["base", "class"], ["more", "classes"])

// Tailwind conflict resolution
cn("p-4", "p-8") // → "p-8" (not both)
cn("bg-red-500", className) // User className wins
```

**Why twMerge is Critical:**

```tsx
// Without twMerge
className="text-sm text-lg"  // Both applied (invalid CSS)

// With twMerge
cn("text-sm", "text-lg")  // → "text-lg" (correct)
```

### 2. useIsMobile Hook

**Location:** `/home/ces-truongvu/WIP/claude-setup/presentation/demo/frontend/src/hooks/use-mobile.ts`

**Implementation:**
```tsx
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
```

**Features:**
- Matches Tailwind's `md` breakpoint (768px)
- Uses `matchMedia` for performance
- Reactive to viewport changes
- SSR-safe initialization (`undefined` initial state)

**Usage:**
```tsx
import { useIsMobile } from "@/hooks/use-mobile"

function MyComponent() {
  const isMobile = useIsMobile()

  return (
    <div>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </div>
  )
}
```

**Best Practice:**
- Use for JavaScript-only responsive logic
- Prefer Tailwind responsive classes when possible
- Avoid layout shifts by handling `undefined` state

### 3. Custom Hooks Pattern

**Recommended Structure:**

```tsx
// hooks/use-example.ts
import * as React from "react"

export function useExample(dependency: string) {
  const [state, setState] = React.useState(initialValue)

  React.useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    }
  }, [dependency])

  return state
}
```

**Best Practices:**
- Prefix with `use-` in filename
- Named export (not default)
- Full TypeScript types
- Proper dependency arrays
- Cleanup in effect returns

---

## Best Practices Summary

### Component Development

1. **Composition over Complexity**
   - Break complex components into smaller pieces
   - Create composable sub-components
   - Export all pieces for flexibility

2. **Props Pattern**
   - Accept `className` for style overrides
   - Spread `...props` for flexibility
   - Use `data-slot` for semantic identification
   - Provide sensible defaults

3. **Variant-Based Styling**
   - Use CVA for components with multiple styles
   - Export variants for reuse
   - Provide type-safe props via `VariantProps`

4. **Radix UI Integration**
   - Wrap primitives, don't modify
   - Maintain all accessibility features
   - Add custom props judiciously
   - Export all primitives for advanced use

### TypeScript Best Practices

1. **Component Types**
   - Use `React.ComponentProps<"element">` for HTML elements
   - Use `React.ComponentProps<typeof Primitive>` for Radix
   - Intersection types for combining prop sources
   - Generic components for type safety

2. **Strict Configuration**
   - Enable all strict checks
   - Flag unused variables/parameters
   - Enforce erasable syntax only
   - Use modern JSX transform

### Styling Guidelines

1. **Tailwind Usage**
   - Mobile-first responsive design
   - Use design tokens (not arbitrary colors)
   - Leverage modern features (has-, data-, @container)
   - Consistent dark mode implementation

2. **cn() Utility**
   - Always use for combining classes
   - Use for conditional styling
   - Place user `className` last for overrides

3. **Design Tokens**
   - Use CSS custom properties
   - Define light/dark variants
   - Map to Tailwind with @theme
   - Use OKLCH for better color perception

### Form Handling

1. **React Hook Form**
   - Use FormProvider wrapper
   - Implement field components compositionally
   - Leverage automatic ARIA attributes
   - Display errors consistently

2. **Zod Validation**
   - Define schemas with Zod
   - Use zodResolver for integration
   - Infer types from schemas
   - Provide clear error messages

### Project Organization

1. **File Structure**
   - UI components in `components/ui/`
   - Custom hooks in `hooks/`
   - Utilities in `lib/`
   - Use @ alias for all src imports

2. **Naming Conventions**
   - Components: kebab-case.tsx
   - Hooks: use-*.ts
   - Named exports (not default)

3. **Import Order**
   - External dependencies first
   - Internal utilities second
   - Types/interfaces last
   - Group related imports

### Performance Considerations

1. **Bundle Optimization**
   - Tree-shakeable exports
   - Lazy load heavy components
   - Use React.memo strategically

2. **Runtime Performance**
   - Minimize re-renders
   - Use proper effect dependencies
   - Cleanup effects properly
   - matchMedia for responsive logic

### Accessibility

1. **ARIA Attributes**
   - Use form components for automatic ARIA
   - Provide labels for all inputs
   - Link descriptions to fields
   - Mark invalid states

2. **Semantic HTML**
   - Use appropriate elements
   - Add sr-only text for screen readers
   - Ensure keyboard navigation
   - Test with assistive technology

### Development Workflow

1. **Type Safety**
   - No TypeScript errors allowed
   - Full inference where possible
   - Explicit types for public APIs
   - Runtime validation with Zod

2. **Code Quality**
   - ESLint with React hooks rules
   - React Refresh rules for HMR
   - No unused code
   - Consistent formatting

3. **Testing Approach**
   - Component isolation
   - Accessibility testing
   - Responsive behavior
   - Form validation

---

## Recommended Extensions

### Additional Best Practices for This Stack

#### 1. Component Documentation

Add JSDoc comments for complex components:

```tsx
/**
 * A flexible button component with multiple variants and sizes.
 *
 * @example
 * ```tsx
 * <Button variant="outline" size="sm">Click me</Button>
 * ```
 */
export function Button({ ... }) { ... }
```

#### 2. Error Boundaries

Implement error boundaries for production:

```tsx
// components/error-boundary.tsx
import * as React from "react"

export class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}
```

#### 3. Loading States

Create consistent loading patterns:

```tsx
// Use Skeleton components from ui library
import { Skeleton } from "@/components/ui/skeleton"

function LoadingCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-[250px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  )
}
```

#### 4. Custom Theme Hook

Create a theme management hook:

```tsx
// hooks/use-theme.ts
import { useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system")

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  return { theme, setTheme }
}
```

#### 5. Toast Notifications

Implement with Sonner (already included):

```tsx
// App.tsx
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <>
      <YourContent />
      <Toaster />
    </>
  )
}

// Usage in components
import { toast } from "sonner"

function MyComponent() {
  const handleClick = () => {
    toast.success("Action completed!")
  }
}
```

#### 6. Data Fetching Pattern

Recommended pattern with React 19:

```tsx
import { use, Suspense } from "react"

function DataComponent({ dataPromise }) {
  const data = use(dataPromise)

  return <div>{data.title}</div>
}

function Page() {
  const dataPromise = fetch('/api/data').then(r => r.json())

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <DataComponent dataPromise={dataPromise} />
    </Suspense>
  )
}
```

#### 7. Environment Variables

Use Vite's env pattern:

```tsx
// vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // Add more env variables
}

// Usage
const apiUrl = import.meta.env.VITE_API_URL
```

---

## Conclusion

This React + TypeScript frontend architecture demonstrates:

- **Modern React patterns** with React 19 features
- **Type-safe component development** with advanced TypeScript
- **Flexible, composable UI** with shadcn/ui patterns
- **Accessible by default** with Radix UI and proper ARIA
- **Performant styling** with Tailwind CSS 4
- **Developer-friendly** with excellent DX via Vite and ESLint

The codebase follows industry best practices while maintaining flexibility for customization. The component library is production-ready and can scale from small applications to large enterprise projects.

**Key Strengths:**
- Comprehensive UI component library (50+ components)
- Consistent patterns across all components
- Full TypeScript coverage with strict mode
- Accessible and responsive by default
- Easy to extend and customize
- Excellent developer experience

**Recommended Next Steps:**
1. Add E2E testing with Playwright
2. Implement component documentation with Storybook
3. Add performance monitoring
4. Set up CI/CD pipeline
5. Implement analytics integration
6. Add internationalization (i18n) support
