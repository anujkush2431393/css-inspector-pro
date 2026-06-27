// utils/exportUtils.js

(function() {
    window.CSSInspector = window.CSSInspector || {};

    class ExportUtils {
        downloadFile(content, filename, contentType) {
            const blob = new Blob([content], { type: contentType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }

        exportAsJSON(data) {
            this.downloadFile(JSON.stringify(data, null, 2), 'css-inspection.json', 'application/json');
        }

        exportAsTXT(data) {
            let txt = `--- CSS Inspector Pro ---\n\n`;
            txt += `[ DOM Information ]\nTag: ${data.dom.tag}\nID: ${data.dom.id}\nClasses: ${data.dom.classes.join(' ')}\n\n`;
            txt += `[ CSS Properties ]\n`;
            Object.entries(data.css).forEach(([k, v]) => txt += `${k}: ${v};\n`);
            txt += `\n[ Tailwind Classes ]\n${data.tailwind.join(' ')}\n`;
            txt += `\n[ Accessibility ]\nScore: ${data.a11y.score}\nIssues: ${data.a11y.issues.join(', ') || 'None'}\n`;
            
            this.downloadFile(txt, 'css-inspection.txt', 'text/plain');
        }

        exportAsMarkdown(data) {
            let md = `# CSS Inspector Pro Report\n\n`;
            md += `## DOM Element\n- **Tag:** \`${data.dom.tag}\`\n- **ID:** \`${data.dom.id || 'None'}\`\n- **Classes:** \`${data.dom.classes.join(' ') || 'None'}\`\n\n`;
            md += `## CSS Properties\n\`\`\`css\n{\n`;
            Object.entries(data.css).forEach(([k, v]) => md += `  ${k}: ${v};\n`);
            md += `}\n\`\`\`\n\n## Tailwind Classes\n\`\`\`text\n${data.tailwind.join(' ')}\n\`\`\`\n`;
            md += `\n## Accessibility\n- **Score:** ${data.a11y.score}/100\n`;
            if (data.a11y.issues.length === 0) {
                md += `- ✅ No issues found.\n`;
            } else {
                data.a11y.issues.forEach(issue => md += `- ❌ ${issue}\n`);
            }
            
            this.downloadFile(md, 'css-inspection.md', 'text/markdown');
        }
    }

    window.CSSInspector.Export = new ExportUtils();
})();
