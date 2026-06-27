// content/content.js

// Ensure we don't initialize multiple times if the script is injected again
if (!window.CSSInspectorContentInitialized) {
    window.CSSInspectorContentInitialized = true;

    // Create a global namespace for our utility modules to attach to
    window.CSSInspector = window.CSSInspector || {};

    let isInspecting = false;
    let hoveredElement = null;

    // Mouse move handler to highlight elements
    const handleMouseMove = (e) => {
        if (!isInspecting) return;

        // Find the element under the cursor
        const element = document.elementFromPoint(e.clientX, e.clientY);

        // Avoid unnecessary updates if we're on the same element or no element
        if (!element || element === hoveredElement) return;

        // Ignore overlay elements (though they should have pointer-events: none)
        if (element.id && element.id.startsWith('css-inspector-pro-')) return;

        hoveredElement = element;

        // Update the visual overlay
        if (window.CSSInspector.Overlay) {
            window.CSSInspector.Overlay.update(hoveredElement);
        }
    };

    // Click handler to inspect the element and extract data
    const handleClick = (e) => {
        if (!isInspecting || !hoveredElement) return;

        // Prevent default actions like following links or submitting forms
        e.preventDefault();
        e.stopPropagation();

        // Ensure all utility modules are loaded before extracting
        if (
            !window.CSSInspector.CSS || 
            !window.CSSInspector.DOM || 
            !window.CSSInspector.Tailwind || 
            !window.CSSInspector.A11y
        ) {
            console.error("CSS Inspector Pro: Utility modules not fully loaded.");
            return;
        }

        // Extract Data
        const cssData = window.CSSInspector.CSS.extract(hoveredElement);
        const domData = window.CSSInspector.DOM.extract(hoveredElement);
        const tailwindData = window.CSSInspector.Tailwind.generate(cssData);
        const a11yData = window.CSSInspector.A11y.check(hoveredElement);

        const inspectionData = {
            css: cssData,
            dom: domData,
            tailwind: tailwindData,
            a11y: a11yData
        };

        // Save data to storage so it persists if the popup is closed
        chrome.storage.local.set({ inspectionData: inspectionData }, () => {
            // Send data back to the popup
            try {
                chrome.runtime.sendMessage({
                    action: "ELEMENT_INSPECTED",
                    data: inspectionData
                });
            } catch (err) {}
        });

        // Optionally, stop inspecting after selection so the user can interact with the popup
        stopInspecting();
    };

    // Keydown handler to cancel inspection with Escape key
    const handleKeyDown = (e) => {
        if (!isInspecting) return;
        if (e.key === 'Escape') {
            stopInspecting();
            // Sync with popup if open
            chrome.runtime.sendMessage({ action: "INSPECTION_CANCELLED" }); 
        }
    };

    const startInspecting = () => {
        if (isInspecting) return;
        isInspecting = true;
        
        // Use capture phase to ensure we intercept events before the page does
        document.addEventListener('mousemove', handleMouseMove, { capture: true, passive: true });
        document.addEventListener('click', handleClick, { capture: true });
        document.addEventListener('keydown', handleKeyDown, { capture: true });
        
        if (window.CSSInspector.Overlay) {
            window.CSSInspector.Overlay.show();
        }
    };

    const stopInspecting = () => {
        if (!isInspecting) return;
        isInspecting = false;
        hoveredElement = null;
        
        document.removeEventListener('mousemove', handleMouseMove, { capture: true });
        document.removeEventListener('click', handleClick, { capture: true });
        document.removeEventListener('keydown', handleKeyDown, { capture: true });
        
        if (window.CSSInspector.Overlay) {
            window.CSSInspector.Overlay.hide();
        }
    };

    // Listen for messages from the popup or background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "START_INSPECT") {
            startInspecting();
            sendResponse({ status: "started" });
        } else if (message.action === "STOP_INSPECT") {
            stopInspecting();
            sendResponse({ status: "stopped" });
        } else if (message.action === "PING") {
            // Used by popup to check if it should restore "Active" state
            sendResponse({ isInspecting: isInspecting });
        }
        return true; 
    });
}
