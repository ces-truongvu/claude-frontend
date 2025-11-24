---
name: frontend-dev-guidelines
description: Frontend development guidelines for Next.js v15 applications with App Router. Modern patterns including server components, Shadcn/UI components with TailwindCSS v4, NextAuth v5, safeFetch with Zod validation, server actions, and TypeScript best practices. Use when creating components, pages, features, fetching data, styling, authentication, or working with frontend code.
---

# Frontend Development Guidelines

Comprehensive development guidelines for this React + TypeScript frontend project using Vite, shadcn/ui, Tailwind CSS 4, and modern React patterns.

## Overview

This skill provides architectural patterns, best practices, and code examples for building components in this frontend codebase. The project uses:

- **React 19** with modern patterns
- **TypeScript 5.9** with strict mode
- **Vite 7** for build tooling
- **Tailwind CSS 4** with design tokens
- **shadcn/ui** component library
- **Radix UI** primitives
- **React Hook Form + Zod** for forms

## When to Use This Skill

Use this skill when:
- Creating new UI components
- Implementing forms with validation
- Applying Tailwind CSS styling
- Working with TypeScript types
- Integrating Radix UI primitives
- Following project conventions

## Quick Reference

### Import Pattern

Always use `@/` alias for imports:

```tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
```

### Component Structure

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

function Component({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="component"
      className={cn("base-styles", className)}
      {...props}
    />
  )
}

export { Component }
```

### Styling with cn()

```tsx
<div className={cn(
  "base-styles",
  isActive && "active-styles",
  className  // User overrides last
)} />
```

## Core Patterns

### 1. Component Patterns

For detailed component patterns including:
- Compositional architecture (Card, Dialog)
- Variant-based components with CVA (Button, Badge)
- Radix UI wrapper patterns
- Polymorphic components with Slot
- Context-based components

**See:** [references/component-patterns.md](references/component-patterns.md)

### 2. TypeScript Patterns

For TypeScript typing patterns including:
- Component props typing strategies
- Generic component types for forms
- Variant props with CVA
- Radix primitive type extension
- Context type safety

**See:** [references/typescript-patterns.md](references/typescript-patterns.md)

### 3. Styling Conventions

For Tailwind CSS 4 patterns including:
- Design token system (OKLCH colors)
- The `cn()` utility function
- Responsive design patterns
- Dark mode implementation
- Animation patterns
- Advanced Tailwind techniques

**See:** [references/styling-guide.md](references/styling-guide.md)

### 4. Form Handling

For React Hook Form + Zod patterns including:
- Form field composition
- Automatic ARIA attributes
- Error display patterns
- Zod schema integration
- Complete form examples

**See:** [references/form-patterns.md](references/form-patterns.md)

### 5. Project Structure

For file organization including:
- Directory structure
- Import conventions
- Naming conventions
- Development workflow
- Best practices

**See:** [references/project-structure.md](references/project-structure.md)

## Common Tasks

### Creating a New Component

1. Create file in `src/components/ui/` with kebab-case name
2. Import required dependencies with `@/` alias
3. Define component props using `React.ComponentProps`
4. Use `cn()` for className merging
5. Add `data-slot` attribute
6. Export as named export

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

function NewComponent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="new-component"
      className={cn(
        "base-styles-here",
        className
      )}
      {...props}
    />
  )
}

export { NewComponent }
```

### Creating a Variant Component

Use `class-variance-authority` for components with multiple styles:

```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva(
  "base-styles",
  {
    variants: {
      variant: {
        default: "default-styles",
        secondary: "secondary-styles",
      },
      size: {
        sm: "h-8 px-3",
        lg: "h-10 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
)

function Component({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof componentVariants>) {
  return (
    <div
      className={cn(componentVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Component, componentVariants }
```

### Creating a Form

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

function MyForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => console.log(data))}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### Wrapping Radix UI Primitives

```tsx
import * as PrimitiveName from "@radix-ui/react-primitive-name"
import { cn } from "@/lib/utils"

function Component({
  className,
  ...props
}: React.ComponentProps<typeof PrimitiveName.Root>) {
  return (
    <PrimitiveName.Root
      data-slot="component"
      className={cn("custom-styles", className)}
      {...props}
    />
  )
}

export { Component }
```

## Key Principles

1. **Composition First** - Break complex components into composable pieces
2. **Type Safety** - Use strict TypeScript with full type inference
3. **Accessibility** - Leverage Radix UI and proper ARIA attributes
4. **Design Tokens** - Use CSS custom properties, never hardcoded colors
5. **Mobile First** - Use responsive Tailwind classes
6. **cn() Always** - Use the cn() utility for all className merging

## Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Type check + build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Resources

This skill includes comprehensive reference documentation:

- **component-patterns.md** - Component architecture patterns
- **typescript-patterns.md** - TypeScript typing strategies
- **styling-guide.md** - Tailwind CSS conventions
- **form-patterns.md** - React Hook Form + Zod patterns
- **project-structure.md** - File organization and best practices

Load these references when working on specific tasks for detailed guidance and examples.
