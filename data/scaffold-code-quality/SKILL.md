---
name: scaffold-code-quality
description: Generates code quality configurations including .clang-format, .clang-tidy, and pre-commit hooks.
---

# Code Quality Skill

This skill instructs the agent on how to scaffold code quality tooling for the C++ project.

## Requirements

When the user specifies Code Quality Enforcement (like pre-commit hooks, formatting, linting), generate the following files in the project root.

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

### 2. `.clang-tidy`

Create a file named `.clang-tidy` with the following exact content:

```yaml
Checks: "-*,readability-*,bugprone-*,performance-*,modernize-*,clang-analyzer-*,cppcoreguidelines-*,-cppcoreguidelines-pro-bounds-pointer-arithmetic,-cppcoreguidelines-pro-bounds-constant-array-index"
WarningsAsErrors: ""
HeaderFilterRegex: ""
AnalyzeTemporaryDtors: false
FormatStyle: none
```

### 3. `.pre-commit-config.yaml`

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
