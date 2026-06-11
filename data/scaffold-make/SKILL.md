---
name: scaffold-make
description: Generates modern Makefiles for configuring a C++ project. Use when the chosen build system is Make.
---

# Makefile Scaffolding Skill

This skill instructs the agent on how to scaffold a `Makefile` for a C++ project.

## Requirements

When the user specifies Makefiles for the Build System, the agent MUST generate a single root `Makefile`. Do NOT generate recursive Makefiles (e.g., invoking `$(MAKE)` in subdirectories for sub-components). Use a non-recursive design (e.g., including `.mk` files) for better dependency tracking and performance.

## Instructions

1. **Non-Recursive Design**: Always use a non-recursive Makefile architecture. Include source files from subdirectories directly or via `include` statements.
2. **Compiler and Flags**: Define `CXX`, `CXXFLAGS`, and `LDFLAGS`. Use modern defaults.
   ```makefile
   CXX ?= g++
   CXXFLAGS ?= -std=c++17 -Wall -Wextra -Wpedantic -O2
   LDFLAGS ?=
   ```
3. **Directories**: Define `SRC_DIR`, `OBJ_DIR`, and `BIN_DIR`.
   ```makefile
   SRC_DIR := src
   OBJ_DIR := obj
   BIN_DIR := bin
   ```
4. **Source Discovery**: Automatically discover source files or list them explicitly. Use `find` rather than `$(wildcard ...)` with `**` — GNU Make does not support `**` globbing, so it would silently expand to nothing.
   ```makefile
   SRCS := $(shell find $(SRC_DIR) -name '*.cpp')
   OBJS := $(patsubst $(SRC_DIR)/%.cpp, $(OBJ_DIR)/%.o, $(SRCS))
   ```
5. **Targets**: Create rules for the executable(s) and object files.

   ```makefile
   TARGET := $(BIN_DIR)/my_app

   all: $(TARGET)

   $(TARGET): $(OBJS)
   	@mkdir -p $(@D)
   	$(CXX) $(OBJS) -o $@ $(LDFLAGS)

   $(OBJ_DIR)/%.o: $(SRC_DIR)/%.cpp
   	@mkdir -p $(@D)
   	$(CXX) $(CXXFLAGS) -c $< -o $@

   clean:
   	rm -rf $(OBJ_DIR) $(BIN_DIR)

   .PHONY: all clean
   ```

## Build Skills Generation

If Makefile is the build system, the agent MUST generate a `skills/build-project/SKILL.md` in the new project.
The generated skill must instruct agents to build the project using:

```bash
make -j
```
