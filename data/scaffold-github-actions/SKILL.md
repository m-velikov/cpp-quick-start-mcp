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
4. **Caching**: Cache compiler output with `ccache` and, if a package manager is used, cache its package directory. CI without caching rebuilds every dependency on every push.

## Reference Template (CMake + presets)

Start from this proven workflow and adapt it to the chosen stack (preset names, package manager blocks, build system commands). Drop the blocks marked for package managers the project does not use.

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4

      - name: Install Ninja
        uses: seanmiddleditch/gha-setup-ninja@v5

      - name: Set up ccache
        uses: hendrikmuhs/ccache-action@v1.2
        with:
          key: ${{ matrix.os }}

      # Conan only — drop if the project does not use Conan
      - name: Cache Conan packages
        uses: actions/cache@v4
        with:
          path: ~/.conan2
          key: conan-${{ matrix.os }}-${{ hashFiles('conanfile.py', 'conanfile.txt') }}
      - name: Install dependencies with Conan
        run: |
          pipx install conan
          conan profile detect --force
          conan install . --build=missing

      # vcpkg only — drop if the project does not use vcpkg
      # - name: Cache vcpkg downloads
      #   uses: actions/cache@v4
      #   with:
      #     path: ~/.cache/vcpkg
      #     key: vcpkg-${{ matrix.os }}-${{ hashFiles('vcpkg.json') }}

      - name: Configure
        run: cmake --preset dev -DCMAKE_C_COMPILER_LAUNCHER=ccache -DCMAKE_CXX_COMPILER_LAUNCHER=ccache

      - name: Build
        run: cmake --build --preset dev

      - name: Test
        run: ctest --preset dev --output-on-failure
```

## Workflow Integration

This skill is utilized by the `go` prompt when the user selects GitHub Actions as their CI Provider.
