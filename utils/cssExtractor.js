// utils/cssExtractor.js

(function() {
    window.CSSInspector = window.CSSInspector || {};

    class CSSExtractor {
        constructor() {
            // Define categories of properties to extract
            this.propertiesToExtract = [
                // Typography
                'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-align',
                
                // Colors
                'color', 'background-color', 'border-color',
                
                // Layout
                'display', 'position', 'width', 'height', 'z-index',
                
                // Box Model
                'margin', 'padding', 'border', 'border-radius',
                
                // Flex & Grid
                'justify-content', 'align-items', 'flex-direction', 'gap',
                'grid-template-columns', 'grid-template-rows'
            ];
        }

        extract(element) {
            const styles = window.getComputedStyle(element);
            const result = {};

            this.propertiesToExtract.forEach(prop => {
                let value = styles.getPropertyValue(prop);

                // Browsers often expand shorthands like margin/padding/border, 
                // making getPropertyValue('margin') return empty string.
                // We construct them manually if they are empty.
                if (!value) {
                    value = this.constructShorthand(styles, prop);
                }

                if (this.shouldKeepProperty(prop, value, styles)) {
                    result[prop] = value;
                }
            });

            return result;
        }

        constructShorthand(styles, prop) {
            if (prop === 'margin' || prop === 'padding') {
                const t = styles.getPropertyValue(`${prop}-top`);
                const r = styles.getPropertyValue(`${prop}-right`);
                const b = styles.getPropertyValue(`${prop}-bottom`);
                const l = styles.getPropertyValue(`${prop}-left`);
                
                if (t === b && r === l && t === r) return t;
                if (t === b && r === l) return `${t} ${r}`;
                return `${t} ${r} ${b} ${l}`;
            }

            if (prop === 'border') {
                const width = styles.getPropertyValue('border-top-width');
                const style = styles.getPropertyValue('border-top-style');
                const color = styles.getPropertyValue('border-top-color');
                
                if (style !== 'none' && width !== '0px') {
                    return `${width} ${style} ${color}`;
                }
            }

            return '';
        }

        shouldKeepProperty(prop, value, styles) {
            // Ignore empty values
            if (!value || value === '') return false;
            
            // Ignore transparent backgrounds
            if (prop === 'background-color' && value === 'rgba(0, 0, 0, 0)') return false;
            
            // Ignore generic defaults to reduce noise
            if (value === 'none' && prop !== 'display') return false;
            if (value === 'normal' && prop !== 'line-height') return false;
            if (value === 'auto' && (prop === 'width' || prop === 'height' || prop === 'z-index')) return false;
            if (value === '0px' && (prop === 'margin' || prop === 'padding' || prop === 'border-width')) return false;

            // Filter out flex/grid properties if display type doesn't match
            const display = styles.getPropertyValue('display');
            const isFlex = display === 'flex' || display === 'inline-flex';
            const isGrid = display === 'grid' || display === 'inline-grid';

            if (['justify-content', 'align-items', 'flex-direction'].includes(prop) && !isFlex) return false;
            if (['grid-template-columns', 'grid-template-rows'].includes(prop) && !isGrid) return false;
            if (prop === 'gap' && !isFlex && !isGrid) return false;

            return true;
        }
    }

    window.CSSInspector.CSS = new CSSExtractor();
})();
