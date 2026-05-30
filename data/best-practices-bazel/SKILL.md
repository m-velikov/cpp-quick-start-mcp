---
name: best-practices-bazel
description: Best practices for building C++ projects with Bazel.
---

# Bazel Best Practices

When building C++ components with Bazel, strictly adhere to the following principles:

## 1. Granular Targets

- Prefer small, granular `cc_library` targets over monolithic ones. This maximizes caching and parallelization.
- Ensure that every header file is associated with at least one `cc_library` using the `hdrs` attribute.

## 2. Dependency Management

- Declare external dependencies using Bzlmod (`MODULE.bazel`). Avoid the legacy `WORKSPACE` file where possible.
- Use `bazel dep` commands or manually edit `MODULE.bazel` to specify third-party libraries.

## 3. Visibility

- Restrict visibility using `visibility = ["//visibility:private"]` or specific package lists.
- Expose targets via `//visibility:public` only when they are intended to be consumed by arbitrary external packages.

## 4. Include Paths

- Use `strip_include_prefix` or `include_prefix` if you need to manipulate header paths.
- Avoid using `copts = ["-I..."]` for include paths; rely on the native `includes` attribute or proper dependency propagation.
