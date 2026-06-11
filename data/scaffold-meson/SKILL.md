---
name: scaffold-meson
description: Generates modular meson.build files for configuring a C++ project. Use when the chosen build system is Meson.
---

# Meson Scaffolding Skill

This skill instructs the agent on how to scaffold a modern, modular Meson build structure for the C++ project.

## Requirements

When the user specifies Meson for the Build System, the agent MUST generate a root `meson.build` and any necessary subdirectory `meson.build` files (e.g., in `src/` or `tests/`).

## Instructions for `meson.build`

**If generating a NEW project (Mode A):**

1. **Project Definition**: Start the root `meson.build` with:
   `project('ProjectName', 'cpp', version : '0.1.0', default_options : ['warning_level=3', 'cpp_std=c++20'])`
   Adjust the `cpp_std` according to the user's choice.
2. **Modularity (CRITICAL RULE)**: Do NOT define libraries or executables in a single monolithic top-level `meson.build`. The root `meson.build` MUST only use `subdir('dir')` for each target. The actual `library()` or `executable()` calls MUST be placed inside individual `meson.build` files residing in their respective target source directories.
3. **Dependency Management**: Use `dependency('<name>')` to link dependencies.
   - **External Package Managers (Conan/vcpkg)**: If the user chose Conan or vcpkg, assume dependencies will be resolved via `pkg-config`. (e.g. `dependency('fmt')`).
   - **Native Meson Wraps**: If no external package manager is used, instruct the AI to scaffold `.wrap` files for the requested dependencies inside the `subprojects/` directory, and use `dependency('fmt', fallback: ['fmt', 'fmt_dep'])`.
4. **Target Definitions**: In the subdirectory `meson.build` files:
   - For libraries, use `library('name', sources, dependencies : [...])`.
   - For executables, use `executable('name', sources, dependencies : [...])`.
   - If an executable tool depends on a library built in the same project, link them by creating a `declare_dependency` for the library or passing the library target directly in `link_with`.
5. **Testing**: If a testing framework is chosen, create a `tests/` directory with a `meson.build` file containing `test('test_name', test_exe)`. Download the testing framework (e.g., GTest, Catch2) via a `.wrap` file if no external package manager handles it.
6. **IDE Support**: Meson inherently generates `compile_commands.json` in the build directory, so no special build system flags are required. Our standard `.clangd` file configuration will seamlessly discover it.

**If adding components to an EXISTING project (Mode B):**

1. **DO NOT OVERWRITE**: You MUST NOT overwrite existing `meson.build` files entirely.
2. **Safe Appending**: Append the new `subdir('<target_name>')` calls to the root `meson.build` and create the new folder with its own isolated `meson.build` file.

## Build Skills Generation

If Meson is the build system, the agent MUST generate a `skills/build-project/SKILL.md` in the new project.
The generated skill must instruct agents to build the project using:

```bash
meson setup build
meson compile -C build
```

## Workflow Integration

This skill is utilized by the `go` prompt when the user selects Meson as their build system.
