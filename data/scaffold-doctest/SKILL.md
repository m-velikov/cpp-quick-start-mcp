---
name: scaffold-doctest
description: Generates boilerplate for Doctest framework integration. Use when doctest was chosen as the testing framework.
---

# Doctest Scaffolding Skill

This skill instructs the agent on how to scaffold Doctest for a C++ project.

## Requirements

When the user specifies Doctest for their Testing Framework, you MUST generate the necessary boilerplate to integrate it. Doctest is typically used as a single-header library, which makes it very fast and easy to integrate.

## Instructions for CMake

If the Build System is CMake:

1. **Fetching Doctest**: Use `FetchContent` to download Doctest (if no package manager is handling it):
   ```cmake
   include(FetchContent)
   FetchContent_Declare(
       doctest
       GIT_REPOSITORY https://github.com/doctest/doctest
       GIT_TAG        v2.4.11
   )
   FetchContent_MakeAvailable(doctest)
   ```
2. **Linking**: Link test executables against `doctest::doctest`.
   ```cmake
   add_executable(my_test test_main.cpp)
   target_link_libraries(my_test PRIVATE doctest::doctest my_library)
   ```
3. **Test Registration**: To register tests with CTest, use `add_test()`.
   ```cmake
   add_test(NAME my_test COMMAND my_test)
   ```

## Instructions for Source Files

Generate a basic test file `test_main.cpp`. For doctest, exactly one file must define `DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN`.

```cpp
#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include <doctest/doctest.h>

TEST_CASE("ExampleTest") {
    CHECK(1 == 1);
    REQUIRE(true);
}
```
