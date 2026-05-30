---
name: scaffold-pitchfork-layout
description: Generates a C++ project directory structure strictly following the Pitchfork Layout specification.
---

# Pitchfork Layout Scaffolding Skill

This skill instructs the agent on how to correctly scaffold a C++ project following the official Pitchfork directory layout specification.

## Reference

For the exact specification and rationale, always refer to the official documentation:
[Pitchfork Layout Specification](https://github.com/vector-of-bool/pitchfork/blob/develop/data/spec.bs)

## Standard Directories to Create

When invoking this skill to scaffold a new C++ project, the agent MUST create the following structure based on the Pitchfork standard:

1. **`src/`** or **`libs/` / `tools/`**:
   - For a single library/executable, use `src/` for private implementation files (`*.cpp`, private `*.hpp`).
   - **For multiple targets** (e.g., a core library and multiple CLI tools), the agent MUST group them properly. Either use target-specific subdirectories inside `src/` (e.g., `src/core_lib/`, `src/app_cli/`) or use the top-level `libs/` and `tools/` directories as per Pitchfork (e.g., `libs/core_lib/src/`, `tools/app_cli/src/`).
2. **`include/`**: Contains the public headers API.
   - **CRITICAL**: Do NOT place headers directly in `include/`. You must create a subdirectory matching the target name (e.g., `include/<target_name>/`). This prevents header collisions. For multiple libraries, create multiple subdirectories (e.g., `include/libA/`, `include/libB/`).
3. **`tests/`**: Contains all testing code. For multiple targets, group tests by target (e.g., `tests/libA/`, `tests/libB/`).
4. **`examples/`** _(Optional)_: Contains example code showing how to use the library/project.
5. **`external/`** _(Optional)_: Contains third-party dependencies (if not using a package manager like vcpkg or FetchContent).
6. **`data/`** _(Optional)_: Contains non-source data files (e.g., assets, images, databases).
7. **`tools/`** _(Optional)_: Contains development scripts, deployment scripts, and internal utilities.
8. **`docs/`** _(Optional)_: Contains project documentation (e.g., Doxygen configuration).
9. **`build/`**: The designated output directory for build artifacts (compilation should always be out-of-source). This directory should be added to `.gitignore`.

## Example Structure (Multi-Target)

If building a project with a library `core_lib` and an executable `app_cli`, the layout should look like this:

```
my_project/
├── CMakeLists.txt
├── .gitignore
├── include/
│   └── core_lib/
│       └── core_lib.hpp
├── src/
│   ├── core_lib/
│   │   └── core_lib.cpp
│   └── app_cli/
│       └── main.cpp
└── tests/
    └── core_lib/
        └── test_core_lib.cpp
```

## Existing Project Additions (Mode B)

If adding new components to an _existing_ project, the agent MUST NOT delete, overwrite, or reorganize existing directories unless a layout refactoring plan has been explicitly proposed and approved by the user (as determined by the Layout Conformity Check).
If no refactoring plan was approved, safely _add_ the new component directories alongside the existing ones, strictly following the inferred layout (e.g., creating `src/<new_target>/` and `include/<new_target>/`).

## Workflow Integration

This skill is utilized by the `meta-quickstart` skill when a user selects "Pitchfork" as their desired directory layout, or when an existing project is inferred to use Pitchfork conventions. The agent generating the final project should use the rules above to create the file tree.
