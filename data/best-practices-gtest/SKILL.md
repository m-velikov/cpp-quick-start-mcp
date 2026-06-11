---
name: best-practices-gtest
description: Best practices for writing C++ tests with Google Test. Use when writing or modifying GTest unit or integration tests.
---

# Google Test (GTest) Best Practices

Follow these guidelines when writing unit and integration tests using GTest:

## 1. Test Organization

- Mirror the source directory structure in the `tests/` directory.
- Use `TEST(TestSuiteName, TestName)` for simple standalone tests.
- Use `TEST_F(TestFixtureName, TestName)` when multiple tests share the same setup and teardown logic via a fixture class.

## 2. Assertions

- Prefer `EXPECT_*` over `ASSERT_*` when you want the test to continue running after a failure.
- Use `ASSERT_*` only when a failure means subsequent code in the test will crash or behave completely unpredictably.
- Provide descriptive failure messages by streaming into the macro: `EXPECT_EQ(a, b) << "Values should match because...";`

## 3. Naming Conventions

- Test suite names should describe the component being tested (e.g., `StringUtilsTest`).
- Test names should describe the specific scenario or behavior being verified (e.g., `HandlesEmptyStrings`).

## 4. Mocking

- Use gMock (`MOCK_METHOD`) to mock interfaces when testing components in isolation.
- Verify expectations explicitly using `EXPECT_CALL` before invoking the code under test.
