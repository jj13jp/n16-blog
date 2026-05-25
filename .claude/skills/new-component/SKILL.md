---
name: new-component
description: Create a new React component with TypeScript and Tailwind CSS following project conventions
---

Create a new React component with the following rules:

- Place the file in `src/shared/` for shared/general components, or `src/features/<feature-name>/` for feature-specific components
- Use TypeScript with a named `Props` interface
- Use named export (not default export)
- Style with Tailwind CSS utility classes
- Use React 19 patterns (no unnecessary `use client` — default to Server Component unless interactivity is needed)
- File name should be PascalCase (e.g. `Button.tsx`)

## Example structure

```tsx
interface Props {
  // props here
}

export function ComponentName({ }: Props) {
  return (
    <div>
      {/* content */}
    </div>
  )
}
```

Ask the user for:
1. Component name
2. Feature/location (where to place it)
3. Purpose / what it renders
4. Whether it needs interactivity (Client Component)
