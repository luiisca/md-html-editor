<script lang="ts">
    import CodeMirror from "codemirror";
    import * as hypermd from "hypermd";
    import { onMount } from "svelte";
    let myTextarea = $state<HTMLTextAreaElement | null>(null);
    let outputArea = $state<HTMLElement | null>(null);
    let editor = $state<CodeMirror.Editor | null>(null);

    onMount(() => {
        if (myTextarea) {
            editor = hypermd.fromTextArea(myTextarea);
        }
    });

    function handleMdToHtml() {
        if (editor) {
            if (outputArea) {
                outputArea.innerHTML = editor.getValue();
            }
        }
    }
</script>

<h1>Markdown Editor</h1>

<button onclick={handleMdToHtml}>Transform</button>
<textarea id="input-area" rows="10" cols="50" bind:this={myTextarea}></textarea>

<div id="output-area" bind:this={outputArea}></div>
