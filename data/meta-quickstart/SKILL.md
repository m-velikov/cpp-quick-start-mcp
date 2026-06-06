---
name: go
description: Interviews the user about their preferred C++ stack and generates the specific project scaffolding skills.
---

# Meta-Scaffold Skill

This is a Level 2 "Meta-Skill". Its purpose is not to write C++ code directly, but to generate the _actual_ scaffolding skills (e.g., `scaffold-project`, `build-project`) tailored to the user's specific tooling choices.

## Workflow

When invoked, follow these steps exactly:

### Step 1: Pre-flight Project Scan

Before doing anything, YOU MUST list the contents of the current working directory to determine if it is empty or already contains a project (e.g., presence of `CMakeLists.txt`, `src/`, `Makefile`, etc.).

If the directory is essentially **EMPTY**, proceed to **Mode A: New Project Interview**.
If the directory **CONTAINS AN EXISTING PROJECT**, proceed to **Mode B: Add Components**.

---

### Mode A: New Project Interview

Ask the user to select their preferences for the following categories.
**CRITICAL**: You MUST use your interactive multiple-choice question tool (e.g., `ask_question`) to present these questions to the user in a strict multiple-choice format. Always ensure the user has a free-form text input option to provide custom answers (write-ins).

1. **C++ Standard Version**: (e.g., C++11, C++14, C++17, C++20, C++23)
2. **Build System**: (e.g., CMake, Bazel, Meson, Makefiles)
3. **Dependency Management**: (e.g., FetchContent, vcpkg, Conan, system packages)
   - **CRITICAL**: Do NOT ask contradicting questions. Adapt your questions dynamically based on previous answers. For example, if the user chooses Conan for Dependency Management, do NOT ask them about vcpkg for Project Packaging in the next question unless they explicitly request both.
4. **Project Packaging**: (e.g., Conan conanfile.py, vcpkg manifest, None)
5. **Testing Framework**: (e.g., GTest, Catch2, doctest, Boost.Test)
6. **Code Quality**: (e.g., clang-tidy, cppcheck, pre-commit hooks, custom build targets)
7. **CI Provider**: (e.g., GitHub Actions, GitLab CI, None)
8. **Coding Style**: (e.g., Google, LLVM, Mozilla, WebKit, Custom)
9. **Target Platforms**: (e.g., Desktop vs. Mobile, Windows vs Linux, Android vs macOS).
10. **Directory Layout**: (e.g., Standard Pitchfork [src/, include/, tests/], Flat Layout, or Custom). **CRITICAL**: Suggest Pitchfork directory layout based on the user's answers for Target Platforms.
11. **Naming Conventions**: Preferred standards for types, values, namespaces, file names, and file extensions (e.g., `.cpp`/`.hpp` vs `.cc`/`.h`).
12. **Libraries and Tools**: explicitly ask the user: "What libraries or executable tools do you want to build in this project?"

- **CRITICAL**: You must prompt the user repeatedly (e.g., "Are there any other libraries or tools?") until the user explicitly says "no more targets for now".

Wait for the user's responses. Only proceed to **Step 2 (Implementation Plan)** when all 12 questions are answered AND the user indicates they have no more targets to add.

---

### Mode B: Existing Project (Add Components or Modernize)

If the project already exists, **DO NOT** conduct the full Mode A interview.

1. **Convention Scanning**: You MUST read the existing build files (e.g., `CMakeLists.txt`, `Makefile`) and a few source files to automatically infer the build system, package manager, directory layout, naming conventions, and code formatting style. Auto-detect whatever is possible.
2. **Path Selection**: Ask the user: _"I see this is an existing project. Would you like to **1. Add new components** (libraries/executables), or **2. Modernize the codebase and augment it for agentic development**?"_

**If the user chooses Path 1 (Add Components):**

3. **Component Interview**: Ask the user what new components to add, prompting repeatedly until they say "no more targets for now".
4. **Target Platforms**: Ask about support for major target platforms (e.g., Desktop vs. Mobile, Windows vs Linux, Android vs macOS).
5. **Layout Conformity Check**: Evaluate if adding these new components causes the project to violate its inferred directory layout conventions.
   - If it violates conventions or if the target platforms suggest a more robust layout, you MUST explicitly suggest a layout refactoring (e.g., migrating to Pitchfork layout).
6. Proceed to **Step 2 (Implementation Plan)**.

**If the user chooses Path 2 (Modernize & Augment):**

3. **Missing Tooling Interview**: Based on the auto-detected conventions, identify missing modern tooling (e.g., code hygiene like `.clang-format` and pre-commit hooks, `.clang-tidy`, `cppcheck`, testing frameworks, CI/CD, base configs like `.gitignore`). Ask the user which of these missing tools they would like to integrate.
4. **Build System Evaluation**: Evaluate the existing build system. Do NOT suggest migrating it to a completely different build system (e.g., do not migrate Makefiles to CMake). Instead, suggest improvements for the existing build system (e.g., modernizing legacy CMake to target-based CMake, or optimizing Makefiles). **If CMake is used, suggest generating a `CMakePresets.json` to standardize build configurations.**
5. **Layout Refactoring**: You MUST explicitly ask the user if they would like to migrate to the standard Pitchfork directory layout, explaining its benefits for modern C++ projects, unless they are already strictly following it.
6. **Target Platforms**: Ask the user about support for major target platforms (e.g., Desktop vs. Mobile, Windows vs Linux, Android vs macOS).
7. Proceed to **Step 2 (Implementation Plan)**.

---

### Step 2: Implementation Plan

Based on the chosen Mode and the user's answers, create a formal implementation plan.

**CRITICAL TOOLING RULE**: For every tool, build system, CI provider, code quality checker, or package manager selected by the user (or universally required, like `base-configs`), you MUST actively attempt to fetch its corresponding `mcp://scaffold/<name>` resource.

- **Resource Discovery**: First, invoke the `list_resources` tool (if available) to discover the exact URIs of all available `mcp://scaffold/*` resources. Do not guess the URIs blindly.
- **Resource Fetching**: Then, use the `read_resource` tool to fetch the content of the relevant URIs before writing files. If a specific resource exists for a chosen tool, you must follow it strictly. If no specific resource exists, you should still proceed and configure it correctly using your general knowledge.

**If you are in Mode A (New Project):**
Your plan must outline the exact file templates and commands needed to bootstrap the cross-platform C++ project using the chosen stack.

- Prefer splitting build system files per artifact (e.g., using `add_subdirectory` or `subdir()`) instead of creating a single top-level monolithic build file.
- Explicitly plan to run `git init` in the project directory if a Git repository is not already initialized, and to create or rename the initial branch to `main` (e.g. `git branch -M main`).
- Plan to generate a fresh `README.md` specifically describing the user's new C++ project. This `README.md` MUST include a `## Configure and Build` section containing the exact CLI commands required to configure and build the project based on the user's chosen stack (e.g., `cmake --preset dev` or `conan install . --build=missing`).
- Plan to read the `scaffold-base-configs` skill and generate the `.gitignore`, `.gitattributes`, and `.clangd` files.
- Plan to read the `scaffold-agents` skill from the MCP knowledge base and use it to generate an `AGENTS.md` file in the user's project root.
- **CRITICAL**: If CMake is the build system, you MUST read the `scaffold-cmake-presets` skill and plan to generate a `CMakePresets.json` file.

**If you are in Mode B (Existing Project - Add Components):**
Your plan must detail how you will create the new target folders adhering strictly to the inferred layout conventions, and how you will safely _append_ the new targets to the existing build files (do NOT overwrite existing files).
If a layout refactoring was agreed upon, include that in the plan before adding the new components.

**If you are in Mode B (Existing Project - Modernize):**
Your plan must include:

- Reading the `scaffold-base-configs` skill to ensure `.gitignore`, `.gitattributes`, and `.clangd` are present and correct.
- Generating an `AGENTS.md` file using the `scaffold-agents` skill.
- Safely introducing the requested code quality tools (e.g., `.clang-format`, `.clang-tidy`).
- Applying the agreed-upon build system improvements directly to the existing build files.
- Implementing any layout refactoring if agreed upon.
- **CRITICAL**: If CMake is the build system and the user agreed to CMake improvements, you MUST read the `scaffold-cmake-presets` skill and plan to generate a `CMakePresets.json` file.

**Workspace Skills Generation (All Modes)**:
In ALL plans, you must include the creation of customized permanent workspace SKILL files. These must be written directly into the project's workspace using an agent-agnostic directory like `.agents/skills/` or `skills/` so that any AI working in the project immediately knows how to operate it. **CRITICAL**: Do NOT use agent-specific directories like `.gemini` or `.claude`.

**Skill Modification Guidelines**: When upgrading or modifying existing skills, avoid big rewrites of an existing skill file. Do the minimal changes which add the new information and remove the obsolete information.

The workspace skills to create are:

1. `skills/configure-project/SKILL.md`: Exact instructions and CLI commands for fetching dependencies, installing them, and configuring the project (e.g., `conan install` or `vcpkg install` followed by `cmake -B build`).
2. `skills/build-project/SKILL.md`: Exact instructions and CLI commands for building the project (e.g., `cmake --build build -j`).
3. **Component Best Practices**: For each of the components and tools used in the project (e.g., CMake, vcpkg, GTest), create a dedicated skill containing best practices and usage instructions tailored to this specific project. **CRITICAL**: You MUST use the `read_resource` tool to fetch the corresponding `mcp://scaffold/best-practices-<name>` resource and include its contents IN FULL (do not summarize or truncate).
4. **Refactoring Best Practices**: Create a skill (e.g., `skills/best-practices-refactoring/SKILL.md`) detailing how to safely refactor code within the project's layout and test constraints. **CRITICAL**: You MUST fetch the `mcp://scaffold/best-practices-refactoring` resource and include its contents IN FULL. **Also include the rule**: When creating or renaming a C++ namespace, review the names of the files and directories where members of the namespace are declared/defined; strive for consistency.
5. **Code Review Best Practices**: Create a skill (e.g., `skills/best-practices-code-review/SKILL.md`) containing guidelines for reviewing code to ensure compliance with the project's chosen formatting, style, and CI requirements. **CRITICAL**: You MUST fetch the `mcp://scaffold/best-practices-code-review` resource and include its contents IN FULL.
6. **C++ Core Guidelines Best Practices**: Create a skill (e.g., `skills/best-practices-cpp/SKILL.md`) establishing fundamental C++ guidelines based on the [C++ Core Guidelines](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md). **CRITICAL**: You MUST fetch the `mcp://scaffold/best-practices-cpp` resource and include its contents IN FULL.

Wait for the user's explicit approval on the implementation plan before proceeding to Execution.

### Step 3: Execution

Once the user approves the implementation plan, proceed to directly execute it. Implement the code, initialize git, create the workspace skills, and verify the build as outlined in your plan.
