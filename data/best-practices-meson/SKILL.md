---
name: best-practices-meson
description: Best practices for building C++ projects with Meson. Use when writing or modifying meson.build files or debugging Meson builds.
---

# Meson Best Practices

When using Meson for your build system, follow these practices:

## 1. Structured Build Files

- Use `meson.build` at the root and include subdirectories using `subdir('dirname')`.
- Keep the root `meson.build` clean, primarily defining the project, global compiler arguments, and including subdirectories.

## 2. Compiler Flags

- Set C++ dialects (e.g., C++20) using `default_options: ['cpp_std=c++20']` within the `project()` definition.
- Use `add_project_arguments()` to specify project-wide compiler warnings. Avoid hardcoding specific GCC or Clang flags without checking compiler IDs, e.g.:

```meson
cpp = meson.get_compiler('cpp')
if cpp.get_id() == 'gcc' or cpp.get_id() == 'clang'
  add_project_arguments('-Wextra', '-Werror', language : 'cpp')
endif
```

## 3. Dependencies

- Use `dependency('libname')` to find system libraries via pkg-config or CMake.
- Use Meson's WrapDB for third-party dependencies by placing `.wrap` files in the `subprojects/` directory. Use `fallback` in `dependency()` to gracefully use a wrap if the system package is not found.

## 4. Testing

- Register tests using the `test('test_name', executable_target)` command.
- Run the full test suite with `meson test -C build`. Use `meson test -C build --verbose` to see per-test output.

## 5. Compilation Database

- Meson generates `compile_commands.json` in the build directory automatically — no extra build-system flags are needed.

## 6. Development Environment

- Use `meson devenv -C build` to enter a shell with the correct environment variables (library paths, etc.) set for running built binaries directly without installing them.
