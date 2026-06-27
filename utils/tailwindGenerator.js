// utils/tailwindGenerator.js

(function() {
    window.CSSInspector = window.CSSInspector || {};

    class TailwindGenerator {
        constructor() {
            // Very basic mapping for demonstration purposes.
            // A full implementation would require a massive lookup table.
            this.pxToRem = (pxStr) => {
                const px = parseFloat(pxStr);
                if (isNaN(px)) return pxStr;
                return `${px / 16}rem`;
            };

            this.spacingMap = {
                '0px': '0', '4px': '1', '8px': '2', '12px': '3', '16px': '4',
                '20px': '5', '24px': '6', '32px': '8', '40px': '10', '48px': '12',
                '64px': '16'
            };
        }

        generate(cssObj) {
            const classes = [];

            // Display
            if (cssObj['display']) {
                if (cssObj['display'] === 'flex') classes.push('flex');
                else if (cssObj['display'] === 'grid') classes.push('grid');
                else if (cssObj['display'] === 'inline-block') classes.push('inline-block');
                else if (cssObj['display'] === 'block') classes.push('block');
                else if (cssObj['display'] === 'none') classes.push('hidden');
            }

            // Flex properties
            if (cssObj['flex-direction'] === 'column') classes.push('flex-col');
            
            if (cssObj['justify-content']) {
                const jc = cssObj['justify-content'];
                if (jc === 'center') classes.push('justify-center');
                else if (jc === 'space-between') classes.push('justify-between');
                else if (jc === 'space-around') classes.push('justify-around');
                else if (jc === 'flex-end') classes.push('justify-end');
                else if (jc === 'flex-start') classes.push('justify-start');
            }

            if (cssObj['align-items']) {
                const ai = cssObj['align-items'];
                if (ai === 'center') classes.push('items-center');
                else if (ai === 'flex-start') classes.push('items-start');
                else if (ai === 'flex-end') classes.push('items-end');
                else if (ai === 'stretch') classes.push('items-stretch');
            }

            // Margin & Padding heuristics
            const getSpacingClass = (prefix, valStr) => {
                if (!valStr) return null;
                const parts = valStr.split(' ');
                if (parts.length === 1) {
                    const mapped = this.spacingMap[parts[0]];
                    if (mapped) return `${prefix}-${mapped}`;
                    return `${prefix}-[${parts[0]}]`;
                }
                return null; // Simplify for complex margins
            };

            const mClass = getSpacingClass('m', cssObj['margin']);
            if (mClass) classes.push(mClass);

            const pClass = getSpacingClass('p', cssObj['padding']);
            if (pClass) classes.push(pClass);

            // Font weight
            if (cssObj['font-weight']) {
                const fw = cssObj['font-weight'];
                if (fw === '400' || fw === 'normal') classes.push('font-normal');
                else if (fw === '500') classes.push('font-medium');
                else if (fw === '600') classes.push('font-semibold');
                else if (fw === '700' || fw === 'bold') classes.push('font-bold');
                else classes.push(`font-[${fw}]`);
            }

            // Colors (Arbitrary mapping to arbitrary values for exact matching in JIT)
            if (cssObj['color'] && window.CSSInspector.Color) {
                const parsed = window.CSSInspector.Color.convertAll(cssObj['color']);
                if (parsed.hex !== 'rgba(0, 0, 0, 0)' && parsed.hex !== '#00000000') {
                     classes.push(`text-[${parsed.hex}]`);
                }
            }

            if (cssObj['background-color'] && window.CSSInspector.Color) {
                const parsed = window.CSSInspector.Color.convertAll(cssObj['background-color']);
                if (parsed.hex !== 'rgba(0, 0, 0, 0)' && parsed.hex !== '#00000000' && cssObj['background-color'] !== 'rgba(0, 0, 0, 0)') {
                     classes.push(`bg-[${parsed.hex}]`);
                }
            }
            
            // Width / Height
            if (cssObj['width'] && cssObj['width'] !== 'auto' && cssObj['width'] !== '0px') {
                if (cssObj['width'] === '100%') classes.push('w-full');
                else classes.push(`w-[${cssObj['width']}]`);
            }
            
            if (cssObj['height'] && cssObj['height'] !== 'auto' && cssObj['height'] !== '0px') {
                if (cssObj['height'] === '100%') classes.push('h-full');
                else classes.push(`h-[${cssObj['height']}]`);
            }

            return classes.length > 0 ? classes : ['/* No direct matches */'];
        }
    }

    window.CSSInspector.Tailwind = new TailwindGenerator();
})();
