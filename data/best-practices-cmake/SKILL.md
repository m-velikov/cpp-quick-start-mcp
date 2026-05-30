---
name: best-practices-cmake
description: Best practices for using Modern CMake in C++ projects.
---

# CMake Best Practices

When working with CMake in this project, adhere to the following modern, target-based CMake practices:

## 1. Target-Based Approach

- **Do not use global state.** Avoid functions like `include_directories()`, `link_directories()`, and `add_definitions()`.
- Use `target_include_directories()`, `target_link_libraries()`, and `target_compile_definitions()` exclusively.
- Define visibility explicitly: `PRIVATE`, `PUBLIC`, or `INTERFACE`.

## 2. Setting C++ Standards

Set the C++ standard strictly on a per-target basis using `target_compile_features`. Do not use global state like `CMAKE_CXX_STANDARD` unless absolutely required by a legacy dependency.

```cmake
target_compile_features(<target_name> PUBLIC cxx_std_20)
```

## 3. Project Structure

- Split your build files. Avoid large, monolithic top-level `CMakeLists.txt` files.
- Use `add_subdirectory()` to include sub-components.
- Keep `CMakeLists.txt` close to the source files they build.

## 4. Testing

- Use `enable_testing()` at the root level.
- Include testing directories only if tests are enabled (e.g., `if(BUILD_TESTING)`).
- Register tests using `add_test(NAME <test_name> COMMAND <test_executable>)`.

## 5. CMake Presets

- Use `CMakePresets.json` to standardize configure, build, and test commands across environments.
- This gives AI agents and developers simple, single-line commands (e.g., `cmake --preset dev`, `cmake --build --preset dev`) and avoids command-line hallucination or environment-specific friction.
