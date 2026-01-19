---
name: release-management
description: Manages Semantic Versioning, Changelog generation, Git Tags, and GitHub Releases.
triggers:
  - "Prepare release"
  - "Create tag"
  - "Generate changelog"
  - "Post-merge check"
scope:
  - "package.json"
  - "CHANGELOG.md"
  - ".git"
---

# Release Management Skill

## Purpose
To automate the software release cycle, ensuring proper Semantic Versioning, Changelog maintenance, and Git tagging conventions.

## Rules

1.  **Semantic Versioning (SemVer):**
    *   Analyze commits since the last tag.
    *   `fix(...)` -> **Patch** bump (e.g., 1.0.0 -> 1.0.1).
    *   `feat(...)` -> **Minor** bump (e.g., 1.0.0 -> 1.1.0).
    *   `BREAKING CHANGE` or `!:` -> **Major** bump (e.g., 1.0.0 -> 2.0.0).
    *   *Action:* Ask user to confirm the calculated version (e.g., "Bump from 1.0.0 to 1.1.0?").

2.  **Changelog Management:**
    *   **MUST** maintain a `CHANGELOG.md` file following the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.
    *   Group changes by:
        *   `Added` for new features.
        *   `Changed` for changes in existing functionality.
        *   `Deprecated` for soon-to-be removed features.
        *   `Removed` for now removed features.
        *   `Fixed` for any bug fixes.
        *   `Security` in case of vulnerabilities.
    *   Insert the new version section at the top of the changelog (below the Title).

3.  **Release Artifacts:**
    *   Update `version` in `package.json` (and `apps/*/package.json` if necessary).
    *   Create a Git Tag: `git tag -a v1.1.0 -m "Release 1.1.0"`.
    *   Push Tag: `git push origin v1.1.0`.

4.  **GitHub Release (MCP):**
    *   If GitHub MCP is available, create a Draft Release with the generated changelog content using the `github_create_release` tool or similar.
    *   If no MCP is active, simply finish after the git tag push.
