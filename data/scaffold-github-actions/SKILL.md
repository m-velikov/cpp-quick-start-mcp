---
name: scaffold-github-actions
description: Generates a standard GitHub Actions CI pipeline for a C++ project.
---

# GitHub Actions Scaffolding Skill

This skill instructs the agent on how to scaffold a CI pipeline using GitHub Actions.

## Requirements

When the user specifies GitHub Actions for their CI Provider, the agent MUST generate a workflow file at `.github/workflows/build.yml`.

## Instructions for `build.yml`

The generated workflow must:

1. **Trigger**: Run on `push` and `pull_request` to the `main` or `master` branch.
2. **Strategy Matrix**: Test across multiple OS environments if applicable (e.g., `ubuntu-latest`, `macos-latest`, `windows-latest`).
3. **Steps**:
   - Check out the repository (`actions/checkout@v4`).
   - Setup the compiler and dependencies (e.g., install ninja, CMake).
   - Configure the build using the chosen build system (e.g., `cmake -B build -G Ninja`).
   - Build the project (e.g., `cmake --build build`).
   - Run tests (e.g., `ctest --test-dir build --output-on-failure`).

## Workflow Integration

This skill is utilized by the `go` prompt when the user selects GitHub Actions as their CI Provider.
