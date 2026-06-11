---
name: scaffold-agents
description: Generates the AGENTS.md agent guidelines and entry-point files for a C++ project. Use when setting up or modernizing a project for agentic development.
---

# Agent Topology Skill

This skill defines how AI agents should coordinate when working on this C++ project.

## Guidelines

Embed the following guidelines into an `AGENTS.md` file in the project root so other agents understand the architecture.

### `AGENTS.md`

```markdown
# Agent Configuration and Guidelines

You are an AI assistant operating within a C++ Agentic template repository. Your behavior must adhere to the following directives.

## Agent Topology & Roles

This repository is designed to be operated by a multi-agent system. When working on larger tasks, define and invoke the following specialized subagents to distribute the workload:

1. **Lead Orchestrator Agent (You)**:

   - **Role**: High-level planning, user communication, and task delegation.
   - **Responsibilities**: Breaks down user requests into tasks and delegates them to specialized subagents using whatever agent-spawning mechanism the current runtime provides (e.g., spawning subagents, sending messages to peer agents).

2. **C++ Coder Agent**:

   - **Role**: Core implementation and logic design.
   - **Responsibilities**: Writes the actual C++ headers and source files. Enforces the configured coding style and ensures code compiles flawlessly with the configured C++ standard.

3. **Design / Code Review Agent**:

   - **Role**: Architectural oversight and code quality enforcement.
   - **Responsibilities**: Reviews the implementation plans and C++ code against the `best-practices-*` skills. Enforces Clean Code principles, architectural layering, and security rules before code is finalized.

4. **QA / Tester Agent**:

   - **Role**: Quality assurance and test coverage.
   - **Responsibilities**: Writes test cases using the configured testing framework. Continuously runs the configured test command to verify correctness and reports back to the Lead Agent.

5. **Build System Agent**:
   - **Role**: Managing build configurations and cross-platform support.
   - **Responsibilities**: Updates the project's build system files, manages dependencies according to the configured package manager, and ensures cross-platform settings (like export macros) are correctly maintained.

## Code Style & Tooling

Once the project is scaffolded, enforce the following:

- Follow the coding style configured in `.clang-format`. (Note: Choosing a Google or LLVM coding style does NOT override naming conventions; the user's explicit naming convention decisions always take precedence.)
- Ensure all C++ files use LF line endings (as per `.gitattributes`).
- Never commit code that fails `.clang-tidy` checks.

## Naming Conventions

- Adhere strictly to the naming conventions established in the project (e.g., camelCase vs snake_case, file extensions like `.cpp` vs `.cc`).
- **CRITICAL RULE**: You may ONLY deviate from the established naming convention if absolutely required by a project dependency (for example, if a specific testing framework explicitly insists that test files must end in `_test`).

## Build System & Testing

- Adhere strictly to the project's configured build system and testing framework.
- Use the local workspace skills (e.g., `build-project` and `test-project`) to compile and test the code.
- Do not write custom shell scripts for building unless explicitly instructed to do so by the user's stack configuration.
- **Out-of-Source Builds**: A build process must not modify the source directory. The source directory can be modified by the user and agents, but not by build scripts. A `build` or similar subdirectory in the source tree is allowed for this purpose. When you identify a directory serving this purpose, check if it is present in `.gitignore` and add it if missing (subject to follow-up user review). If modification to the source directory by build scripts appears unavoidable, ask the user for an exception. Try to limit the affected source files (for example, allow just for a few machine-generated files that are infrequently updated).

## Security & Privacy

- **NEVER** upload anything on the internet to prevent IP, trade secret, or other leaks.
- This rule is absolute unless under explicit instructions from the developer, in which case an implementation plan is mandatory.
```
