# My Golden Stack

![CI Status](https://img.shields.io/github/actions/workflow/status/guxedo/golden-boilerplate/ci.yml?branch=main)
![License](https://img.shields.io/badge/license-MIT-blue)
![Stack](https://img.shields.io/badge/stack-Turborepo%20%7C%20NestJS%20%7C%20React-black)

A production-ready Monorepo Boilerplate featuring NestJS, React + Vite, and a "Double Lock" Authentication strategy.

## 🚀 Quick Start

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/username/my-golden-stack.git
    cd my-golden-stack
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Start the development environment:**
    ```bash
    docker-compose up -d
    pnpm dev
    ```
    This will spin up Postgres and start the apps in development mode.

## 🔑 Default Credentials (Seeded)

The database is automatically seeded with the following users for testing:

| Role | Email | Password | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password123` | `ACTIVE` | Full access. |
| **User** | `user@example.com` | `password123` | `ACTIVE` | Standard access. |
| **User** | `pending@example.com` | `password123` | `PENDING` | Cannot login (Simulates approval flow). |

## 📚 Documentation

-   [**Architecture**](./docs/architecture.md): "Double Lock" Auth, ACL, and Pagination logic.
-   [**Theming**](./docs/theming.md): How to customize the design tokens and CSS variables.
-   [**Deployment**](./docs/deployment.md): Docker-based deployment strategy.

## 🛠 Tech Stack

-   **Monorepo:** Turborepo (pnpm)
-   **Backend:** NestJS, Prisma, PostgreSQL
-   **Frontend:** React, Vite, TanStack Router, TanStack Query, TailwindCSS
-   **Shared:** Zod, TypeScript
