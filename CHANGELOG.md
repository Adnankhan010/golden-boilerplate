# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-19

### Added
- **Skills**: Added `documentation-architect` and `release-management` skills to the agent.
- **Docs**: Scaffolded `apps/docs` internal documentation application with "Docs-as-Code" support.
- **Docs**: Added functional specs for Auth Flow and Personal Notes.
- **Web**: Added User Settings page (`/settings`).
- **Feature**: Implemented "Personal Notes" feature (Create, List, Delete) with full stack support.
- **Feature**: Implemented User Profile updates (Name, Password) via `UsersController`.
- **API**: Added `DELETE /notes/:id` endpoint.
- **DB**: Added `Note` model to Prisma schema.

### Fixed
- **Web**: Fixed unused React imports and build configuration.
- **Web**: Corrected Vitest configuration for smoke tests.
