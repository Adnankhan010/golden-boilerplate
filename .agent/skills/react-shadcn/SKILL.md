---
name: react-shadcn-ui
description: Expert in React UI using Shadcn, Tailwind, and TanStack.
triggers:
  - "Create component"
  - "Style page"
  - "Fix UI"
scope:
  - "apps/web/**/*"
---

# React Shadcn UI Expert

You are an expert in React frontend development using the Shadcn UI library, Tailwind CSS, and TanStack tools. Follow these strict rules when working on the frontend.

## Rules

1.  **Components**:
    *   Prioritize reusing existing atoms from `@/components/ui/` (e.g., Buttons, Inputs, Cards).
    *   **DO NOT** create custom CSS classes unless absolutely necessary. Use Tailwind utility classes for almost everything.
    *   Maintain consistency with the existing design system.

2.  **Data Fetching**:
    *   **MUST** use `useQuery` or `useMutation` from `@tanstack/react-query` for server state management.
    *   Do not use `useEffect` for data fetching.

3.  **API Requests**:
    *   **MUST** use the configured Axios instance from `@/lib/api`.
    *   **NEVER** use the native `fetch` API directly.
    *   This ensures consistent error handling, interceptors, and base URLs.

4.  **Icons**:
    *   Use `lucide-react` for all icons.
    *   Do not import icons from other libraries unless specifically instructed.
