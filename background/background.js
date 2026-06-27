// background/background.js

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        console.log("CSS Inspector Pro installed successfully.");
    } else if (details.reason === "update") {
        console.log("CSS Inspector Pro updated.");
    }
});

// The background service worker acts as a central hub if needed.
// Currently, the popup.js handles state and direct injection via chrome.scripting.
// You can add context menus or keyboard shortcut listeners here in the future.
