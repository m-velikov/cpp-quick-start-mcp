---
name: scaffold-pre-commit
description: Generates .pre-commit-config.yaml for C++ projects.
---

# Pre-Commit Scaffolding Skill

This skill instructs the agent on how to scaffold a `.pre-commit-config.yaml` file for a C++ project.

## Requirements

When the user specifies Pre-Commit hooks for Code Quality, the agent MUST generate a `.pre-commit-config.yaml` file in the project root.

## Instructions

1. **Configuration File**: Create a `.pre-commit-config.yaml` with common C++ hooks.
   ```yaml
   repos:
     - repo: https://github.com/pre-commit/pre-commit-hooks
       rev: v4.4.0
       hooks:
         - id: trailing-whitespace
         - id: end-of-file-fixer
         - id: check-yaml
     - repo: https://github.com/pre-commit/mirrors-clang-format
       rev: v16.0.2
       hooks:
         - id: clang-format
   ```
2. **Installation Instructions**: In the generated build or configuration skill, instruct the agent to note that the user should install pre-commit hooks:
   ```bash
   pre-commit install
   ```
