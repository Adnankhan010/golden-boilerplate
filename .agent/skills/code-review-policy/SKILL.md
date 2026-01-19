---
name: code-review-policy
description: Acts as a Senior Engineer to review code against Architecture, Security, and Clean Code standards before merging.
triggers:
  - "Review code"
  - "Check PR"
  - "Analyze branch"
  - "Pre-merge check"
scope:
  - "apps/**/*"
  - "packages/**/*"
---

# Code Review Policy Skill

## Purpose
To act as a "Senior Engineer" gatekeeper, reviewing code against strict Architecture, Security, and Clean Code standards. This skill ensures that technical debt is minimized and "Senior Level" quality is maintained.

## Review Rules

### 1. Intent & Scope
*   **Verify Purpose:** Does the code *actually* solve the user story or ticket associated with it?
*   **Flag Scope Creep:** Identify and flag any code modifications that are unrelated to the feature or bug fix being implemented.
*   **Clarity:** Is the code self-documenting? Variable and function names should clearly indicate their purpose.

### 2. Architecture & DDD (NestJS Backend)
*   **Strict Layering:**
    *   **Controllers:** Handle HTTP (Validations, DTOs). MUST delegate business logic to Services.
    *   **Services:** Contain Business Logic. MUST NOT depend on HTTP objects (`Request`, `Response`).
    *   **Repositories:** Handle DB access. Services MUST NOT inject `PrismaService` directly; they should use Repositories (or the repository pattern abstraction).
*   **Domain Purity:** Entities should be "Rich Models" containing business logic (e.g., `user.approve()`), not just "Anemic Models" (data bags).
*   **Double Lock Strategy:** New endpoints MUST have appropriate `@UseGuards()` (AuthGuard, RolesGuard, policies).

### 3. Frontend Patterns (React)
*   **State Management:**
    *   **Server State:** MUST use `TanStack Query` (`useQuery`, `useMutation`). NO `useEffect` for data fetching.
    *   **App State:** Use `Context` or `Zustand` for UI state.
*   **Atomic Design:** Components should be composed of Atoms/Molecules.
*   **Tailwind Best Practices:** Avoid hardcoded Tailwind strings if a variant or design token exists in `components/ui`.

### 4. Type Safety & Clean Code
*   **STRICT No-Any:** Reject ANY usage of the `any` type.
*   **Validation:** logical inputs at the Controller level must be validated using `Zod` (via Pipes) that matches the DTOs.
*   **Complexity:** Flag nested loops or conditionals (Cyclomatic Complexity > 10). Suggest extracting logic into private methods or helper functions.
*   **Constants:** Magic numbers and strings should be extracted to constants or enums.

### 5. Testing Strategy
*   **Backend Coverage:** Every public Service method MUST have a corresponding unit test in `.spec.ts`.
*   **Frontend Coverage:** New Pages/Features MUST have at least one Smoke Test ensuring it renders without crashing.
*   **Mocking:** Unit tests MUST NOT connect to a real database. Verify dependencies are Mocked.

### 6. Security & Performance
*   **Query Optimization:** Check for N+1 query problems (e.g., awaiting DB calls inside a loop).
*   **Data Leakage:** Verify that sensitive data (passwords, tokens, PII) is never logged to the console or returned in API responses.
*   **Input Sanitization:** Ensure no raw SQL or unsafe HTML rendering.

## Workflow
1.  **Diff:** Read the uncommitted changes or the difference between the current branch and `main`.
2.  **Analyze:** Apply the rules above to the changed code.
3.  **Report:** Generate a Markdown report categorized by "Critical" (Must Fix), "Warning" (Should Fix), and "Suggestion" (Nitpicks).
4.  **Verdict:** Explicitly state: "APPROVED" or "CHANGES REQUESTED".
