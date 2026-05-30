---
name: scaffold-vcpkg
description: Generates a vcpkg.json manifest for configuring packaging and dependency management with vcpkg.
---

# vcpkg Packaging Skill

This skill instructs the agent on how to scaffold a vcpkg manifest (`vcpkg.json`) for the C++ project.

## Requirements

When the user specifies vcpkg for Project Packaging or Dependency Management, the agent MUST generate a `vcpkg.json` file in the root of the project.

## Instructions for `vcpkg.json`

The `vcpkg.json` file must be a valid JSON containing:

1. `"$schema"`: Pointing to the vcpkg schema URL.
2. `"name"`: The project name (lowercase).
3. `"version-string"` or `"version"`: The project version.
4. `"description"`: A brief description of the library/application.
5. `"dependencies"`: An array of strings or objects representing the third-party dependencies required.

### Example Manifest:

```json
{
  "$schema": "https://raw.githubusercontent.com/microsoft/vcpkg-tool/main/docs/vcpkg.schema.json",
  "name": "my-library",
  "version": "1.0.0",
  "description": "My awesome C++ library",
  "dependencies": ["fmt", "nlohmann-json"]
}
```

## `vcpkg-configuration.json` (Optional)

If the project requires pinning dependencies to specific baselines or using custom registries, instruct the agent to also generate a `vcpkg-configuration.json` file alongside the manifest.

## Configure Skills Generation

If vcpkg is used with CMake, the agent MUST instruct that the generated `skills/configure-project/SKILL.md` inside the new project contains the exact instructions for passing the vcpkg toolchain to CMake. For example:

```bash
cmake -B build -S . -DCMAKE_TOOLCHAIN_FILE=[path to vcpkg]/scripts/buildsystems/vcpkg.cmake
```

## Workflow Integration

This skill is utilized by the `meta-quickstart` skill when the user selects vcpkg for Project Packaging or Dependency Management.
