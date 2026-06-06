---
name: scaffold-cppcheck
description: Generates cppcheck configuration for C++ projects.
---

# Cppcheck Scaffolding Skill

This skill instructs the agent on how to scaffold a `cppcheck` configuration for a C++ project.

## Requirements

When the user specifies Cppcheck for Code Quality, the agent MUST configure it properly in both the build system (e.g., CMake) and pre-commit hooks (if applicable).

## Instructions

### 1. CMake Integration

If CMake is used as the build system, create a custom target `run-cppcheck` to execute `cppcheck`. Ensure the following command is appended to the root `CMakeLists.txt` or a dedicated quality/testing `CMakeLists.txt` if appropriate:

```cmake
find_program(CPPCHECK_CMD cppcheck)
if(CPPCHECK_CMD)
    add_custom_target(run-cppcheck
        COMMAND ${CPPCHECK_CMD} --enable=all --library=googletest --check-level=exhaustive --suppress=missingIncludeSystem --suppress=constParameterCallback --suppress=unusedFunction --suppress=unmatchedSuppression --suppress=functionStatic --inline-suppr --language=c++ -I ${CMAKE_CURRENT_SOURCE_DIR}/include
        ${CMAKE_CURRENT_SOURCE_DIR}/src
        ${CMAKE_CURRENT_SOURCE_DIR}/include
        WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
        COMMENT "Running cppcheck..."
    )
endif()
```

_Note: Adjust `-I` include paths and source directories (`src`, `include`) based on the project's actual layout. Adjust `--library` depending on the test framework used._

### 2. Pre-commit Integration

If the project uses `pre-commit`, append the `cppcheck` hook to `.pre-commit-config.yaml`:

```yaml
- repo: https://github.com/pocc/pre-commit-hooks
  rev: v1.3.5
  hooks:
    - id: cppcheck
      args:
        [
          --enable=all,
          --library=googletest,
          --check-level=exhaustive,
          --suppress=missingIncludeSystem,
          --suppress=constParameterCallback,
          --suppress=unusedFunction,
          --suppress=unmatchedSuppression,
          --suppress=functionStatic,
          --inline-suppr,
          --language=c++,
          -Iinclude,
        ]
```

_Note: Adjust `args` based on the project's layout and dependencies._
