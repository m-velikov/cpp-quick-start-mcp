---
name: scaffold-workspace-skills
description: Template and structural requirements for the permanent workspace skills (configure-project, build-project, etc.) generated into a user project. Use when creating or updating skills in a project's skills/ directory.
---

# Workspace Skills Scaffolding Skill

This skill defines the mandatory structure for the permanent workspace skills written into a scaffolded project's `skills/` directory. Follow it for EVERY skill generated there, so the skills come out consistent regardless of which agent or model generated them.

## Requirements

1. **Location**: Each skill lives at `skills/<skill-name>/SKILL.md`. Use kebab-case names matching the directory (`configure-project`, `build-project`, `best-practices-cmake`).
2. **Frontmatter**: Every skill MUST begin with a YAML frontmatter block containing:
   - `name`: the kebab-case skill name (matching the directory).
   - `description`: one line stating both what the skill does AND when to use it (`Use when ...`). Agents rely on this line alone to decide whether to load the skill.
3. **Copy-pasteable commands**: Every command MUST appear in a fenced code block, exactly as it should be run from the project root. Do NOT use placeholders the reader must resolve (e.g., `<your-preset>`); use the project's actual preset, target, and directory names.
4. **Required sections for task skills** (`configure-project`, `build-project`, `test-project`, and similar), in order:
   - `## Commands` — the exact CLI commands for the task, in execution order, including any prerequisite steps.
   - `## Expected Output` — a brief note on what success looks like (e.g., "the command exits 0 and prints `100% tests passed`").
   - `## Troubleshooting` — the 2–4 most likely failure modes and their fixes (e.g., missing dependency, stale build cache, preset not configured yet).
5. **Best-practices skills**: Skills imported from the MCP knowledge base (`best-practices-*`) keep their fetched content IN FULL (do not summarize or truncate), preceded by the frontmatter described above and followed by any project-specific additions.

## Template for a Task Skill

````markdown
---
name: build-project
description: Builds all project targets. Use when compiling the project or fixing build errors.
---

# Build the Project

## Commands

```bash
cmake --build --preset dev -j
```

## Expected Output

The build finishes with exit code 0 and no compiler warnings (warnings are treated as errors in the `dev` preset).

## Troubleshooting

- **Unknown preset `dev`**: the project has not been configured yet; follow `skills/configure-project/SKILL.md` first.
- **Missing dependency headers**: re-run the dependency installation step from `skills/configure-project/SKILL.md`.
````

## Workflow Integration

This skill is utilized by the `go` prompt during the "Workspace Skills Generation" phase, before any `skills/<name>/SKILL.md` file is written.
