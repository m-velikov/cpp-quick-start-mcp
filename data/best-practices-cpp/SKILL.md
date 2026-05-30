---
name: best-practices-cpp
description: General C++ programming best practices based on the C++ Core Guidelines.
---

# C++ Best Practices (Core Guidelines)

When writing or modifying C++ code in this project, strictly adhere to the philosophies outlined in the official [C++ Core Guidelines](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md).

## 1. Resource Management (RAII)

- Avoid naked `new` and `delete`. Use `std::make_unique` and `std::make_shared` for dynamic allocation.
- Use smart pointers (`std::unique_ptr`, `std::shared_ptr`) or containers (like `std::vector`) to manage ownership.
- Never pass a smart pointer unless the function needs to manipulate the ownership itself. Pass by reference (`T&`) or `const` reference (`const T&`) otherwise.

## 2. Interfaces

- Make interfaces explicit. Do not hide dependencies or rely on global state.
- Consistently use `const`. If a function does not modify an argument, pass it as `const T&`. If a member function does not modify state, mark it `const`.
- Use `std::optional` or `std::expected` for functions that might fail to return a value, rather than out-parameters or ambiguous return codes.

## 3. Modern Language Features

- Use `auto` to avoid redundant type names, but keep types explicit when it improves readability.
- Prefer range-based `for` loops over index-based loops.
- Prefer using `constexpr` and `consteval` for values and functions that can be evaluated at compile time.
- Prefer `<ranges>` and range-based algorithms (like `std::ranges::find_if`) over `<algorithm>` and iterator-based algorithms where possible, and prefer both over writing raw loops.
- Use `std::span` when passing read-only views of contiguous memory instead of passing raw pointers/sizes or `const std::vector&`.

## 4. Safety and Error Handling

- Use exceptions for error handling unless the project is explicitly compiled without them.
- Throw by value, catch by reference.
- Apply `noexcept` consistently for functions that are guaranteed not to throw exceptions (especially move constructors and destructors).
- Use `[[nodiscard]]` on functions where ignoring the return value is likely a bug (e.g., error codes).
- Avoid C-style raw arrays; use `std::array` or `std::vector`. When creating `std::array`s, prefer `std::to_array` to deduce the array length automatically instead of hardcoding it (e.g., `auto arr = std::to_array({1, 2, 3});`).

These guidelines ensure the code remains safe, performant, and maintainable across the entire project.
