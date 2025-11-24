# Project Structure & Best Practices

File organization, naming conventions, and development best practices.

## Table of Contents

1. [Directory Organization](#directory-organization)
2. [Import Path Convention](#import-path-convention)
3. [File Naming Conventions](#file-naming-conventions)
4. [Component File Structure](#component-file-structure)
5. [Development Best Practices](#development-best-practices)

---

## Directory Organization

```
frontend/
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

### Directory Purpose

- **`src/components/ui/`** - shadcn/ui components, reusable across the app
- **`src/hooks/`** - Custom React hooks (prefix with `use-`)
- **`src/lib/`** - Utility functions and helpers
- **`src/assets/`** - Static files (images, fonts, etc.)

---

## Import Path Convention

### Configuration

Must be configured in both locations:

**vite.config.ts:10-12**
```ts
alias: {
  "@": path.resolve(__dirname, "./src")
}
```

**tsconfig.app.json:27-29**
```json
"paths": {
  "@/*": ["./src/*"]
}
```

### Usage Pattern

```tsx
// ✅ Always use @ alias for src imports
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

// ❌ Never use relative paths for src imports
import { Button } from "../../components/ui/button"
```

### Benefits

- Consistent imports regardless of file location
- Easy refactoring (no path updates needed)
- Clear distinction between project and external imports
- No brittle relative path chains

---

## File Naming Conventions

### Components

Use `kebab-case.tsx`:
- `button.tsx`
- `dialog.tsx`
- `alert-dialog.tsx`
- `breadcrumb.tsx`

### Hooks

Prefix with `use-*.ts`:
- `use-mobile.ts`
- `use-toast.ts`
- `use-theme.ts`

### Utilities

Singular names:
- `utils.ts`
- `constants.ts`
- `helpers.ts`

### Main App Files

Use `PascalCase.tsx`:
- `App.tsx`
- `main.tsx`

---

## Component File Structure

### Standard Pattern (Single Responsibility)

```tsx
// 1. Imports
import * as React from "react"
import { ExternalDependency } from "external-package"
import { cn } from "@/lib/utils"

// 2. Type definitions
type ComponentProps = React.ComponentProps<"div"> & {
  custom?: boolean
}

// 3. Main component
function Component({ className, custom, ...props }: ComponentProps) {
  return <div className={cn("base-styles", className)} {...props} />
}

// 4. Sub-components (if applicable)
function ComponentHeader({ ...props }) { ... }
function ComponentContent({ ...props }) { ... }

// 5. Exports
export { Component, ComponentHeader, ComponentContent }
```

### Multi-Component Files

**When to use:**
- Tightly coupled components
- Shared only as a set
- Common styling concerns
- Part of a compositional API

**Example Structure:**
```tsx
// All related components in one file
function Card() { ... }
function CardHeader() { ... }
function CardContent() { ... }
function CardFooter() { ... }

// All exported together
export { Card, CardHeader, CardContent, CardFooter }
```

---

## Development Best Practices

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

### Import Order

```tsx
// 1. External dependencies
import * as React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"

// 2. Internal utilities and hooks
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

// 3. Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// 4. Types (if separate from components)
import type { FormValues } from "@/types"
```

### Performance Considerations

1. **Bundle Optimization**
   - Tree-shakeable exports (named, not default)
   - Lazy load heavy components
   - Use React.memo strategically

2. **Runtime Performance**
   - Minimize re-renders
   - Use proper effect dependencies
   - Cleanup effects properly
   - Use matchMedia for responsive logic

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

### Code Quality

1. **Type Safety**
   - No TypeScript errors allowed
   - Full inference where possible
   - Explicit types for public APIs
   - Runtime validation with Zod

2. **ESLint Rules**
   - React hooks rules enforced
   - React Refresh rules for HMR
   - No unused code
   - Consistent formatting

3. **Testing Approach**
   - Component isolation
   - Accessibility testing
   - Responsive behavior
   - Form validation

### Development Workflow

1. **Commands**
   - `npm run dev` - Start dev server
   - `npm run build` - Type check + build
   - `npm run lint` - Check code quality
   - `npm run preview` - Preview production build

2. **File Creation**
   - Use shadcn/ui CLI for new components
   - Follow naming conventions
   - Add to appropriate directory
   - Use @ imports from the start

3. **Before Committing**
   - Run TypeScript check
   - Run ESLint
   - Test in dev mode
   - Verify responsive design
   - Check dark mode
