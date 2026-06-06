---
name: scaffold-cmake
description: Generates modern CMakeLists.txt files for configuring a C++ project.
---

# CMake Scaffolding Skill

This skill instructs the agent on how to scaffold modern `CMakeLists.txt` files for the C++ project.

## Requirements

When the user specifies CMake for the Build System, the agent MUST generate a root `CMakeLists.txt` and any necessary subdirectory `CMakeLists.txt` files (e.g., in `src/` or `tests/`).

## Instructions for `CMakeLists.txt`

**If generating a NEW project (Mode A):**
The root `CMakeLists.txt` must be written using Modern CMake (target-based) principles:

1. **Minimum Required Version**: Start with `cmake_minimum_required(VERSION 3.20)` (or higher).
2. **Project Definition**: `project(ProjectName VERSION 0.1.0 LANGUAGES CXX)`
3. **C++ Standard**: Enforce the C++ standard strictly via target properties (e.g., `target_compile_features(<target> PUBLIC cxx_std_20)`). Avoid using global variables like `CMAKE_CXX_STANDARD`.
4. **Targets and Modularity**: The agent MUST iterate over the libraries and tools requested by the user during the go prompt interview.
   - **CRITICAL RULE**: Do NOT create a single monolithic top-level `CMakeLists.txt` that defines every target. Instead, you MUST split the build files per artifact. The root `CMakeLists.txt` should simply use `add_subdirectory(...)` for each target, and the actual `add_library(<target_name>)` or `add_executable(<target_name>)` commands MUST be placed inside individual `CMakeLists.txt` files residing in their respective target source directories.
   - Avoid global state functions like `include_directories()`.
5. **Target Properties**: Apply properties to _each_ target specifically. Use `target_include_directories(<target_name> ...)`, `target_compile_features(<target_name> ...)`, and `target_link_libraries(<target_name> ...)`.
   - If an executable tool depends on a library built in the same project, link them together! (e.g., `target_link_libraries(app_cli PRIVATE core_lib)`).
6. **Package Management Integration**:
   - If Conan is used, link against Conan-provided targets (e.g., `find_package(ZLIB REQUIRED)`, `target_link_libraries(my_target PRIVATE ZLIB::ZLIB)`).
   - If vcpkg is used, do the same. Provide a note that `CMAKE_TOOLCHAIN_FILE` must be passed during the configure step.
7. **Testing**: If a testing framework is chosen, `enable_testing()` and use `add_subdirectory(tests)` (or similar) to include test targets. Use `FetchContent` to download the testing framework (e.g., GTest, Catch2) if a package manager isn't handling it.
8. **Compilation Database**: You MUST add `set(CMAKE_EXPORT_COMPILE_COMMANDS ON)` near the top of the file. Furthermore, to ensure IDEs can always find the `compile_commands.json` even with multi-configuration generators or nested build trees, you MUST generate a post-generation build-time rule using `add_custom_target(copy_compile_commands ALL ... COMMAND ${CMAKE_COMMAND} -E copy_if_different ...)` to copy the generated JSON file. The target destination MUST be `${CMAKE_SOURCE_DIR}/build` if `CMAKE_BINARY_DIR` is a subdirectory of `build` (like `build/Release`). Otherwise, if the binary directory is NOT under `build`, the destination MUST be the top-level `${CMAKE_SOURCE_DIR}`. Do NOT use `file(CREATE_LINK ...)` at configure time, as it causes race conditions on Windows.

**If adding components to an EXISTING project (Mode B):**

1. **DO NOT OVERWRITE**: You MUST NOT overwrite the existing `CMakeLists.txt`.
2. **Safe Appending**: Append the new `add_library(<target_name>)` or `add_executable(<target_name>)` definitions safely to the bottom of the file, or inside the appropriate conditional blocks if they exist.
3. **Respect Conventions**: If the existing `CMakeLists.txt` uses `lowercase()` or `UPPERCASE()` CMake commands, match that style exactly. Do not change global properties.

## Build Skills Generation

If CMake is the build system, the agent MUST generate a `skills/build-project/SKILL.md` in the new project.
The generated skill must instruct agents to build the project using:

```bash
cmake --build build -j
```

## Workflow Integration

This skill is utilized by the `go` prompt when the user selects CMake as their build system.
