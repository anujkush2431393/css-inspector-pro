// popup/popup.js

let isInspecting = false;
let currentData = null;

// DOM Elements
const toggleBtn = document.getElementById('toggle-inspect-btn');
const statusIndicator = document.getElementById('status-indicator');
const resultsPanel = document.getElementById('results-panel');
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const cssList = document.getElementById('css-properties-list');
const searchInput = document.getElementById('search-css');
const tailwindOutput = document.getElementById('tailwind-output');
const a11yScoreValue = document.getElementById('a11y-score-value');
const a11yScoreCircle = a11yScoreValue.parentElement;
const a11yIssuesList = document.getElementById('a11y-issues-list');
const domInfoGrid = document.getElementById('dom-info-grid');

// Copy Buttons
const copyCssBtn = document.getElementById('copy-css-btn');
const copyTailwindBtn = document.getElementById('copy-tailwind-btn');

// Export Buttons
const exportJsonBtn = document.getElementById('export-json');
const exportTxtBtn = document.getElementById('export-txt');
const exportMdBtn = document.getElementById('export-md');
const clearDataBtn = document.getElementById('clear-data-btn');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Load previously inspected data
    chrome.storage.local.get(['inspectionData'], (result) => {
        if (result.inspectionData) {
            currentData = result.inspectionData;
            renderData(currentData);
            resultsPanel.classList.remove('hidden');
        }
    });

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Check if we are already inspecting in the current tab
    if (tab) {
        chrome.tabs.sendMessage(tab.id, { action: "PING" }, (response) => {
            if (!chrome.runtime.lastError && response && response.isInspecting) {
                isInspecting = true;
                updateToggleBtnState();
            }
        });
    }
});

// Toggle Inspect Mode
toggleBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;

    if (!isInspecting) {
        // Inject content scripts if they are not already present
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: [
                    'utils/colorConverter.js',
                    'utils/cssExtractor.js',
                    'utils/tailwindGenerator.js',
                    'utils/accessibilityChecker.js',
                    'utils/domUtils.js',
                    'content/overlay.js',
                    'content/content.js'
                ]
            });
            await chrome.scripting.insertCSS({
                target: { tabId: tab.id },
                files: ['content/overlay.css']
            });
        } catch (error) {
            console.log("Scripts might already be injected or an error occurred:", error);
        }

        chrome.tabs.sendMessage(tab.id, { action: "START_INSPECT" });
        isInspecting = true;
    } else {
        chrome.tabs.sendMessage(tab.id, { action: "STOP_INSPECT" });
        isInspecting = false;
    }
    updateToggleBtnState();
});

function updateToggleBtnState() {
    if (isInspecting) {
        toggleBtn.classList.add('active');
        toggleBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            </svg>
            <span>Stop Inspecting</span>
        `;
        statusIndicator.classList.add('active');
        statusIndicator.querySelector('.status-text').textContent = 'Inspecting...';
    } else {
        toggleBtn.classList.remove('active');
        toggleBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Start Inspecting</span>
        `;
        statusIndicator.classList.remove('active');
        statusIndicator.querySelector('.status-text').textContent = 'Ready';
    }
}

// Handle incoming messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "ELEMENT_INSPECTED") {
        currentData = message.data;
        renderData(currentData);
        resultsPanel.classList.remove('hidden');
        chrome.storage.local.set({ inspectionData: currentData });
    }
});

// Tab Switching Logic
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.add('hidden'));

        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.remove('hidden');
    });
});

// Search CSS Logic
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const items = cssList.querySelectorAll('.prop-item');
    items.forEach(item => {
        const propName = item.querySelector('.prop-name').textContent.toLowerCase();
        if (propName.includes(term)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
});

// Render Data to UI
function renderData(data) {
    // 1. Render CSS
    cssList.innerHTML = '';
    Object.entries(data.css).forEach(([prop, value]) => {
        const item = document.createElement('div');
        item.className = 'prop-item';

        let colorPreview = '';
        if (typeof value === 'string' && value.match(/(rgb|hsl|#)/)) {
            // Very basic heuristic to check if it's a color
            if (prop.includes('color') || prop.includes('background') || prop.includes('border')) {
                colorPreview = `<span class="prop-color-preview" style="background-color: ${value}"></span>`;
            }
        }

        item.innerHTML = `
            <span class="prop-name">${prop}</span>
            <span class="prop-value" title="${value}">${colorPreview}${value}</span>
        `;
        item.title = "Click to copy";
        item.addEventListener('click', () => {
            navigator.clipboard.writeText(`${prop}: ${value};`);
            const origBg = item.style.background;
            item.style.background = 'rgba(16, 185, 129, 0.2)';
            setTimeout(() => { item.style.background = origBg; }, 500);
        });
        cssList.appendChild(item);
    });

    // 2. Render Tailwind
    tailwindOutput.textContent = data.tailwind.join(' ');

    // 3. Render A11y
    a11yScoreValue.textContent = data.a11y.score;
    a11yScoreCircle.className = 'score-circle'; // Reset classes
    if (data.a11y.score >= 90) a11yScoreCircle.classList.add('perfect');
    else if (data.a11y.score >= 70) a11yScoreCircle.classList.add('good');
    else a11yScoreCircle.classList.add('poor');

    a11yIssuesList.innerHTML = '';
    if (data.a11y.issues.length === 0) {
        a11yIssuesList.innerHTML = `<li class="issue-item success">No accessibility issues found!</li>`;
    } else {
        data.a11y.issues.forEach(issue => {
            const li = document.createElement('li');
            li.className = 'issue-item';
            li.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-top:2px; flex-shrink:0;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>${issue}</span>
            `;
            a11yIssuesList.appendChild(li);
        });
    }

    // 4. Render DOM Info
    const classesText = data.dom.classes.length > 0 ? data.dom.classes.join('.<wbr>') : 'None';
    domInfoGrid.innerHTML = `
        <div class="dom-info-card">
            <span class="dom-info-label">Tag</span>
            <span class="dom-info-value">${data.dom.tag}</span>
        </div>
        <div class="dom-info-card">
            <span class="dom-info-label">Children</span>
            <span class="dom-info-value">${data.dom.childrenCount}</span>
        </div>
        <div class="dom-info-card full-width">
            <span class="dom-info-label">ID</span>
            <span class="dom-info-value">${data.dom.id || 'None'}</span>
        </div>
        <div class="dom-info-card full-width">
            <span class="dom-info-label">Classes</span>
            <span class="dom-info-value" style="word-break: break-all;">.${classesText}</span>
        </div>
        <div class="dom-info-card full-width">
            <span class="dom-info-label">Parent</span>
            <span class="dom-info-value">${data.dom.parentTag || 'None'}</span>
        </div>
    `;
}

// Copy Utilities
function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
        setTimeout(() => { btn.innerHTML = originalText; }, 2000);
    });
}

copyCssBtn.addEventListener('click', () => {
    if (!currentData) return;
    const cssString = Object.entries(currentData.css)
        .map(([prop, val]) => `  ${prop}: ${val};`)
        .join('\n');
    copyToClipboard(`{\n${cssString}\n}`, copyCssBtn);
});

copyTailwindBtn.addEventListener('click', () => {
    if (!currentData) return;
    copyToClipboard(currentData.tailwind.join(' '), copyTailwindBtn);
});

// Export Utilities
function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

exportJsonBtn.addEventListener('click', () => {
    if (!currentData) return;
    downloadFile(JSON.stringify(currentData, null, 2), 'css-inspection.json', 'application/json');
});

exportTxtBtn.addEventListener('click', () => {
    if (!currentData) return;
    let txt = `--- CSS Inspector Pro ---\n\n`;
    txt += `[ DOM Information ]\nTag: ${currentData.dom.tag}\nID: ${currentData.dom.id}\nClasses: ${currentData.dom.classes.join(' ')}\n\n`;
    txt += `[ CSS Properties ]\n`;
    Object.entries(currentData.css).forEach(([k, v]) => txt += `${k}: ${v};\n`);
    txt += `\n[ Tailwind Classes ]\n${currentData.tailwind.join(' ')}\n`;
    txt += `\n[ Accessibility ]\nScore: ${currentData.a11y.score}\nIssues: ${currentData.a11y.issues.join(', ') || 'None'}\n`;
    
    downloadFile(txt, 'css-inspection.txt', 'text/plain');
});

exportMdBtn.addEventListener('click', () => {
    if (!currentData) return;
    let md = `# CSS Inspector Pro Report\n\n`;
    md += `## DOM Element\n- **Tag:** \`${currentData.dom.tag}\`\n- **ID:** \`${currentData.dom.id || 'None'}\`\n- **Classes:** \`${currentData.dom.classes.join(' ') || 'None'}\`\n\n`;
    md += `## CSS Properties\n\`\`\`css\n{\n`;
    Object.entries(currentData.css).forEach(([k, v]) => md += `  ${k}: ${v};\n`);
    md += `}\n\`\`\`\n\n## Tailwind Classes\n\`\`\`text\n${currentData.tailwind.join(' ')}\n\`\`\`\n`;
    md += `\n## Accessibility\n- **Score:** ${currentData.a11y.score}/100\n`;
    if (currentData.a11y.issues.length === 0) {
        md += `- ✅ No issues found.\n`;
    } else {
        currentData.a11y.issues.forEach(issue => md += `- ❌ ${issue}\n`);
    }
    
    downloadFile(md, 'css-inspection.md', 'text/markdown');
});

// Clear Data Logic
clearDataBtn.addEventListener('click', () => {
    chrome.storage.local.remove('inspectionData', () => {
        currentData = null;
        resultsPanel.classList.add('hidden');
        
        // Update button briefly to show success
        const originalText = clearDataBtn.innerHTML;
        clearDataBtn.innerHTML = 'Cleared!';
        setTimeout(() => { clearDataBtn.innerHTML = originalText; }, 1500);
    });
});
