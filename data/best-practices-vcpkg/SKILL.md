---
name: best-practices-vcpkg
description: Best practices for using vcpkg for dependency management. Use when adding, updating, or troubleshooting vcpkg dependencies or editing vcpkg.json.
---

# vcpkg Best Practices

When integrating vcpkg for dependency management, follow these best practices:

## 1. Use Manifest Mode

- Always use `vcpkg.json` (Manifest mode) instead of classic mode to declare dependencies. This ensures that dependencies are version-controlled alongside your code.
- In manifest mode, CMake automatically triggers vcpkg to install the declared dependencies during the configure step (when the toolchain file is active). You do not need to run `vcpkg install` as a separate step in the normal build workflow.

## 2. Toolchain Integration

- Ensure CMake uses the vcpkg toolchain file by setting `CMAKE_TOOLCHAIN_FILE` to `$env{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake` — set this in the `CMakePresets.json` base preset's `cacheVariables` rather than on the command line so all developers and CI runners use the same configuration automatically.

## 3. Searching and Adding Dependencies

- Ensure that you read the port usage notes after installation (vcpkg prints these out). They often contain the exact `find_package` and `target_link_libraries` commands needed.
- Always use `find_package(<package> CONFIG REQUIRED)` if supported by the package.

## 4. Reproducibility

- Create a `vcpkg-configuration.json` to pin baseline versions. This ensures that all developers and CI runners are using the exact same versions of the dependencies.
