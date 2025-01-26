export async function saveFile(text: string) {
    const handler = await window.showSaveFilePicker({
        suggestedName: "output.html",
    });
    const writableStream = await handler.createWritable()
    await writableStream.write(new TextEncoder().encode(text))
    await writableStream.close()
}
