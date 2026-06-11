---
name: scaffold-conan
description: Generates a conanfile.py for configuring packaging and dependency management with Conan 2.x. Use when Conan was chosen for dependencies or packaging.
---

# Conan Packaging Skill

This skill instructs the agent on how to scaffold a Conan 2.x packaging manifest (`conanfile.py`) for the C++ project.

## Requirements

When the user specifies Conan for Project Packaging, the agent MUST generate a `conanfile.py` in the root of the project.

## Instructions for `conanfile.py`

The `conanfile.py` must define a class inheriting from `ConanFile` and include the following:

1. **Metadata**: `name`, `version`, `license`, `author`, `url`, and `description`.
2. **Settings**: Standard settings `os`, `compiler`, `build_type`, `arch`.
3. **Options**: Typically `shared=True/False` and `fPIC=True/False`.
4. **Tool Requires**: E.g., `cmake/[>=3.24]`.
5. **Requirements**: Implement the `requirements()` method using `self.requires("package/version")`.
6. **Layout**: Implement the `layout()` method calling `cmake_layout(self)` to use Conan 2.x's robust default generated layout.
7. **Generate**: Implement the `generate()` method using `CMakeDeps` and `CMakeToolchain`.
8. **Build**: Implement the `build()` method using `CMake(self).configure()` and `build()`.
9. **Package**: Implement the `package()` method using `CMake(self).install()`.
10. **Package Info**: Implement `package_info()` to define `self.cpp_info.libs = ["<library_name>"]` and `self.cpp_info.set_property("cmake_target_name", "PkgName::LibName")` to ensure modern CMake integration.

## Configure Skills Generation

If Conan is used, the agent MUST instruct that the generated `skills/configure-project/SKILL.md` inside the new project contains the exact Conan configuration commands, for example:

```bash
conan profile detect --force
conan install . --build=missing
```

And if CMake is used with Conan, the `configure-project` skill must document the correct ordering — Conan must run first because it generates `CMakeUserPresets.json`, which the CMake preset inherits from:

```bash
# 1. Install dependencies (generates CMakeUserPresets.json with the conan-debug preset)
conan install . --build=missing
# 2. Configure via the CMake preset that inherits from conan-debug
cmake --preset dev
```

## Workflow Integration

This skill is utilized by the `go` prompt when the user selects Conan for Project Packaging.
