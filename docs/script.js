document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('trigger-bug-btn');
    const statusDiv = document.getElementById('ui-message');
    const consoleDiv = document.getElementById('console-logs');

    // Utility: Add log to our fake visual console
    function logToVisualConsole(msg, type = 'info') {
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        line.innerText = msg;
        consoleDiv.appendChild(line);
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }

    btn.addEventListener('click', () => {
        // 1. HAPPY PATH: Update UI to look green and good
        btn.innerHTML = 'Refetching...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = 'Fetch Dashboard Data';
            btn.disabled = false;
            statusDiv.classList.remove('hidden');

            // Log successful UI action
            logToVisualConsole('> UI Updated: Success Message Visible', 'info');

            // 2. SECRET FAILURE: Throw the "silent" errors
            triggerSilentErrors();
        }, 600);
    });

    function triggerSilentErrors() {
        setTimeout(() => {
            // Throw ReferenceError (The classic "variable not defined" bug)
            try {
                // @ts-ignore
                const x = analytics.trackClick();
            } catch (e) {
                // We actually log it to real console so Playwright captures it
                console.error(`Uncaught ReferenceError: analytics is not defined at clickHandler (index.js:42)`);

                // Show it on our visual console so human users can see what the robot sees
                logToVisualConsole(`[Error] Uncaught ReferenceError: analytics is not defined`, 'error');
            }

            // Fake API 500
            setTimeout(() => {
                const apiError = `GET http://api.internal/v1/user/tracking 500 (Internal Server Error)`;
                console.error(apiError);
                logToVisualConsole(`[Error] ${apiError}`, 'error');
            }, 100);

        }, 100);
    }
});
