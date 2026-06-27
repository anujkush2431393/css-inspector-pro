// utils/colorConverter.js

(function() {
    window.CSSInspector = window.CSSInspector || {};

    class ColorConverter {
        constructor() {}

        // getComputedStyle almost always returns rgb() or rgba()
        parseRgb(rgbStr) {
            const result = rgbStr.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/);
            if (!result) return null;
            return {
                r: parseInt(result[1], 10),
                g: parseInt(result[2], 10),
                b: parseInt(result[3], 10),
                a: result[4] !== undefined ? parseFloat(result[4]) : 1
            };
        }

        rgbToHex(r, g, b, a = 1) {
            const toHex = (n) => {
                const hex = Math.round(n).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            };
            
            let hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
            if (a < 1) {
                hex += toHex(a * 255);
            }
            return hex.toUpperCase();
        }

        rgbToHsl(r, g, b, a = 1) {
            r /= 255;
            g /= 255;
            b /= 255;
            
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0; // achromatic
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                
                h /= 6;
            }

            h = Math.round(h * 360);
            s = Math.round(s * 100);
            l = Math.round(l * 100);

            if (a < 1) {
                return `hsla(${h}, ${s}%, ${l}%, ${a})`;
            }
            return `hsl(${h}, ${s}%, ${l}%)`;
        }

        convertAll(rgbStr) {
            const parsed = this.parseRgb(rgbStr);
            if (!parsed) return { rgb: rgbStr, hex: rgbStr, hsl: rgbStr };

            return {
                rgb: rgbStr,
                hex: this.rgbToHex(parsed.r, parsed.g, parsed.b, parsed.a),
                hsl: this.rgbToHsl(parsed.r, parsed.g, parsed.b, parsed.a)
            };
        }
    }

    window.CSSInspector.Color = new ColorConverter();
})();
