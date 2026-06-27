// utils/domUtils.js

(function() {
    window.CSSInspector = window.CSSInspector || {};

    class DOMUtils {
        extract(element) {
            if (!element) return null;

            return {
                tag: element.tagName.toLowerCase(),
                id: element.id || '',
                classes: Array.from(element.classList),
                parentTag: element.parentElement ? element.parentElement.tagName.toLowerCase() : null,
                childrenCount: element.childElementCount
            };
        }
    }

    window.CSSInspector.DOM = new DOMUtils();
})();
