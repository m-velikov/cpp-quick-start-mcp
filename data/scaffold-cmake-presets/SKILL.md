---
name: scaffold-cmake-presets
description: Generates a CMakePresets.json file to standardize CMake configuration and build commands.
---

# CMake Presets Scaffolding Skill

This skill instructs the agent on how to scaffold a `CMakePresets.json` file to establish a standardized, hallucination-free build process.

## Requirements

When the user specifies CMake as their Build System, the agent MUST generate a `CMakePresets.json` file in the project root. This ensures that build commands are simple (e.g., `cmake --preset dev`) and consistent across platforms and environments.

## Instructions for `CMakePresets.json`

The file MUST be a valid JSON matching the CMake Presets version 3 (or higher) specification.

### 1. Configure Presets

Define your configuration presets.

- **Hidden Base Preset**: Create a hidden preset (e.g., `default-base` with `"hidden": true`) that defines common properties:
  - Generator (default to `"Ninja"` unless requested otherwise).
  - Common cache variables (e.g., `"CMAKE_EXPORT_COMPILE_COMMANDS": "YES"`).
- **User-Facing Presets**: Create user-facing presets (e.g., `dev` and `release`) that inherit from the base preset.
  - Set `"binaryDir"` on each user-facing preset (not the hidden base). Use `"${sourceDir}/build/Debug"` / `"${sourceDir}/build/Release"` to stay consistent with the naming convention used by Conan-generated presets.
  - Set `"CMAKE_BUILD_TYPE"` appropriately (Debug for dev, Release for release).

### 2. Conan Integration (CRITICAL)

If the project uses **Conan 2.x** for dependency management:

- Do NOT hardcode `CMAKE_TOOLCHAIN_FILE` paths manually.
- Add an `"include": ["CMakeUserPresets.json"]` entry at the top level of `CMakePresets.json`. Conan writes its generated presets (e.g., `conan-debug`, `conan-release`) into `CMakeUserPresets.json`, and this include makes them visible to your own presets. `CMakeUserPresets.json` should be added to `.gitignore` since it is machine-generated.
- Your user-facing presets (e.g., `dev`) MUST **inherit** from the Conan-generated presets (e.g., `"conan-debug"` or `"conan-release"`).
  ```json
  {
    "name": "dev",
    "inherits": ["conan-debug", "default-base"],
    "cacheVariables": {
      "CMAKE_BUILD_TYPE": "Debug"
    }
  }
  ```
- **Order of Operations Warning**: Instruct the user or subagents that when Conan is used alongside CMake presets, they MUST run `conan install .` (often with build profile arguments) **before** running `cmake --preset dev`. Otherwise, CMake will crash because the inherited Conan preset doesn't exist yet.

### 3. vcpkg Integration

If the project uses **vcpkg** (and not Conan), explicitly define the `CMAKE_TOOLCHAIN_FILE` in the base preset's cache variables. E.g.:

- `"CMAKE_TOOLCHAIN_FILE": "$env{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake"`

### 4. Multi-Package Manager Support (Conan AND vcpkg)

If a project supports _both_ package managers to give developers a choice, do NOT attempt to chain them together. Instead, generate separate, distinct user-facing presets for each:

- **`dev-conan`**: Inherits from the Conan-generated preset (e.g., `"inherits": ["default-base", "conan-debug"]`).
- **`dev-vcpkg`**: Inherits from the base preset but explicitly defines the vcpkg toolchain variable:
  ```json
  "cacheVariables": {
    "CMAKE_TOOLCHAIN_FILE": "$env{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake"
  }
  ```
  This allows developers to simply run `cmake --preset dev-conan` or `cmake --preset dev-vcpkg` depending on their preferred package manager.

### 5. Build and Test Presets

- Create `buildPresets` that correspond to your configure presets (e.g., a `dev` build preset that references the `dev` configure preset).
- If a testing framework is used, create `testPresets` that run CTest against the configured build directory.

## Build Skills Generation

If CMake Presets are scaffolded, update the project's build instructions to use the simple preset commands:

```bash
cmake --preset dev
cmake --build --preset dev
```

## Example `CMakePresets.json` Structure

```json
{
  "version": 3,
  "cmakeMinimumRequired": {
    "major": 3,
    "minor": 23,
    "patch": 0
  },
  "configurePresets": [
    {
      "name": "default-base",
      "hidden": true,
      "generator": "Ninja",
      "cacheVariables": {
        "CMAKE_EXPORT_COMPILE_COMMANDS": "YES"
      }
    },
    {
      "name": "dev",
      "inherits": "default-base",
      "binaryDir": "${sourceDir}/build/Debug",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Debug"
      }
    },
    {
      "name": "release",
      "inherits": "default-base",
      "binaryDir": "${sourceDir}/build/Release",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Release"
      }
    }
  ],
  "buildPresets": [
    {
      "name": "dev",
      "configurePreset": "dev"
    },
    {
      "name": "release",
      "configurePreset": "release"
    }
  ]
}
```

**Note on `binaryDir` and Conan**: When user-facing presets inherit from Conan-generated presets (e.g., `conan-debug`), Conan already sets `binaryDir` (typically `build/Debug`). Use `build/Debug` / `build/Release` naming in your own presets to stay consistent with this convention. If you inherit from a Conan preset and do NOT need to override the binary dir, omit `binaryDir` from your user-facing preset and let the inherited value apply.
