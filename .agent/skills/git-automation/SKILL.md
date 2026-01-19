---
name: git-github-ops
description: Manages Git branches, creates GitHub issues from plans, and enforces atomic commits linked to tasks.
triggers:
  - "Start feature"
  - "Initialize feature"
  - "Commit task"
  - "Finish feature"
scope:
  - ".git"
  - "implementation_plan.md"
---

# Git & GitHub Operations Skill

This skill governs the version control and task management workflow for the Golden Boilerplate. It integrates local Git operations with GitHub Issues via MCP.

## 1. Branching Convention
*   **Rule:** ALWAYS create a new branch before starting any coding work.
*   **Format:**
    *   Features: `feat/<kebab-case-name>` (e.g., `feat/user-profile`)
    *   Bug Fixes: `fix/<kebab-case-name>` (e.g., `fix/login-error`)
    *   Refactoring: `refactor/<name>` (e.g., `refactor/api-structure`)

## 2. Task Replication (MCP Integration)
*   **Trigger:** When a new Feature or Implementation Plan is approved.
*   **Process:**
    1.  Read the active **Implementation Plan** (usually `implementation_plan.md`).
    2.  Identify distinct tasks/steps.
    3.  For *each* step, use the **GitHub MCP Tool** (`github_create_issue` or similar) to create an Issue in the connected repository.
    4.  **CRITICAL:** Record the returned **Issue ID** for each task. You will need this for commits.

## 3. Atomic Commits
*   **Rule:** NEVER commit changes without referencing a specific Task/Issue.
*   **Process:**
    1.  Stage files related to *one* task.
    2.  Commit with the format: `type(scope): description (ref #ISSUE_ID)`.
        *   Example: `feat(auth): implement login endpoint (ref #12)`
    3.  Immediately after committing, use the **GitHub MCP Tool** to either:
        *   Close the Issue (if the task is fully complete).
        *   Comment on the Issue (if it's a checkpoint).

## 4. Merge Protocol
*   **Trigger:** When all tasks in the plan are marked "Done".
*   **Process:**
    0.  **Code Review:** Execute `code-review-policy` on the current branch differences.
        *   If the Reviewer reports **Critical Issues**, **ABORT** the merge and request fixes.
    1.  Run the full test suite: `pnpm test`.
    2.  If tests pass, ask the user: *"All tasks complete. Shall I merge 'branch-name' into 'main'?"*
    3.  If yes, perform the merge (or create a PR if preferred/configured).
    4.  **Post-Merge:** Call `release-management` skill to check if a new release/tag should be generated based on the commited changes.
