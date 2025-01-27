import JSZip from "jszip";

export async function saveFile(htmlContent: string) {
    try {
        const zip = new JSZip();
        const output = zip.folder('output');

        const styles = Array.from(document.styleSheets)
            .map(sheet => {
                try {
                    return Array.from(sheet.cssRules)
                        .map(rule => rule.cssText)
                        .join('\n');
                } catch {
                    return '';
                }
            })
            .join('\n\n');

        output?.file('index.html', htmlContent)
        output?.file('index.css', styles)

        const blob = await zip.generateAsync({ type: 'blob' })
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.zip';
        a.click();

        URL.revokeObjectURL(url);
    } catch (err) {
        console.error('Zip creation failed:', err);
        alert('Failed to create download');
    }
}
