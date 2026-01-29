document.addEventListener('DOMContentLoaded', () => {
    // === ELEMENTS ===
    const triggerBtn = document.getElementById('trigger-btn');
    const uiSuccessMsg = document.getElementById('ui-success');

    // IDE Elements
    const terminalLog = document.getElementById('terminal-log');
    const listenerCode = document.getElementById('code-listener');
    const failCode = document.getElementById('code-fail');

    // Browser Console Elements
    const browserLogs = document.getElementById('browser-logs');

    // === UTILS ===
    function logToTerminal(msg, type = 'info') {
        const line = document.createElement('div');
        line.className = `term-line ${type}`;
        line.textContent = msg;
        terminalLog.appendChild(line);
        terminalLog.scrollTop = terminalLog.scrollHeight;
    }

    function logToBrowserConsole(msg, type = 'log') {
        const line = document.createElement('div');
        line.className = `log ${type}`;
        const icon = type === 'err' ? '❌ ' : 'ℹ️ ';
        line.textContent = `${icon}${msg}`;
        browserLogs.appendChild(line);
        browserLogs.scrollTop = browserLogs.scrollHeight;
    }

    // === INTERACTION FLOW ===
    triggerBtn.addEventListener('click', async () => {
        // Reset state
        uiSuccessMsg.classList.add('hidden');
        triggerBtn.disabled = true;
        triggerBtn.innerText = 'Syncing...';

        // Clear previous runs in terminal somewhat
        logToTerminal('--------------------------------------------------');
        logToTerminal('> Performing click action on #sync-btn...', 'info');

        // 1. Simulate UI Success (The Happy Path)
        setTimeout(() => {
            triggerBtn.innerText = 'Sync Data Now';
            triggerBtn.disabled = false;
            uiSuccessMsg.classList.remove('hidden');

            // Log to browser console (invisible to non-devs usually)
            logToBrowserConsole('UI updated successfully.', 'log');
        }, 800);

        // 2. TRIGGER THE HIDDEN BUG
        setTimeout(() => {
            // Trigger visual activity in IDE to show "Listening"
            listenerCode.classList.add('active-scan');

            const errorText = "Uncaught ReferenceError: analytics is not defined at updateDashboard (main.js:402)";

            // Log real error to browser console
            logToBrowserConsole(errorText, 'err');

            // 3. Playwright Catches It (In the IDE)
            setTimeout(() => {
                logToTerminal(`[console] Error: ${errorText}`, 'error');

                // Show the "Listener" catching it
                setTimeout(() => {
                    listenerCode.classList.remove('active-scan');
                    listenerCode.classList.add('active-error');

                    // Show the "AfterEach" failing
                    setTimeout(() => {
                        failCode.classList.add('active-error');
                        logToTerminal('❌ Test failed! Console errors were detected.', 'error');
                        logToTerminal('--------------------------------------------------', 'error');

                        // Cleanup highlights after a few seconds
                        setTimeout(() => {
                            listenerCode.classList.remove('active-error');
                            failCode.classList.remove('active-error');
                        }, 4000);

                    }, 1000);
                }, 500);

            }, 500);

        }, 1200);
    });
});
