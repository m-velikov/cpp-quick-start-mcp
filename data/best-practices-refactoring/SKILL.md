---
name: best-practices-refactoring
description: Best practices for safely refactoring C++ code. Use when renaming, moving, or restructuring existing code — read BEFORE editing any file in a refactoring task.
---

# Refactoring Best Practices

When an agent is tasked with refactoring code in this project, it MUST adhere to the following protocol:

## 1. Prerequisites

- **Ensure a Clean State**: Before making any changes, verify the working tree has no uncommitted modifications (`git status`), compile the project, and run the entire test suite. Do not begin refactoring if tests are currently failing or if there are uncommitted changes that could be conflated with the refactoring.

## 2. Atomic Commits

- Perform refactoring in small, atomic, and verifiable steps.
- Avoid changing functionality and refactoring structure at the same time.

## 3. Directory and Layout Compliance

- When moving files, strictly adhere to the project's directory layout (e.g., Pitchfork layout).
- Move header files to the appropriate `include/` directory and source files to `src/`.

## 4. Renaming Symbols

- Prefer semantic rename over text search. Use a clangd-powered IDE refactor (e.g., "Rename Symbol") to update all definition and use sites accurately — this understands scopes and namespaces and avoids false matches in comments or string literals.
- If a clangd rename is not available, use the compiler as a guide: rename the definition first, then let the build errors enumerate every genuine use site.
- After renaming, update all `#include` paths that reference moved or renamed headers.

## 5. Verification

- Re-run the build and the test suite after _each_ atomic step to catch regressions immediately.
- Run `clang-tidy` and `cppcheck` (if configured) after the refactoring is complete to ensure no new code quality issues were introduced.

## 6. Scope Management

- **CRITICAL (Strict Scope Adherence)**: Confine all refactoring efforts strictly to the explicitly requested scope. Do not proactively introduce unrelated modifications or attempt to fix adjacent, out-of-scope code.
