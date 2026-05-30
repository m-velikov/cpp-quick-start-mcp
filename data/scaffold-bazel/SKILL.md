---
name: scaffold-bazel
description: Generates Bazel build files (WORKSPACE/BUILD) for configuring a C++ project.
---

# Bazel Scaffolding Skill

This skill instructs the agent on how to scaffold Bazel build files for a C++ project.

## Requirements

When the user specifies Bazel for the Build System, the agent MUST generate a root `MODULE.bazel` file (as Bzlmod is the default in Bazel 7+) and `BUILD` or `BUILD.bazel` files in the necessary directories.

## Instructions

1. **Root File**: Create a `MODULE.bazel` file in the project root to mark it as a Bazel workspace and define dependencies using `bazel_dep`.
2. **Targets and Modularity**: Use `cc_library` and `cc_binary` rules to define the libraries and executable tools requested by the user.
   - Separate rules into individual `BUILD` files inside their respective source directories.
3. **Libraries**:
   ```starlark
   # src/my_lib/BUILD
   cc_library(
       name = "my_lib",
       srcs = ["my_lib.cc"],
       hdrs = ["my_lib.h"],
       includes = ["."], # or strip_include_prefix
       visibility = ["//visibility:public"],
   )
   ```
4. **Executables**:
   ```starlark
   # src/my_app/BUILD
   cc_binary(
       name = "my_app",
       srcs = ["main.cc"],
       deps = ["//src/my_lib:my_lib"],
   )
   ```
5. **Testing**:
   - For `cc_test` targets, depend on the testing framework.
   ```starlark
   cc_test(
       name = "my_lib_test",
       srcs = ["my_lib_test.cc"],
       deps = [
           "//src/my_lib:my_lib",
           "@googletest//:gtest_main", # Example if using gtest via bazel_dep in MODULE.bazel
       ],
   )
   ```

## Build Skills Generation

If Bazel is the build system, the agent MUST generate a `skills/build-project/SKILL.md` in the new project.
The generated skill must instruct agents to build the project using:

```bash
bazel build //...
```

And to run tests:

```bash
bazel test //...
```
