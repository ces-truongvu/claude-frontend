# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript frontend application built with Vite, featuring a comprehensive UI component library from shadcn/ui powered by Radix UI, styled with Tailwind CSS.

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start the Vite dev server with HMR (Hot Module Replacement) |
| `npm run build` | Run TypeScript type checking and build for production |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview the production build locally |

## Project Structure

- **`src/components/ui/`** - Reusable UI components built on Radix UI primitives, styled with Tailwind CSS. These are shadcn/ui components. Each component exports both the base component and any sub-components (e.g., Button, Card with Card.Header, Card.Content, etc.).

- **`src/lib/`** - Utility functions:
  - `utils.ts` - Contains `cn()` function that merges Tailwind classes using clsx + tailwind-merge

- **`src/hooks/`** - Custom React hooks:
  - `use-mobile.ts` - Hook that detects viewport width (768px breakpoint) and provides responsive behavior

- **`src/App.tsx`** - Root component that imports from the UI library

- **`vite.config.ts`** - Vite configuration with React and Tailwind CSS plugins. Path alias `@` points to `src/`

- **`eslint.config.js`** - Flat ESLint config with TypeScript and React hooks support

- **`tsconfig.app.json`** - TypeScript configuration with strict mode enabled, JSX set to react-jsx, and path alias mapping

## Key Dependencies

- **React 19** + React DOM 19
- **Vite 7** - Build tool and dev server
- **TypeScript 5.9** - Type checking
- **Tailwind CSS 4** with Vite plugin - Utility-first CSS
- **Radix UI** - Unstyled, accessible component primitives
- **React Hook Form 7** + Zod 4 - Form handling and validation
- **date-fns 4** - Date utilities
- **next-themes** - Dark mode management
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **Recharts** - Chart components
- **Embla Carousel** - Carousel functionality
- **react-resizable-panels** - Resizable panel layout
- **Vaul** - Drawer component
- **ESLint 9** with TypeScript ESLint and React plugins

## Architecture Patterns

### Import Path Alias
All imports from the `src/` directory use the `@/` alias (e.g., `import { Button } from "@/components/ui/button"`). This is configured in both `vite.config.ts` and `tsconfig.app.json`.

### Component Composition
UI components follow a composition pattern inspired by shadcn/ui, allowing flexible assembly:
```tsx
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Content>Content</Card.Content>
</Card>
```

### Form Handling
Forms use React Hook Form for state management combined with Zod for runtime validation and TypeScript type safety.

### Styling
- CSS-in-JS is not used; styling is purely Tailwind CSS utility classes
- `cn()` helper from `lib/utils.ts` is used to conditionally merge Tailwind classes (handles specificity correctly)
- Dark mode support via next-themes

### Responsive Design
Use the `useIsMobile()` hook from `hooks/use-mobile.ts` for viewport-aware behavior. The breakpoint is 768px (Tailwind's `md` breakpoint).

## TypeScript Configuration

Strict mode is enabled with:
- `noUnusedLocals` and `noUnusedParameters` - Catch unused code
- `noFallthroughCasesInSwitch` - Prevent switch statement bugs
- `noUncheckedSideEffectImports` - Flag potentially problematic side effects
- `erasableSyntaxOnly` - Ensure TypeScript can erase all syntax

## ESLint Rules

The configuration enforces:
- ESLint recommended rules
- TypeScript ESLint recommended rules
- React Hooks rules (e.g., no missing dependencies, proper hook usage)
- React Refresh rules (for Vite HMR compatibility)

Use `npm run lint` to check violations. The configuration uses the new ESLint flat config format (no `.eslintrc`).
