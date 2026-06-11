---
name: best-practices-code-review
description: Best practices for performing automated code reviews. Use when reviewing code changes, diffs, or pull requests in a C++ project.
---

# Code Review Best Practices

When tasked with reviewing code, the agent MUST follow these guidelines to provide constructive, actionable feedback:

## 1. Style and Formatting

- Verify that the code complies with the project's chosen coding style and naming conventions.
- Check if the code passes the project's automated formatters or linters.

## 2. Clean Code and Architecture

- Ensure functions and classes follow the Single Responsibility Principle.
- Look for opportunities to simplify complex logic or reduce code duplication (DRY).
- Check that variable and function names are descriptive and reveal intent. Enforce identifier length based on scope: short scopes should have short names (e.g., `i` in a loop), while larger scopes require longer, more descriptive names.
- Prefer verbs or verb phrases for function names (e.g., `calculateTotal()`) and nouns or noun phrases for variables and values (e.g., `totalAmount`).
- Flag functions that are excessively long or contain too many levels of nesting. **Exception**: A single, large `switch` statement is acceptable if it cleanly maps cases without complex embedded logic.
- Strongly prefer the "early-return" (guard clause) style to reduce nesting and improve readability, rather than wrapping the entire function body in a large `if` block.
- Code should be self-documenting. Comments should explain the "Why" (business logic/decisions), not the "What". Do not comment bad code; rewrite it instead.
- Avoid magic numbers in business logic. Extract them into meaningfully named constants to reveal their intent. (Hardcoded string literals are usually fine).
- Avoid boolean flag arguments as they imply the function does more than one thing. Split into two separate functions instead.
- Strive for strict architectural layering. Components should preferably communicate only with their immediate upper and lower layers. Flag designs that bypass adjacent layers or create circular dependencies.

## 3. Correctness and Logic

- Verify that the logic correctly implements the requested feature or bug fix.
- Look out for off-by-one errors, infinite loops, or unhandled edge cases.
- Check for thread-safety issues if concurrency is involved.
- Avoid redundant parameter validation. The caller is responsible for providing correct parameter values (Design by Contract). Use assertions to enforce preconditions during development. Only add explicit runtime checks if the function is intentionally designed to be called with invalid/unsafe values (e.g., parsing raw user input).

## 4. Test Coverage

- Ensure that any new functionality is accompanied by corresponding unit tests.
- Verify that bug fixes include a regression test.

## 5. Feedback Format

- Be specific and constructive. Provide code snippets to demonstrate suggested improvements.
- Categorize feedback into "Critical/Blocking" and "Nitpicks/Optional".
