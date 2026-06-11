---
name: scaffold-github-actions
description: Generates a standard GitHub Actions CI pipeline for a C++ project. Use when GitHub Actions was chosen as the CI provider.
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
   - Setup the compiler and dependencies (e.g., install ninja, CMake, Conan/vcpkg if used).
   - If Conan is the package manager, run `conan install . --build=missing` before configuring (it generates `CMakeUserPresets.json`).
   - Configure the build using the preset (e.g., `cmake --preset dev`).
   - Build the project (e.g., `cmake --build --preset dev`).
   - Run tests (e.g., `ctest --preset dev --output-on-failure`, or `cmake --build --preset dev --target test`).

## Workflow Integration

This skill is utilized by the `go` prompt when the user selects GitHub Actions as their CI Provider.
