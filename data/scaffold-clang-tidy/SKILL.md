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

   - **CRITICAL**: For `Checks`, ensure you disable `bugprone-easily-swappable-parameters` (e.g., add `-bugprone-easily-swappable-parameters`).
   - **CRITICAL**: If the chosen coding convention does not require braces around single statement if/for/while/etc bodies, you MUST also disable `readability-braces-around-statements` (e.g., add `-readability-braces-around-statements`).

   ```yaml
   Checks: "-*,readability-*,modernize-*,performance-*,bugprone-*,cppcoreguidelines-*,-bugprone-easily-swappable-parameters"
   WarningsAsErrors: ""
   HeaderFilterRegex: ".*"
   AnalyzeTemporaryDtors: false
   FormatStyle: "file"
   CheckOptions:
     - key: readability-identifier-naming.ClassCase
       value: CamelCase
     - key: readability-identifier-naming.VariableCase
       value: camelBack
   ```

2. **Build System Integration**: If CMake is used, instruct the agent to enable clang-tidy integration by adding `CXX_CLANG_TIDY` properties to targets, or globally:
   ```cmake
   set(CMAKE_CXX_CLANG_TIDY "clang-tidy")
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
