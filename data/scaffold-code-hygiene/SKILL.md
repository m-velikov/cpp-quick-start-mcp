---
name: scaffold-code-hygiene
description: Generates code hygiene configurations including .clang-format and pre-commit hooks.
---

# Code Hygiene Skill

This skill instructs the agent on how to scaffold formatting and pre-commit hooks for the C++ project.

## Requirements

When the user specifies Code Quality Enforcement (like pre-commit hooks, formatting), generate the following files in the project root.

### 1. `.clang-format`

Create a file named `.clang-format` with the following exact content:

```yaml
# The coding style is ultimately decided by the users.
# Update the BasedOnStyle or define your custom rules below.
BasedOnStyle: LLVM
Standard: c++20
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
