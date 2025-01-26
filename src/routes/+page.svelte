<script lang="ts">
    import * as hypermd from "hypermd";
    import { onMount } from "svelte";
    import { md } from "./constants";
    import { transform } from "./transformer";
    let myTextarea = $state<HTMLTextAreaElement | null>(null);
    let outputArea = $state<HTMLElement | null>(null);
    let editor = $state<CodeMirror.Editor | null>(null);

    onMount(() => {
        if (myTextarea) {
            editor = hypermd.fromTextArea(myTextarea, {
                lineNumbers: false,
                foldGutter: false,
                autofocus: true,
            } satisfies CodeMirror.EditorConfiguration);
        }
    });

    async function handleMdToHtml() {
        if (editor) {
            if (outputArea) {
                const res = await transform(editor.getValue());
                outputArea.innerHTML = res.toString();
            }
        }
    }
    function focusEditor() {
        if (editor) {
            editor.focus();
        }
    }
</script>

<div class="flex flex-col h-screen w-screen">
    <div class="flex h-[95vh]">
        <div
            class="w-1/2 h-full cursor-text pl-4 py-2"
            onclick={focusEditor}
            onkeydown={focusEditor}
            role="button"
            tabindex="0"
        >
            <textarea
                id="input-area"
                rows="10"
                cols="50"
                bind:this={myTextarea}
                autofocus
                value={md}
            ></textarea>
        </div>
        <div
            id="output-area"
            class="prose border-l border-l-gray-200 min-w-[50%] w-1/2 h-full px-4 py-2 overflow-y-auto"
            bind:this={outputArea}
        ></div>
    </div>
    <div class="flex h-[5vh] border-t border-t-gray-200 items-center px-4">
        <button onclick={handleMdToHtml}>Transform</button>
    </div>
</div>

<style lang="postcss">
    :global(.CodeMirror) {
        @apply h-full;
    }
    :global(.CodeMirror-gutters) {
        @apply hidden;
    }
    :global(.HyperMD-header) {
        @apply after:content-[""] after:hidden !important;
    }
</style>
