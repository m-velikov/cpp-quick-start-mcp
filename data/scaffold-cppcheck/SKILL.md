---
name: scaffold-cppcheck
description: Generates cppcheck configuration for C++ projects. Use when cppcheck was chosen for code quality or static analysis.
---

# Cppcheck Scaffolding Skill

This skill instructs the agent on how to scaffold a `cppcheck` configuration for a C++ project.

## Requirements

When the user specifies Cppcheck for Code Quality, the agent MUST configure it properly in both the build system (e.g., CMake) and pre-commit hooks (if applicable).

## Instructions

### 1. CMake Integration

If CMake is used as the build system, create a custom target `run-cppcheck` in the root `CMakeLists.txt`:

```cmake
find_program(CPPCHECK_CMD cppcheck)
if(CPPCHECK_CMD)
    add_custom_target(run-cppcheck
        COMMAND ${CPPCHECK_CMD}
            --enable=all
            --check-level=exhaustive
            --suppress=missingIncludeSystem    # avoid noise from system headers
            --suppress=constParameterCallback  # false positives in callback signatures
            --suppress=unusedFunction          # false positives for public library functions
            --suppress=unmatchedSuppression    # keeps the suppression list self-consistent
            --suppress=functionStatic          # false positives for intentionally non-static API methods
            --inline-suppr
            --language=c++
            -I ${CMAKE_SOURCE_DIR}/include
            ${CMAKE_SOURCE_DIR}/src
            ${CMAKE_SOURCE_DIR}/include
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
        COMMENT "Running cppcheck..."
    )
endif()
```

**`--library` flag**: If a testing framework is used, add the appropriate `--library` flag so cppcheck understands the framework's macros (e.g., `--library=googletest` for GTest, `--library=boost` for Boost.Test). Omit the flag entirely if no supported library applies.

_Note: Adjust `-I` include paths and source directories (`src`, `include`) based on the project's actual layout._

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

_Note: Add `--library=<framework>` (e.g., `--library=googletest`) if a supported test framework is used. Adjust include paths based on the project's actual layout._
