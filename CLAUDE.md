@AGENTS.md

# Claude Code Configuration for n16-blog

This guide helps Claude Code assistants work effectively with the n16-blog Next.js project.

## Project Overview

- **Framework**: Next.js 16.2.6 with React 19.2.4
- **Language**: TypeScript 5 with strict type checking
- **Styling**: Tailwind CSS 4 (utility-first)
- **Linting & Formatting**: Biome 2.2.0 (auto-formats on file changes)
- **Testing**: Vitest 4 with coverage support
- **Form Handling**: React Hook Form 7.76.1
- **Validation**: Zod 4.4.3
- **Email**: Resend 6.12.3

## Directory Structure

```
src/
├── app/              # Next.js App Router pages and layouts
├── features/         # Feature-specific components and logic
├── shared/           # Shared/reusable components (to be created)
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Key Conventions

### Component Placement

- **Shared Components** (reusable across features): `src/shared/ComponentName.tsx`
- **Feature Components**: `src/features/<feature-name>/ComponentName.tsx`
- **Page Routes**: `src/app/<route>/page.tsx`

### Component Structure

- Use **named exports** (not default exports)
- Define a `Props` interface for type safety
- Use **Server Components** by default (React 19 pattern)
- Add `'use client'` only if the component needs interactivity
- Style with **Tailwind CSS utility classes**

Example:

```tsx
interface Props {
  title: string;
  count?: number;
}

export function MyComponent({ title, count }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      {count && <span className="text-sm text-zinc-600">{count}</span>}
    </div>
  );
}
```

### TypeScript

- Enable strict mode: all code must type-check
- Use path aliases: `@/` resolves to `src/`
- Define shared types in `src/types/`
- Avoid `any`; use `unknown` if necessary, then narrow the type

### Styling

- Tailwind CSS 4: use utility classes
- Dark mode: built-in via `dark:` prefix
- Responsive: use `sm:`, `md:`, `lg:` breakpoints
- Colors: Zinc palette preferred for neutral tones

### Testing

- Unit tests colocate with source files (e.g., `Button.test.tsx` next to `Button.tsx`)
- Use Vitest with React testing utilities
- Focus on behavior, not implementation details
- Coverage targets: aim for >80%

### Linting & Formatting

- Biome automatically formats code on file edits (via Claude Code hook)
- Run `npm run lint` to check for issues
- Run `npm run format` to format code manually
- **Never commit code with lint errors**

## Common Tasks

### Create a new component

Use the `/new-component` skill:

```bash
/new-component
```

Follow the prompts to create a properly structured component in the right location.

### Run development server

```bash
pnpm dev
```

Server runs at `http://localhost:3000`

### Build for production

```bash
pnpm build
pnpm start
```

### Run tests

```bash
pnpm test
```

### Type check

```bash
pnpm exec tsc --noEmit
```

## Code Quality Standards

1. **Type Safety**: All code must pass TypeScript strict mode
2. **Formatting**: Biome auto-formats on file changes
3. **Naming**: Use clear, descriptive names
   - Components: PascalCase (e.g., `UserProfile`)
   - Functions/variables: camelCase (e.g., `getUserData`)
   - Constants: UPPER_SNAKE_CASE (e.g., `MAX_ATTEMPTS`)
4. **Comments**: Only add comments for **why**, not **what**
   - Good: `// Retry after exponential backoff to avoid rate limiting`
   - Avoid: `// Get the user data` (the code already says this)
5. **Imports**: Use path aliases (`@/`) instead of relative imports
6. **Error Handling**: Validate at system boundaries (user input, external APIs)
7. **Package Manager**: Use pnpm for all dependency management

## Form Handling with React Hook Form + Zod

Combine React Hook Form for state management and Zod for validation:

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <input {...register('email')} type="email" className="border px-3 py-2" />
      {errors.email && <span className="text-red-600">{errors.email.message}</span>}
      
      <textarea {...register('message')} className="border px-3 py-2" />
      {errors.message && <span className="text-red-600">{errors.message.message}</span>}
      
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Send
      </button>
    </form>
  );
}
```

## Environment Variables

- `.env.local`: Local development secrets (never commit)
- `.env`: Shared environment variables
- Access in pages: Use `process.env.NEXT_PUBLIC_*` for client-side variables

**Important**: Claude Code has a safety hook that prevents accidental edits to `.env*` files. Always confirm before editing environment variables.

## API Routes & Server Actions

- API Routes: `src/app/api/[route]/route.ts`
- Use TypeScript request/response types
- Validate all incoming data with Zod
- Return JSON responses with appropriate status codes

## Debugging

- Use browser DevTools for client-side debugging
- Use `console.log()` with meaningful labels during development
- Use Vitest UI at `http://localhost:51204/__vitest__/` during test runs
- Remove debug logs before committing

## Before Requesting Help

1. Run `pnpm lint` to catch formatting/style issues
2. Run `pnpm test` to verify tests pass
3. Check `tsconfig.json` to ensure TypeScript is properly configured
4. Verify the component tree structure makes sense
5. Read error messages carefully — they usually point to the issue

## Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `pnpm dev` |
| Check/fix lint issues | `pnpm lint` |
| Format code | `pnpm format` |
| Run tests | `pnpm test` |
| Build for production | `pnpm build` |
| Type check | `pnpm exec tsc --noEmit` |

## Available Skills

- `/new-component` — Create a new React component with proper structure and location
