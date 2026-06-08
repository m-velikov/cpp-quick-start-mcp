---
name: scaffold-base-configs
description: Generates essential base repository files like .gitignore and .gitattributes.
---

# Base Configurations Skill

This skill provides the standard foundational files for any new C++ repository.

## Instructions

Always generate these files at the root of the project to ensure proper Git behavior.

### 1. `.gitignore`

Create a file named `.gitignore` with the following exact content:

```gitignore
# CMake
build/
CMakeCache.txt
CMakeFiles/
CMakeScripts/
Testing/
cmake_install.cmake
install_manifest.txt
compile_commands.json

# IDEs
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

```

### 2. `.gitattributes`

Create a file named `.gitattributes` with the following exact content:

```gitattributes
# Auto detect text files and perform LF normalization
* text=auto eol=lf

# Ensure bash scripts always use LF
*.sh text eol=lf

# C++ Source Code
*.cpp text diff=cpp
*.hpp text diff=cpp
*.c text diff=cpp
*.h text diff=cpp

# Build files
CMakeLists.txt text
*.cmake text
```

### 3. `.clangd`

Create a file named `.clangd` at the project root with the following exact content to ensure seamless IDE support if the build system generates a `compile_commands.json` file:

```yaml
CompileFlags:
  CompilationDatabase: build
```
