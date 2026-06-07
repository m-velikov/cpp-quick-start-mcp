---
name: scaffold-clang-tidy
description: Generates .clang-tidy configuration for C++ projects.
---

# Clang-Tidy Scaffolding Skill

This skill instructs the agent on how to scaffold a `.clang-tidy` configuration file for a C++ project.

## Requirements

When the user specifies Clang-Tidy for Code Quality, the agent MUST generate a `.clang-tidy` file in the root of the project.

## Instructions

1. **Configuration File**: Create a `.clang-tidy` file with a robust set of default checks.

   - **CRITICAL**: You MUST configure `CheckOptions` for `readability-identifier-naming.*` to match the user's preferred naming conventions. If the user's conventions are not provided or known, ask them before proceeding.
   - **CRITICAL**: You MUST respect the user's formatting style (e.g., from `.clang-format`). If their coding convention does NOT require braces around single statements, you MUST append `-readability-braces-around-statements` to the `Checks` string to disable the warning.

   ```yaml
   ---
   # Disable everything first, then opt-in
   Checks: >
     -*,
     bugprone-*,
     clang-analyzer-*,
     performance-*,
     modernize-*,
     -modernize-use-trailing-return-type,
     readability-*,
     -readability-magic-numbers,
     -readability-braces-around-statements,
     -readability-identifier-length,
     -readability-uppercase-literal-suffix,
     -readability-math-missing-parentheses,
     -readability-named-parameter,
     -readability-isolate-declaration,
     -readability-function-cognitive-complexity,
     misc-*,
     -misc-const-correctness,
     -misc-non-private-member-variables-in-classes

   # Automatically apply suggested fixes where safe
   HeaderFilterRegex: ".*"
   FormatStyle: file

   # Naming convention settings (adjust values to match user preference)
   CheckOptions:
     - key: readability-identifier-naming.ClassCase
       value: CamelCase
     - key: readability-identifier-naming.VariableCase
       value: camelBack
   ```

2. **Build System Integration**: If CMake is used, make clang-tidy optional by adding an `ENABLE_CLANG_TIDY` option and falling back to not using it if the command is not found:
   ```cmake
   option(ENABLE_CLANG_TIDY "Enable clang-tidy" ON)
   if(ENABLE_CLANG_TIDY)
       find_program(CLANG_TIDY_EXE NAMES "clang-tidy")
       if(CLANG_TIDY_EXE)
           set(CMAKE_CXX_CLANG_TIDY "${CLANG_TIDY_EXE}")
       else()
           message(STATUS "clang-tidy not found.")
       endif()
   endif()
   ```

## Upgrading Existing Projects (Mode B)

When upgrading or modernizing an existing project that already has a `.clang-tidy` file:

1. **Preserve User Overrides**: You MUST read the existing `.clang-tidy` file before making any changes.
2. **Do Not Clobber**: Any specific checks explicitly disabled or added by the user (e.g., `-readability-magic-numbers`) MUST be preserved in the updated `.clang-tidy` configuration.

## Workspace Skill Generation

As part of the workspace skills generation, append the following to the `skills/best-practices-code-review/SKILL.md` (or similar code quality skill):

- Provide the official list of checks for reference: `https://clang.llvm.org/extra/clang-tidy/checks/list.html`
- Explain to the user that they can easily disable annoying checks by adding `-check-name` to the `Checks` string in their `.clang-tidy` file.
- Remind future agents that when modifying this workspace skill or the `.clang-tidy` file, they must respect the **Skill Modification Guidelines** and strictly preserve the user's custom overrides.
