# CSS Inspector Pro

A professional, production-quality Chrome Extension to inspect, analyze, and extract CSS, Tailwind classes, and accessibility scores from any webpage element.

![CSS Inspector Pro](https://via.placeholder.com/800x400?text=CSS+Inspector+Pro+Screenshot)

## Features

- **Inspect Mode:** Hover over any element to see a DevTools-like box model overlay (Margin, Padding, Border, Content).
- **CSS Inspector:** Extracts typography, colors, layout, box model, flex, and grid properties.
- **Tailwind Suggestions:** Automatically converts computed CSS properties into approximate Tailwind CSS utility classes.
- **Color Converter:** Live previews and converts colors between HEX, RGB, and HSL formats.
- **Accessibility Checker:** Audits elements for missing `alt` tags, `aria-labels`, contrast heuristics, and basic semantic structure, generating a score out of 100.
- **DOM Inspector:** Displays the element tag, ID, classes, parent node, and child count.
- **Export Data:** Download inspection results as JSON, TXT, or Markdown.
- **Copy Utilities:** One-click copy for CSS blocks and Tailwind classes.
- **Searchable Properties:** Instantly filter CSS properties using the built-in search.
- **Glassmorphism UI:** A sleek, modern, dark-themed professional developer interface.

---

## Folder Structure

```text
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

---

## Installation

1. Clone or download this repository.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle switch in the top right corner.
4. Click on **Load unpacked** and select the `css-inspector-pro` directory.
5. Pin the extension to your toolbar for easy access.

---

## Usage

1. Click the **CSS Inspector Pro** icon in your Chrome toolbar.
2. Click **Start Inspecting**.
3. Move your mouse over elements on the current webpage to see the highlight overlay.
4. **Click** an element to lock the inspection and extract its data.
5. View the results in the popup panel across four tabs:
   - **CSS**: View and copy computed styles.
   - **Tailwind**: View and copy generated Tailwind utility classes.
   - **A11y**: Review the accessibility score and any issues found.
   - **DOM**: View structural information about the element.
6. Use the **Export** buttons at the bottom to save your findings.

---

## Permissions

The extension requires the following permissions in `manifest.json`:

- `activeTab`: Required to interact with the currently active webpage when the user clicks the extension action.
- `scripting`: Required to inject the content scripts, utility classes, and overlay CSS dynamically into the active page.
- `storage`: Reserved for future improvements (e.g., saving user preferences like theme or default export format).

---

## Future Improvements

- Full color contrast ratio calculations based on WCAG formulas.
- Deep integration with framework-specific syntax (e.g., React `className`, Vue `:class`).
- Customizable Tailwind config parsing to match project-specific design systems.
- Keyboard navigation within the DOM tree (Arrow keys to traverse parent/child elements).

---

## License

MIT License. See `LICENSE` for more information.
