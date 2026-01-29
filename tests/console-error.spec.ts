import { test, expect } from '@playwright/test';

test.describe('Frontend Console Error Check', () => {
    const consoleErrors: string[] = [];

    // 1. Add a console listener in beforeEach
    test.beforeEach(async ({ page }) => {
        // Reset the error array for each test
        consoleErrors.length = 0;

        // Listen for console events
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
                console.log(`[Captured Console Error]: ${msg.text()}`);
            }
        });

        // Also catch unhandled exceptions if you want to be extra safe
        page.on('pageerror', exception => {
            consoleErrors.push(`Uncaught exception: ${exception.message}`);
            console.log(`[Captured Page Error]: ${exception.message}`);
        });
    });

    test('should fail if console errors occur during user interaction', async ({ page }) => {
        // Navigate to the page
        await page.goto('/');

        // Verify initial state
        await expect(page.locator('h1')).toHaveText('Frontend Bug Demo');

        // Perform the action that triggers the error
        // The UI will update successfully, so a normal test might pass this step
        await page.click('#action-btn');

        // Verify UI updated - this assertion PASSES even though console errors happened!
        await expect(page.locator('#status')).toHaveText('Data Loaded Successfully!');
    });

    // 2. Fail the test in afterEach if any error appears
    test.afterEach(() => {
        if (consoleErrors.length > 0) {
            const errorMsg = `Test failed because browser console errors were detected:\n${consoleErrors.join('\n')}`;
            // Fail the test
            expect(consoleErrors.length, errorMsg).toBe(0);
        }
    });
});
