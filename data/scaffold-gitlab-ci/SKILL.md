---
name: scaffold-gitlab-ci
description: Generates a standard GitLab CI pipeline for a C++ project.
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

## Workflow Integration

This skill is utilized by the `go` prompt when the user selects GitLab CI as their CI Provider.
