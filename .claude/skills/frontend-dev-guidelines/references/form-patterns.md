# Form Handling Patterns

React Hook Form + Zod integration patterns for type-safe forms.

## Table of Contents

1. [React Hook Form Integration](#react-hook-form-integration)
2. [Field Component Pattern](#field-component-pattern)
3. [Automatic ARIA Integration](#automatic-aria-integration)
4. [Error Display Pattern](#error-display-pattern)
5. [Zod Schema Integration](#zod-schema-integration)
6. [Complete Form Example](#complete-form-example)

---

## React Hook Form Integration

### Core Pattern

File: `src/components/ui/form.tsx:19`

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

---

## Field Component Pattern

### Structure

Nested components for complete field structure.

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

### Component Hierarchy

1. **FormField** - Controller wrapper with context
   - Manages field state and validation
   - Provides context to child components

2. **FormItem** - Container with unique ID generation
   - Creates unique IDs for accessibility
   - Provides item context

3. **FormLabel** - Label with error styling
   - Automatically linked to input via htmlFor
   - Error state styling

4. **FormControl** - Input wrapper with ARIA attributes
   - Adds accessibility attributes
   - Manages error states

5. **FormDescription** - Help text
   - Linked via aria-describedby
   - Optional guidance for users

6. **FormMessage** - Error message display
   - Only shown when errors exist
   - Linked via aria-describedby

### FormField Implementation

File: `src/components/ui/form.tsx:32-66`

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

---

## Automatic ARIA Integration

### FormControl Implementation

File: `src/components/ui/form.tsx:107-123`

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
- Fully accessible forms by default

### FormLabel with Error State

File: `src/components/ui/form.tsx:90-105`

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

**Features:**
- Data attribute for error state
- Conditional styling
- Automatic htmlFor association
- Consistent error colors

---

## Error Display Pattern

### FormMessage Implementation

File: `src/components/ui/form.tsx:138-156`

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

---

## Zod Schema Integration

### Schema Definition

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
  age: z.number().min(18, {
    message: "You must be at least 18 years old.",
  }),
})

type FormValues = z.infer<typeof formSchema>
```

### Form Integration

```tsx
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    username: "",
    email: "",
    age: 0,
  },
})
```

**Benefits:**
- Type-safe form values
- Runtime validation
- Type inference from schema
- Consistent error messages
- Single source of truth for validation

---

## Complete Form Example

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
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
})

type FormValues = z.infer<typeof formSchema>

export function ProfileForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  })

  function onSubmit(values: FormValues) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
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

### Common Validation Patterns

```tsx
// String validations
z.string().min(2).max(100)
z.string().email()
z.string().url()
z.string().regex(/^[a-z]+$/, "Only lowercase letters")

// Number validations
z.number().min(0).max(100)
z.number().int()
z.number().positive()

// Optional fields
z.string().optional()
z.string().nullable()

// Enums
z.enum(["admin", "user", "guest"])

// Objects
z.object({
  nested: z.string(),
})

// Arrays
z.array(z.string())

// Refinements
z.string().refine((val) => val.length > 5, {
  message: "Must be longer than 5 characters",
})
```
