---
name: scaffold-gtest
description: Generates boilerplate for Google Test (GTest) framework integration. Use when GTest was chosen as the testing framework.
---

# GTest Scaffolding Skill

This skill instructs the agent on how to scaffold Google Test (GTest) for a C++ project.

## Requirements

When the user specifies GTest for their Testing Framework, you MUST generate the necessary boilerplate to integrate it with the chosen build system and package manager.

## Instructions for CMake

If the Build System is CMake:

1. **Fetching GTest**: If the user didn't specify a package manager (or specifies FetchContent), use CMake's `FetchContent` to download GTest:
   ```cmake
   include(FetchContent)
   FetchContent_Declare(
     googletest
     URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
   )
   # For Windows: Prevent overriding the parent project's compiler/linker settings
   set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
   FetchContent_MakeAvailable(googletest)
   ```
2. **Linking**: Link test executables against `GTest::gtest_main` and `GTest::gmock`.
   ```cmake
   add_executable(my_test test_main.cpp)
   target_link_libraries(my_test PRIVATE GTest::gtest_main GTest::gmock my_library)
   ```
3. **Test Discovery**: Include `GoogleTest` and use `gtest_discover_tests()` to automatically discover tests for CTest.
   ```cmake
   include(GoogleTest)
   gtest_discover_tests(my_test)
   ```

## Instructions for Source Files

Generate a basic test file `test_main.cpp` using the `TEST` macro:

```cpp
#include <gtest/gtest.h>

TEST(ExampleTest, BasicAssertions) {
    EXPECT_EQ(1, 1);
    EXPECT_TRUE(true);
}
```

_Note: If linking against `GTest::gtest_main`, no `main()` function is required in the test file._
