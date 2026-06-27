// utils/accessibilityChecker.js

(function() {
    window.CSSInspector = window.CSSInspector || {};

    class AccessibilityChecker {
        check(element) {
            let score = 100;
            const issues = [];
            
            if (!element) return { score: 0, issues: ["No element selected"] };

            const tag = element.tagName.toLowerCase();

            // 1. Missing alt attribute on images
            if (tag === 'img') {
                if (!element.hasAttribute('alt')) {
                    score -= 20;
                    issues.push("Missing 'alt' attribute on <img> tag.");
                } else if (element.getAttribute('alt').trim() === "") {
                    // Empty alt is valid for decorative images, but maybe a warning
                    issues.push("Empty 'alt' attribute. Ensure image is decorative.");
                }
            }

            // 2. Missing aria-label on buttons without text content
            if (tag === 'button') {
                const text = element.textContent.trim();
                const ariaLabel = element.getAttribute('aria-label');
                if (!text && !ariaLabel) {
                    score -= 20;
                    issues.push("Button has no text content and missing 'aria-label'.");
                }
            }

            // 3. Missing labels for inputs
            if (tag === 'input' || tag === 'textarea' || tag === 'select') {
                const type = element.getAttribute('type');
                if (type !== 'hidden' && type !== 'submit' && type !== 'button') {
                    const id = element.getAttribute('id');
                    let hasLabel = false;
                    
                    if (id) {
                        const label = document.querySelector(`label[for="${id}"]`);
                        if (label) hasLabel = true;
                    }
                    
                    if (!hasLabel && !element.closest('label') && !element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
                        score -= 20;
                        issues.push("Form input is missing an associated label or aria-label.");
                    }
                }
            }
            
            // 4. Missing href on links
            if (tag === 'a') {
                if (!element.hasAttribute('href')) {
                    score -= 10;
                    issues.push("Link <a> tag is missing 'href' attribute.");
                }
                const text = element.textContent.trim();
                const ariaLabel = element.getAttribute('aria-label');
                if (!text && !ariaLabel) {
                    score -= 15;
                    issues.push("Link has no text content and missing 'aria-label'.");
                }
            }

            // 5. Basic contrast check heuristic (very simplified)
            const styles = window.getComputedStyle(element);
            const bgColor = styles.backgroundColor;
            const color = styles.color;
            
            // We'd ideally parse and calculate relative luminance here.
            // For a robust implementation, it requires math. 
            // Here is a very basic placeholder for contrast issues.
            if (bgColor === color && bgColor !== 'rgba(0, 0, 0, 0)') {
                score -= 30;
                issues.push("Text color and background color are identical (Zero contrast).");
            }
            
            // 6. Font size too small
            const fontSize = parseFloat(styles.fontSize);
            if (fontSize < 12) {
                score -= 10;
                issues.push("Font size is less than 12px, which may be hard to read.");
            }

            // Ensure score doesn't go below 0
            score = Math.max(0, score);

            return {
                score,
                issues
            };
        }
    }

    window.CSSInspector.A11y = new AccessibilityChecker();
})();
