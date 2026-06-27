// content/overlay.js

(function() {
    window.CSSInspector = window.CSSInspector || {};

    if (window.CSSInspector.Overlay) return; // Prevent duplicate initialization

    class InspectorOverlay {
        constructor() {
            this.initialized = false;
            this.container = null;
            this.boxMargin = null;
            this.boxBorder = null;
            this.boxPadding = null;
            this.boxContent = null;
            this.tooltip = null;
        }

        init() {
            if (this.initialized) return;

            // Create container
            this.container = document.createElement('div');
            this.container.id = 'css-inspector-pro-overlay-container';
            
            // Box representations
            this.boxMargin = document.createElement('div');
            this.boxMargin.className = 'css-inspector-pro-box margin-box';
            
            this.boxBorder = document.createElement('div');
            this.boxBorder.className = 'css-inspector-pro-box border-box';
            
            this.boxPadding = document.createElement('div');
            this.boxPadding.className = 'css-inspector-pro-box padding-box';
            
            this.boxContent = document.createElement('div');
            this.boxContent.className = 'css-inspector-pro-box content-box';
            
            // Tooltip for dimensions
            this.tooltip = document.createElement('div');
            this.tooltip.className = 'css-inspector-pro-tooltip';
            
            // Assemble structure
            this.boxPadding.appendChild(this.boxContent);
            this.boxBorder.appendChild(this.boxPadding);
            this.boxMargin.appendChild(this.boxBorder);
            this.container.appendChild(this.boxMargin);
            this.container.appendChild(this.tooltip);

            document.body.appendChild(this.container);
            this.initialized = true;
        }

        show() {
            if (!this.initialized) this.init();
            this.container.style.display = 'block';
        }

        hide() {
            if (this.initialized) {
                this.container.style.display = 'none';
            }
        }

        update(element) {
            if (!this.initialized || !element) return;

            const rect = element.getBoundingClientRect();
            const styles = window.getComputedStyle(element);

            // Parse box model values
            const mt = parseFloat(styles.marginTop) || 0;
            const mr = parseFloat(styles.marginRight) || 0;
            const mb = parseFloat(styles.marginBottom) || 0;
            const ml = parseFloat(styles.marginLeft) || 0;

            const bt = parseFloat(styles.borderTopWidth) || 0;
            const br = parseFloat(styles.borderRightWidth) || 0;
            const bb = parseFloat(styles.borderBottomWidth) || 0;
            const bl = parseFloat(styles.borderLeftWidth) || 0;

            const pt = parseFloat(styles.paddingTop) || 0;
            const pr = parseFloat(styles.paddingRight) || 0;
            const pb = parseFloat(styles.paddingBottom) || 0;
            const pl = parseFloat(styles.paddingLeft) || 0;

            const scrollY = window.scrollY || document.documentElement.scrollTop;
            const scrollX = window.scrollX || document.documentElement.scrollLeft;

            // Dimensions
            const contentWidth = rect.width - pl - pr - bl - br;
            const contentHeight = rect.height - pt - pb - bt - bb;

            // Update Margin Box (Outermost)
            this.boxMargin.style.top = `${rect.top + scrollY - mt}px`;
            this.boxMargin.style.left = `${rect.left + scrollX - ml}px`;
            this.boxMargin.style.width = `${rect.width + ml + mr}px`;
            this.boxMargin.style.height = `${rect.height + mt + mb}px`;
            
            this.boxMargin.style.borderTopWidth = `${mt}px`;
            this.boxMargin.style.borderRightWidth = `${mr}px`;
            this.boxMargin.style.borderBottomWidth = `${mb}px`;
            this.boxMargin.style.borderLeftWidth = `${ml}px`;

            // Update Border Box
            this.boxBorder.style.width = `${rect.width}px`;
            this.boxBorder.style.height = `${rect.height}px`;
            
            this.boxBorder.style.borderTopWidth = `${bt}px`;
            this.boxBorder.style.borderRightWidth = `${br}px`;
            this.boxBorder.style.borderBottomWidth = `${bb}px`;
            this.boxBorder.style.borderLeftWidth = `${bl}px`;

            // Update Padding Box
            this.boxPadding.style.width = `${rect.width - bl - br}px`;
            this.boxPadding.style.height = `${rect.height - bt - bb}px`;
            
            this.boxPadding.style.borderTopWidth = `${pt}px`;
            this.boxPadding.style.borderRightWidth = `${pr}px`;
            this.boxPadding.style.borderBottomWidth = `${pb}px`;
            this.boxPadding.style.borderLeftWidth = `${pl}px`;

            // Update Content Box
            this.boxContent.style.width = `${contentWidth > 0 ? contentWidth : 0}px`;
            this.boxContent.style.height = `${contentHeight > 0 ? contentHeight : 0}px`;

            // Update Tooltip
            const tag = element.tagName.toLowerCase();
            const id = element.id ? `#${element.id}` : '';
            const cls = element.className && typeof element.className === 'string' 
                ? `.${element.className.split(' ').join('.')}` 
                : '';
            
            // Limit class string length
            const displayCls = cls.length > 30 ? cls.substring(0, 30) + '...' : cls;
            
            const w = Math.round(rect.width * 10) / 10;
            const h = Math.round(rect.height * 10) / 10;
            
            this.tooltip.innerHTML = `
                <span class="css-inspector-pro-tag">${tag}${id}${displayCls}</span>
                <span class="css-inspector-pro-dim">${w} × ${h}</span>
            `;

            // Position Tooltip
            let tooltipTop = rect.top + scrollY - mt - 30;
            if (tooltipTop < scrollY) {
                // If it goes above the viewport, put it below the element
                tooltipTop = rect.bottom + scrollY + mb + 5;
            }
            
            this.tooltip.style.top = `${tooltipTop}px`;
            this.tooltip.style.left = `${rect.left + scrollX - ml}px`;
        }
    }

    window.CSSInspector.Overlay = new InspectorOverlay();
})();
