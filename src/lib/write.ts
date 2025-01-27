import JSZip from "jszip";

export async function saveFile(htmlContent: string) {
    try {
        const zip = new JSZip();
        const output = zip.folder('output');

        const outDocCssStyles = [...document.styleSheets].filter(x => {
            return ((x.ownerNode as any).attributes.getNamedItem('data-vite-dev-id')?.value as string | null)?.endsWith('outdoc.css')
        }).pop()
        if (!outDocCssStyles) return;

        let styles = "";

        try {
            styles = Array.from(outDocCssStyles.cssRules)
                .map(rule => rule.cssText)
                .join('\n');
        } catch {
            styles = '';
        }
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
