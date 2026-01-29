document.addEventListener('DOMContentLoaded', () => {
    // === ELEMENTS ===
    const triggerBtn = document.getElementById('trigger-btn');
    const toast = document.getElementById('toast-notification');
    const errorCountBadge = document.getElementById('error-count');

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

        // Add minimal timestamp
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        // line.innerHTML = `<span style="color:#5c6370">[${time}]</span> ${msg}`;
        line.textContent = msg; // Simple text for now

        terminalLog.appendChild(line);
        terminalLog.scrollTop = terminalLog.scrollHeight;
    }

    let errCount = 0;
    function logToBrowserConsole(msg, type = 'log') {
        const line = document.createElement('div');

        if (type === 'err') {
            line.className = 'log-entry error';
            line.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${msg}`;
            errCount++;
            if (errCount > 0) {
                errorCountBadge.classList.remove('hidden');
                errorCountBadge.innerText = errCount;
            }
        } else {
            line.className = 'log-entry info';
            line.innerHTML = `<i class="fa-solid fa-info-circle"></i> ${msg}`;
        }

        browserLogs.appendChild(line);
        browserLogs.scrollTop = browserLogs.scrollHeight;
    }

    // === INTERACTION FLOW ===
    let isRunning = false;

    triggerBtn.addEventListener('click', async () => {
        if (isRunning) return;
        isRunning = true;

        // Reset visual state
        toast.classList.add('hidden');
        errorCountBadge.classList.add('hidden');
        errCount = 0;
        browserLogs.innerHTML = ''; // Clear console
        logToBrowserConsole('[Nexus] Analytics initialized v2.4.0'); // Init msg

        triggerBtn.disabled = true;
        const originalBtnText = triggerBtn.innerHTML;
        triggerBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Syncing...';


        logToTerminal('--------------------------------------------------');
        logToTerminal('> [User Action] Clicked "Sync Live Data" button', 'info');

        // 1. Simulate UI Success (The Happy Path)
        setTimeout(() => {
            triggerBtn.innerHTML = originalBtnText;
            triggerBtn.disabled = false;
            toast.classList.remove('hidden'); // Show Success Toast

            // Log successful UI action to console (normal behavior)
            logToBrowserConsole('API Request: /api/v1/dashboard/metrics [200 OK]');
            logToBrowserConsole('UI updated with fresh data.');
        }, 1200);

        // 2. TRIGGER THE HIDDEN BUG (Slightly delayed)
        setTimeout(() => {
            // IDE: Highlight "Listening" block
            listenerCode.classList.add('active-scan');

            const errorText = "Uncaught ReferenceError: analytics is not defined at Dashboard.sync (main.bundle.js:14052)";

            // Log real error to browser console
            logToBrowserConsole(errorText, 'err');
            logToBrowserConsole("Failed to load resource: the server responded with a status of 500 (Internal Server Error)", 'err');

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
                        logToTerminal('❌ Test Failed! Caught 2 console errors.', 'error');

                        // Cleanup highlights after a few seconds
                        setTimeout(() => {
                            listenerCode.classList.remove('active-error');
                            failCode.classList.remove('active-error');
                            isRunning = false;
                        }, 5000);

                    }, 1200);
                }, 600);

            }, 600);

        }, 1600);
    });

    // Make sidebar items clickable just for fun (visual feedback)
    const navItems = document.querySelectorAll('.saas-nav-links li');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('spacer')) return;
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Make file tree items clickable (visual toggling)
    const fileItems = document.querySelectorAll('.tree-item');
    fileItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            // Just toggle 'active' class for visual effect
            document.querySelectorAll('.tree-item.file').forEach(f => f.classList.remove('active'));
            if (item.classList.contains('file')) item.classList.add('active');
        });
    });
});
