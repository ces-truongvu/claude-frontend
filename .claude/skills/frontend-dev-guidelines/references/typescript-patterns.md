# TypeScript Patterns

TypeScript typing patterns and conventions used in this React codebase.

## Table of Contents

1. [Component Props Typing](#component-props-typing)
2. [Generic Component Types](#generic-component-types)
3. [Variant Props with CVA](#variant-props-with-cva)
4. [Radix Primitive Type Extension](#radix-primitive-type-extension)
5. [Context Type Safety](#context-type-safety)
6. [TypeScript Configuration](#typescript-configuration)

---

## Component Props Typing

### Standard Pattern

File: `src/components/ui/input.tsx:5-19`

```tsx
function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return <input type={type} className={cn(...)} {...props} />
}
```

### With Additional Props

File: `src/components/ui/button.tsx:39-48`

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

### Key Principles

- Use `React.ComponentProps<"element">` for base HTML props
- Intersection types (`&`) for combining prop types
- Explicit optional props with default values
- Spread remaining props for flexibility

---

## Generic Component Types

Fully type-safe generic components for forms and data structures.

### Form Field with Generics

File: `src/components/ui/form.tsx:21-43`

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
- No manual type annotations needed in usage

---

## Variant Props with CVA

Type-safe variants using `class-variance-authority`.

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

---

## Radix Primitive Type Extension

Extending Radix UI component types with custom props.

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
- Full autocomplete support

---

## Context Type Safety

Typed contexts with runtime error handling.

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
- Clear error messages for developers

---

## TypeScript Configuration

### Key Settings

File: `tsconfig.app.json:2-29`

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

### Strict Mode Benefits

- **strict**: Enables all strict type-checking options
- **noUnusedLocals/Parameters**: Catches dead code
- **noFallthroughCasesInSwitch**: Prevents common switch bugs
- **erasableSyntaxOnly**: Ensures TypeScript can be removed cleanly
- **verbatimModuleSyntax**: Stricter import/export validation

### Path Alias Configuration

The `@/*` alias must be configured in both:
1. `tsconfig.app.json` - For TypeScript
2. `vite.config.ts` - For Vite bundler

This ensures both type checking and bundling work correctly.
