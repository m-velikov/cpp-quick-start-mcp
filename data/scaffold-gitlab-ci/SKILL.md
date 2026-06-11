---
name: scaffold-gitlab-ci
description: Generates a standard GitLab CI pipeline for a C++ project. Use when GitLab CI was chosen as the CI provider.
---

# GitLab CI Scaffolding Skill

This skill instructs the agent on how to scaffold a CI pipeline using GitLab CI.

## Requirements

When the user specifies GitLab CI for their CI Provider, the agent MUST generate a pipeline file at `.gitlab-ci.yml` in the root of the project.

## Instructions for `.gitlab-ci.yml`

The generated pipeline must:

1. **Image**: Use a standard C++ docker image (e.g., `gcc:latest` or `silkeh/clang:latest`).
2. **Stages**: Define at least two stages: `build` and `test`.
3. **Build Job**:
   - Install necessary dependencies (e.g., `apt-get update && apt-get install -y cmake ninja-build`).
   - Configure and build the project.
   - Save the build artifacts.
4. **Test Job**:
   - Depend on the build job.
   - Run the testing suite (e.g., `ctest --output-on-failure`).
5. **Caching**: Cache compiler output with `ccache` and, if a package manager is used, cache its package directory inside `$CI_PROJECT_DIR` so GitLab can persist it between pipelines.

## Reference Template (CMake + presets)

Start from this proven pipeline and adapt it to the chosen stack (preset names, package manager blocks, build system commands). Drop the lines marked for package managers the project does not use.

```yaml
stages: [build, test]

default:
  image: gcc:14

variables:
  CCACHE_DIR: $CI_PROJECT_DIR/.ccache
  CONAN_HOME: $CI_PROJECT_DIR/.conan2 # Conan only

cache:
  key: $CI_JOB_NAME
  paths:
    - .ccache/
    - .conan2/ # Conan only

build:
  stage: build
  before_script:
    - apt-get update && apt-get install -y cmake ninja-build ccache
    # Conan only — drop if the project does not use Conan
    - pip install conan
    - conan profile detect --force
    - conan install . --build=missing
  script:
    - cmake --preset dev -DCMAKE_C_COMPILER_LAUNCHER=ccache -DCMAKE_CXX_COMPILER_LAUNCHER=ccache
    - cmake --build --preset dev
  artifacts:
    paths: [build/]
    expire_in: 1 hour

test:
  stage: test
  needs: [build]
  before_script:
    - apt-get update && apt-get install -y cmake
  script:
    - ctest --preset dev --output-on-failure
```

## Workflow Integration

This skill is utilized by the `go` prompt when the user selects GitLab CI as their CI Provider.
