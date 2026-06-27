# CSS Inspector Pro

 A professional Chrome Extension for inspecting, analyzing, and extracting CSS, Tailwind classes, and accessibility data from any webpage element 





---

## Overview

CSS Inspector Pro brings a DevTools-grade inspection experience directly into a sleek, floating panel — no tab switching, no context loss. Hover over any element, click to lock it, and instantly get computed CSS, Tailwind equivalents, accessibility audit scores, and DOM structure information, all in one place.

Whether you're reverse-engineering a design, auditing a UI for accessibility, or extracting styles to replicate in your own project, CSS Inspector Pro saves time and eliminates guesswork.

---

## Features

### Inspect Mode
Hover over any element to see a live box model overlay displaying Margin, Padding, Border, and Content regions — identical to the Chrome DevTools layout view.

### CSS Inspector
Extracts and groups computed CSS properties across six categories: **Typography**, **Colors**, **Layout**, **Box Model**, **Flexbox**, and **Grid**. A built-in search bar lets you instantly filter to the property you need.

### Tailwind Suggestions
Automatically converts computed CSS values into the closest matching Tailwind CSS utility classes. Copy the entire class list with one click.

### Color Converter
Displays live previews of any color found on the element and converts between **HEX**, **RGB**, and **HSL** formats instantly.

### Accessibility Checker
Audits the selected element and its subtree for:
- Missing `alt` attributes on images
- Missing `aria-label` or `aria-labelledby` on interactive elements
- Contrast ratio heuristics
- Semantic structure validation

Generates a score out of 100 with a breakdown of issues found.

### DOM Inspector
Displays the element's tag name, `id`, `class` list, parent node, and child element count — useful for understanding context within the DOM tree.

### Export & Copy
Export your full inspection results as **JSON**, **TXT**, or **Markdown**. One-click copy is available for both raw CSS blocks and Tailwind class strings.

---

## Installation

> Requires Google Chrome (or any Chromium-based browser supporting Manifest V3).

1. Clone or download this repository:
   ```bash
   git clone https://github.com/anujkush2431393/css-inspector-pro.git
   ```
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle in the top-right corner.
4. Click **Load unpacked** and select the `css-inspector-pro/` directory.
5. Pin the extension to your toolbar for quick access.

---

## Usage

1. Click the **CSS Inspector Pro** icon in your Chrome toolbar to open the panel.
2. Click **Start Inspecting** to activate hover mode.
3. Move your cursor over any element on the page — the overlay highlights the box model in real time.
4. **Click** an element to lock the inspection and load its data into the panel.
5. Browse the four tabs:

| Tab | Contents |
|-----|----------|
| **CSS** | Grouped computed styles with search and copy |
| **Tailwind** | Generated utility classes with one-click copy |
| **A11y** | Accessibility score and detailed issue list |
| **DOM** | Tag, ID, classes, parent, and child count |

6. Use the **Export** buttons at the bottom to save your findings as JSON, TXT, or Markdown.

---

## Project Structure

```
css-inspector-pro/
├── manifest.json
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── content/
│   ├── content.js
│   ├── overlay.js
│   └── overlay.css
├── background/
│   └── background.js
├── utils/
│   ├── cssExtractor.js
│   ├── colorConverter.js
│   ├── domUtils.js
│   ├── tailwindGenerator.js
│   ├── accessibilityChecker.js
│   └── exportUtils.js
├── assets/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```


