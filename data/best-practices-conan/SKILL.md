---
name: best-practices-conan
description: Best practices for using Conan 2.x for dependency management. Use when adding, updating, or troubleshooting Conan dependencies or editing conanfile.py.
---

# Conan Best Practices

Follow these best practices when managing C++ dependencies via Conan:

## 1. Declarative Requirements

- Use a `conanfile.py` exclusively to declare requirements, even for simple consuming projects. Do not use `conanfile.txt` as it limits flexibility in Conan 2.x.
- Specify versions clearly (e.g., `requires = "zlib/1.3.1"`).

## 2. Options and Settings

- Define options and settings explicitly in your profiles, rather than passing them continuously on the command line.
- Always provide a `build_type` (e.g., Debug or Release) to ensure ABI compatibility.

## 3. Generators

- Use the modern `CMakeDeps` and `CMakeToolchain` generators to integrate with CMake seamlessly.
- Avoid legacy generators like `cmake` or `cmake_multi`.
- Let `CMakeToolchain` generate the `conan_toolchain.cmake` file, and pass it to CMake configure: `-DCMAKE_TOOLCHAIN_FILE=conan_toolchain.cmake`.

## 4. Reproducible Builds

- Generate and commit a `conan.lock` lockfile for stable and reproducible builds across developer machines and CI.

## 5. Virtual Environments

- If you encounter issues finding compilers or build tools while using Conan, consider sourcing or executing the Conan-generated environment setup scripts (e.g., `conanbuild.bat` / `conanbuild.sh` or `conanrun.bat` / `conanrun.sh`). These scripts properly configure the `PATH` and environment variables for the build tools.
