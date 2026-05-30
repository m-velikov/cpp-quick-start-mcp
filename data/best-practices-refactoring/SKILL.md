---
name: best-practices-refactoring
description: Best practices for safely refactoring C++ code.
---

# Refactoring Best Practices

When an agent is tasked with refactoring code in this project, it MUST adhere to the following protocol:

## 1. Prerequisites

- **Ensure a Clean State**: Before making any changes, compile the project and run the entire test suite. Do not begin refactoring if tests are currently failing.

## 2. Atomic Commits

- Perform refactoring in small, atomic, and verifiable steps.
- Avoid changing functionality and refactoring structure at the same time.

## 3. Directory and Layout Compliance

- When moving files, strictly adhere to the project's directory layout (e.g., Pitchfork layout).
- Move header files to the appropriate `include/` directory and source files to `src/`.

## 4. Verification

- After moving files or renaming symbols, update all relevant `#include` paths.
- Re-run the build and the test suite after _each_ atomic step to catch regressions immediately.
- Use `clang-tidy` or similar linters to ensure the new structure doesn't introduce code quality issues.
