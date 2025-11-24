# Styling Guide

Tailwind CSS 4 styling conventions and patterns.

## Table of Contents

1. [Tailwind CSS 4 Setup](#tailwind-css-4-setup)
2. [Design Token System](#design-token-system)
3. [The cn() Utility](#the-cn-utility)
4. [Component Styling Patterns](#component-styling-patterns)
5. [Responsive Design](#responsive-design)
6. [Animation Patterns](#animation-patterns)
7. [Dark Mode](#dark-mode)
8. [Advanced Techniques](#advanced-techniques)

---

## Tailwind CSS 4 Setup

### Configuration

File: `src/index.css:1-2`

```css
@import "tailwindcss";
@import "tw-animate-css";
```

**Key Features:**
- Direct CSS imports (no config file needed in TW v4)
- Animation utilities from `tw-animate-css`
- Custom variant definition
- Modern CSS features enabled

---

## Design Token System

Using CSS Custom Properties for theming with OKLCH color space.

### Light Theme

File: `src/index.css:6-51`

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

### Dark Theme

File: `src/index.css:126-158`

```css
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  /* ... override all theme tokens */
}
```

### Theme Integration

File: `src/index.css:88-124`

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
- Consistent across all components

---

## The cn() Utility

### Implementation

File: `src/lib/utils.ts:1-6`

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

### Usage Examples

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

### Why twMerge is Critical

```tsx
// Without twMerge
className="text-sm text-lg"  // Both applied (invalid CSS)

// With twMerge
cn("text-sm", "text-lg")  // → "text-lg" (correct)
```

---

## Component Styling Patterns

### Base + Override Pattern

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

**Key Pattern:**
1. Base styles first
2. State-specific styles
3. User className last (for overrides)

---

## Responsive Design

### Mobile-First Approach

```tsx
// Base size on mobile, sm on desktop
"text-base md:text-sm"

// Different layouts
"flex-col md:flex-row"

// Spacing changes
"gap-2 md:gap-4 lg:gap-6"
```

### Container Queries

```tsx
// Container-based responsive design
"@container/card-header grid"
"@container/main:lg:col-span-2"
```

### Has-Selector (Modern CSS)

```tsx
// Parent-child relationship styling
"has-[>svg]:px-3"  // Different padding if contains SVG
"has-[[role=img]]:size-5"
```

### Data Attributes

```tsx
// State-based styling
"data-[state=open]:animate-in"
"data-[state=closed]:animate-out"
"data-[size=sm]:h-8"
"data-[disabled=true]:opacity-50"
```

---

## Animation Patterns

### Tailwind Animations

File: `src/components/ui/accordion.tsx:56`

```tsx
<AccordionPrimitive.Content
  className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
>
  {children}
</AccordionPrimitive.Content>
```

### Transition Classes

```tsx
"transition-all"              // All properties
"transition-[color,box-shadow]"  // Specific properties
"duration-200"                // Animation duration
"ease-in-out"                 // Timing function
```

### Common Animation Patterns

```tsx
// Fade in/out
"opacity-0 data-[state=open]:opacity-100"

// Slide in/out
"translate-y-2 data-[state=open]:translate-y-0"

// Scale in/out
"scale-95 data-[state=open]:scale-100"

// Combined
"transition-all duration-200 ease-in-out opacity-0 scale-95 data-[state=open]:opacity-100 data-[state=open]:scale-100"
```

---

## Dark Mode

### Custom Variant

File: `src/index.css:4`

```css
@custom-variant dark (&:is(.dark *));
```

### Usage in Components

```tsx
"bg-background dark:bg-input/30"
"text-foreground dark:text-muted-foreground"
"border-input dark:border-input"
```

### Dark Mode Pattern

- Class-based dark mode (`.dark` on parent element)
- Custom variant for scoped dark mode
- Consistent token usage across light/dark
- No manual color values (use tokens)

### Implementation Example

```tsx
// Use design tokens, not hardcoded colors
✅ "bg-background text-foreground"
❌ "bg-white text-black dark:bg-gray-900 dark:text-white"
```

---

## Advanced Techniques

### Arbitrary Values

```tsx
// CSS custom property
"max-h-(--radix-select-content-available-height)"
"origin-(--radix-select-content-transform-origin)"

// Opacity modifier
"bg-black/50"
"text-primary/90"
```

### Group Modifiers (Parent-based)

```tsx
<div className="group">
  <span className="group-hover:underline">Hover parent</span>
  <span className="group-data-[disabled=true]:opacity-50">Disabled state</span>
</div>
```

### Peer Modifiers (Sibling-based)

```tsx
<input type="checkbox" className="peer" />
<label className="peer-checked:font-bold peer-disabled:opacity-50">
  Label
</label>
```

### Complex Selectors

```tsx
// Descendant SVGs
"[&_svg]:pointer-events-none"

// Conditional descendant
"[&_svg:not([class*='size-'])]:size-4"

// When parent is anchor
"[a&]:hover:bg-primary/90"

// Last span child
"*:[span]:last:flex"
```

### Advanced Combinations

```tsx
// Multi-state styling
"hover:bg-accent focus:bg-accent active:bg-accent/80"

// Responsive + state
"md:hover:bg-primary lg:focus:ring-2"

// Group + data + responsive
"group-data-[state=open]:md:translate-x-0"
```
