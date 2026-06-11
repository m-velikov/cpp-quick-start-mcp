# Agent Configuration and Guidelines

You are an AI assistant operating within the `cpp-quick-start-mcp` repository, which is a **TypeScript MCP Server** providing C++ scaffolding skills. Your behavior must adhere to the following directives.

## Agent Topology & Roles

This repository is designed to be operated by a multi-agent system. When working on larger tasks, define and invoke the following specialized subagents to distribute the workload:

1. **Lead Orchestrator Agent (You)**:

   - **Role**: High-level planning, user communication, and task delegation.
   - **Responsibilities**: Breaks down user requests into tasks and delegates them to specialized subagents.

2. **TypeScript / MCP Coder Agent**:

   - **Role**: Core implementation and logic design.
   - **Responsibilities**: Writes the actual TypeScript code for the MCP server (`src/index.ts`), manages tool definitions, and updates the markdown skill templates in `data/`.

3. **Design / Code Review Agent**:

   - **Role**: Architectural oversight and code quality enforcement.
   - **Responsibilities**: Reviews implementation plans and TypeScript code against design principles, ensuring Clean Code and layering rules are followed before code is finalized.

4. **QA / Tester Agent**:

   - **Role**: Quality assurance and verification.
   - **Responsibilities**: Verifies that the TypeScript code builds correctly (`npm run build`) and that the generated markdown templates format correctly without breaking the JSON schemas.

5. **Tooling & Build Agent**:
   - **Role**: Managing Node.js configurations.
   - **Responsibilities**: Updates `package.json`, manages `npm` dependencies, configures `tsconfig.json`, and ensures the build outputs safely to the `build/` directory.

## Code Style & Tooling

- Enforce standard TypeScript conventions and follow the existing formatting in `src/`.
- Ensure all markdown skill templates (`data/**/*.md`) are well-formatted, use standard markdown syntax, and don't contain conflicting rules.

## Naming Conventions

- Use standard TypeScript conventions: `camelCase` for variables and functions, `PascalCase` for classes and types.
- Follow the established directory naming convention for skills: `scaffold-<name>` or `best-practices-<name>`.

## Build System & Testing

- The build system is Node.js/npm. Use `npm install` for dependencies and `npm run build` to compile the TypeScript code.
- **Out-of-Source Builds**: Compilation output goes to the `build/` directory (per `tsconfig.json` `outDir`). Do not place generated `.js` files in the `src/` directory.

## Security & Privacy

- **NEVER** upload anything on the internet to prevent IP, trade secret, or other leaks.
- This rule is absolute unless under explicit instructions from the developer, in which case an implementation plan is mandatory.
