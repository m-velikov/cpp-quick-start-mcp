---
name: best-practices-code-review
description: Best practices for performing automated code reviews. Use when reviewing code changes, diffs, or pull requests, or when assessing a whole codebase, in a C++ project.
---

# Code Review Best Practices

When tasked with reviewing code, the agent MUST follow these guidelines to provide constructive, actionable feedback.

Reviews come in two modes, and the agent MUST establish which one applies before starting:

- **Change review** — a diff, patch, or pull request. The unit of review is the delta: what changed and whether the change is correct, justified, and well-tested. Sections 1–5 below apply primarily to this mode.
- **Project review** — an existing codebase with no specific change under review. The unit of review is the project as a whole: its structure, build and dependency setup, consistency, and overall health. Section 6 covers this mode. The criteria in sections 1–4 still apply, but assessed across the codebase rather than against a delta — report systemic patterns (e.g. "magic numbers are pervasive in `src/net/`") rather than line-by-line nitpicks.

## 1. Style and Formatting

- Verify that the code complies with the project's chosen coding style and naming conventions.
- Check if the code passes the project's automated formatters or linters.

## 2. Design Quality, Clean Code, and Architecture

Good software design is characterized by a handful of qualities. Evaluate the code against them and flag designs that sacrifice these without justification:

- **Simplicity**: Prefer the simplest design that solves the problem. Flag accidental complexity, premature generalization, and abstractions introduced for hypothetical future needs (YAGNI).
- **Strong abstractions**: Interfaces should hide implementation details behind a coherent, minimal surface, expose intent rather than mechanism, and be hard to misuse. Flag leaky abstractions and types that force callers to know internal details.
- **Loose coupling**: Components should depend on as little of each other as possible, and on abstractions rather than concrete implementations. Flag hidden dependencies, reaching across layers, and changes that ripple widely through unrelated modules.
- **High cohesion**: Code that changes together should live together. Each module, class, and function should have one clear, focused responsibility.
- **Clear dependency direction**: Dependencies should flow in one direction (typically toward stable, abstract code). Flag circular dependencies and dependencies pointing from stable code toward volatile code.
- **Performance proportionate to need**: The design should meet the project's actual performance requirements without paying for it in clarity where it isn't warranted. Flag both algorithmic inefficiency on hot paths and micro-optimizations that obscure intent without measured benefit.

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

## 6. Whole-Project Review

When reviewing an entire codebase rather than a single change, assess the following project-level concerns in addition to the per-file criteria above:

- **Structure and layout**: Check that the directory layout is conventional and predictable (e.g. a clear separation of headers, sources, tests, and third-party code). Flag inconsistent or ad-hoc organization.
- **Build system**: Verify the project builds cleanly from a documented set of commands. Check that the build is reproducible, that targets and dependencies are declared explicitly, and that warnings are enabled (and ideally treated as errors).
- **Dependency management**: Confirm dependencies are pinned and acquired through a declared mechanism (package manager, lockfile, or vendored with provenance) rather than assumed to be present on the system.
- **Consistency**: Look for divergence across the codebase — multiple competing styles, duplicated utilities that should be unified, or modules that ignore the conventions the rest of the project follows.
- **Test and CI health**: Assess overall test coverage and whether tests actually run in CI. Flag large untested subsystems, flaky or disabled tests, and missing CI gates (build, test, format, lint).
- **Documentation**: Check for a README that explains how to build, test, and use the project, and that public APIs are documented. Flag stale documentation that contradicts the code.
- **Tooling and hygiene**: Verify the presence and correct configuration of formatters, linters, and static analyzers, and that they are wired into CI or pre-commit hooks rather than relying on developer discipline.
- **Prioritize systemic issues**: Report the highest-impact, recurring problems first. A whole-project review should surface patterns and architectural concerns, not an exhaustive list of individual line-level nits.
