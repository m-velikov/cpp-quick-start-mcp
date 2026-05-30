---
name: best-practices-vcpkg
description: Best practices for using vcpkg for dependency management.
---

# vcpkg Best Practices

When integrating vcpkg for dependency management, follow these best practices:

## 1. Use Manifest Mode

- Always use `vcpkg.json` (Manifest mode) instead of classic mode to declare dependencies. This ensures that dependencies are version-controlled alongside your code.
- Avoid running `vcpkg install` manually. Let CMake drive the installation during the configure step via the toolchain file.

## 2. Toolchain Integration

- Ensure CMake uses the vcpkg toolchain file by passing `-DCMAKE_TOOLCHAIN_FILE=[path to vcpkg]/scripts/buildsystems/vcpkg.cmake`.
- For multi-platform setups, consider wrapping the toolchain configuration in an IDE preset (e.g., `CMakePresets.json`).

## 3. Searching and Adding Dependencies

- Ensure that you read the port usage notes after installation (vcpkg prints these out). They often contain the exact `find_package` and `target_link_libraries` commands needed.
- Always use `find_package(<package> CONFIG REQUIRED)` if supported by the package.

## 4. Reproducibility

- Create a `vcpkg-configuration.json` to pin baseline versions. This ensures that all developers and CI runners are using the exact same versions of the dependencies.
