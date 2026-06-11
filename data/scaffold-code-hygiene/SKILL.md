---
name: scaffold-code-hygiene
description: Generates code hygiene configurations including .clang-format and pre-commit hooks. Use when setting up formatting or pre-commit checks.
---

# Code Hygiene Skill

This skill instructs the agent on how to scaffold formatting and pre-commit hooks for the C++ project.

## Requirements

When the user specifies Code Quality Enforcement (like pre-commit hooks, formatting), generate the following files in the project root.

### 1. `.clang-format`

Create a file named `.clang-format` using the template below. **Substitute the two placeholder values** from the user's interview answers before writing the file — do not leave them as literals:

- `<CHOSEN_STYLE>` → the coding style chosen in the interview (e.g., `Google`, `LLVM`, `Mozilla`, `WebKit`).
- `<CXX_STANDARD>` → the C++ standard chosen in the interview, lowercase (e.g., `c++17`, `c++20`, `c++23`).

```yaml
# The coding style is ultimately decided by the users.
# Update BasedOnStyle or define custom rules below.
BasedOnStyle: <CHOSEN_STYLE>
Standard: <CXX_STANDARD>
ColumnLimit: 100
IndentWidth: 4
TabWidth: 4
UseTab: Never
```

### 2. `.pre-commit-config.yaml`

Create a file named `.pre-commit-config.yaml` with the following exact content:

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
  - repo: https://github.com/pre-commit/mirrors-clang-format
    rev: v18.1.5
    hooks:
      - id: clang-format
        types_or: [c++, c]
```

### 3. Installation Instructions

In the generated build or configuration workspace skill, instruct the agent to note that the user should install pre-commit hooks:

```bash
pre-commit install
```
