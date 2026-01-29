# Playwright Console Error Catcher Demo 🚨

This repository demonstrates a **simple but powerful trick** to catch hidden frontend bugs in your automated tests. 

Your UI tests can pass ✅, but the browser console might be full of errors 🔥. This project shows how to fail your Playwright tests if any console errors occur, ensuring no silent failures reach production.

## 🌟 The Problem

Typical UI tests check if elements are visible or clickable. However, they often miss:
- JavaScript crashes that don't immediately break the UI
- API 500 errors logged to console
- Missing assets or variables (e.g., `ReferenceError`)

In this demo, clicking the "Load Data" button updates the UI text successfully, so a standard test would **pass**. But underneath, it throws a critical `ReferenceError`.

## 🛠 The Solution

We use Playwright hooks to listen for console errors:
1. **`beforeEach`**: Start listening to `console.error` and `page.on("pageerror")`.
2. **`afterEach`**: Check if any errors were collected. If yes, **fail the test**.

## 🚀 How to Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the test (It is EXPECTED to FAIL)**:
   ```bash
   npx playwright test
   ```

   You will see an output similar to:
   ```text
   Error: Test failed because browser console errors were detected:
   CRITICAL: Failed to fetch analytics configuration. ReferenceError: analytics is not defined...
   API Error: 500 Internal Server Error - /api/tracking
   ```

## 📝 Code Snapshot

**`tests/console-error.spec.ts`**:

```typescript
test.beforeEach(async ({ page }) => {
  consoleErrors.length = 0;
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
});

test.afterEach(() => {
  if (consoleErrors.length > 0) {
    expect(consoleErrors.length, `Errors detected: ${consoleErrors.join('\n')}`).toBe(0);
  }
});
```

## 🤝 Contributing

Feel free to fork this and use it as a template for your own QA automation improvements!

#Playwright #TestingTips #AutomationTesting #QA
