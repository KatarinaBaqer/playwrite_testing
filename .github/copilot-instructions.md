
# Copilot Instructions for AI Coding Agents

## Project Overview
This project is a Playwright-based API test suite targeting the DummyJSON REST API. The main file is `api.spec.js`, which contains comprehensive tests for CRUD operations on the `/products` resource.

## Architecture & Patterns
- **Single-file suite:** All tests are in `api.spec.js` using Playwright's test runner and APIRequestContext.
- **API Context:** Each suite creates a shared API context with a base URL and default headers in `beforeAll`, disposed in `afterAll`.
- **Test Structure:** Tests are grouped by HTTP method and scenario (positive/negative). Each test asserts on status codes and response bodies.
- **DummyJSON API:** Operations are simulated; POST/PUT/DELETE do not persist changes. Error handling is validated for non-existent resources and missing fields.

## Developer Workflows
- **Run all tests:**
  ```bash
  npx playwright test
  ```
- **Debug a single test:**
  ```bash
  npx playwright test api.spec.js --debug
  ```
- **Add new tests:**
  - Follow the pattern in `api.spec.js`: use `test('description', async () => { ... })` and the shared `apiContext`.
  - Use `expect(response.ok()).toBeTruthy()` and assert on response JSON structure.

## Conventions & Integration Points
- **Naming:** Test names start with `positive:` or `negative:` to clarify intent.
- **Error Handling:** Negative tests expect error messages in the response body for invalid operations.
- **External Dependency:** Relies on `@playwright/test` and the public DummyJSON API (`https://dummyjson.com`).
- **No persistent state:** All create/update/delete operations are simulated; tests should not expect data to persist.

## Key File Reference
- `api.spec.js`: Main test suite, demonstrates all patterns and conventions.

## Feedback & Iteration
If new files, workflows, or conventions are added, update this document. If any section is unclear or incomplete, request feedback to improve guidance for future AI agents.
