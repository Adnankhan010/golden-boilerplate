---
name: scaffold-feature
description: Generates a full-stack vertical slice (Backend Module + Frontend Route) following Golden Boilerplate standards. Use this when the user asks for a new feature.
---

# Scaffold Feature (Gentleman Pattern)

This skill streamlines the creation of new features by generating a full-stack vertical slice, strictly adhering to the Golden Boilerplate architecture.

## Trigger
- "Create a new feature"
- "Scaffold module"
- "New entity"

## Scope
- **Backend**: `apps/api`
- **Frontend**: `apps/web`
- **Shared**: `packages/`

## Process

### 1. Backend Generation (`apps/api`)
Generates the core DDD artifacts for the module.
- **Location**: `apps/api/src/modules/<module-name>/`
- **Artifacts**:
  - `*.controller.ts`: NestJS Controller.
  - `*.service.ts`: Business logic (Service).
  - `*.dto.ts`: Zod-based DTOs for strict validation.
- **Database**:
  - Update `prisma/schema.prisma` if a new entity is required.
- **Constraint**: Must strictly follow **Domain-Driven Design (DDD)** principles.

### 2. Frontend Generation (`apps/web`)
Generates the client-side vertical slice.
- **Location**: `apps/web/src/`
- **Artifacts**:
  - **Route**: New TanStack Route file (`.tsx`) in `routes/`.
  - **Query**: Custom React Query hook (`useQuery`) for data fetching.
  - **UI**: Main Page component.
- **Validation**:
  - **CRITICAL**: Verify that `react-router-dom` is **NOT** used. Only **TanStack Router** is permitted.

### 3. Wiring
- Register the new module in `apps/api/src/app.module.ts` to enable it in the application context.

## Templates
Use the templates located in the `templates/` directory of this skill for consistency.
