---
name: best-practices-code-review
description: Best practices for performing automated code reviews in C++.
---

# Code Review Best Practices

When tasked with reviewing code, the agent MUST follow these guidelines to provide constructive, actionable feedback:

## 1. Style and Formatting

- Verify that the code complies with the project's chosen coding style (e.g., Google, LLVM) and naming conventions.
- Check if the code passes automated formatters like `clang-format`.

## 2. Modern C++ Usage

- Look for opportunities to use modern C++ features (e.g., `auto`, range-based for loops, `std::unique_ptr`/`std::shared_ptr` over raw pointers).
- Ensure resource management uses RAII principles.

## 3. Correctness and Safety

- Check for potential memory leaks, dangling references, or uninitialized variables.
- Verify that error handling is robust (e.g., appropriate use of exceptions or expected types).
- Look out for thread-safety issues if concurrency is involved.

## 4. Test Coverage

- Ensure that any new functionality is accompanied by corresponding unit tests.
- Verify that bug fixes include a regression test.

## 5. Feedback Format

- Be specific and constructive. Provide code snippets to demonstrate suggested improvements.
- Categorize feedback into "Critical/Blocking" and "Nitpicks/Optional".
