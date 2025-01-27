<script lang="ts">
    import { onMount } from "svelte";
    import type { PageProps } from "./$types";
    import { browser } from "$app/environment";
    import { saveFile, processArticle, processArticleBefSave } from "$lib";
    import "../outdoc.css";

    let { data }: PageProps = $props();
    let myTextarea = $state<HTMLTextAreaElement | null>(null);
    let outputArea = $state<HTMLElement | null>(null);
    let editor = $state<CodeMirror.Editor | null>(null);
    let md = $state<string | null>(data?.md ?? null);
    let saveEnabled = $state(false);

    onMount(async () => {
        const hypermd = await import("hypermd");

        if (myTextarea && hypermd) {
            editor = hypermd.fromTextArea(myTextarea, {
                lineNumbers: false,
                foldGutter: false,
                autofocus: true,
            } satisfies CodeMirror.EditorConfiguration);

            handleMdToHtml();
        }
        if (editor && outputArea) {
            saveEnabled = true;
        }
    });

    async function handleMdToHtml() {
        if (editor && outputArea) {
            const res = await processArticle(editor.getValue());
            const html = res.toString().trim();
            outputArea.innerHTML = html;

            return html;
        }
    }
    async function handleSaveFile() {
        if (editor && outputArea) {
            const res = await processArticleBefSave(editor.getValue());
            const html = res.toString().trim();
            if (html) {
                saveFile(html);
            } else {
                alert("Error saving file");
            }
        }
        await handleMdToHtml();
    }
    function focusEditor() {
        if (editor) {
            editor.focus();
        }
    }
</script>

{#snippet button(handle: () => void, text: string)}
    <button
        class="h-full border-r border-r-gray-200 px-4 hover:bg-gray-200 hover:text-gray-800"
        onclick={handle}>{text}</button
    >
{/snippet}

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
                class={!browser ? "opacity-0" : ""}
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
            class="prose border-l border-l-gray-200 min-w-[50%] w-1/2 h-full px-4 pl-7 py-2 overflow-y-auto"
            bind:this={outputArea}
        ></div>
    </div>
    <div
        class="flex flex-row h-[5vh] border-t border-t-gray-200 items-center px-4"
    >
        <div class="w-1/2 h-full"></div>
        <div class="w-1/2 border-l border-l-gray-200 flex flex-row h-full">
            {@render button(handleMdToHtml, "Transform")}
            {@render button(handleSaveFile, "Save")}
        </div>
    </div>
</div>

<style lang="postcss">
    :global(.CodeMirror) {
        @apply h-full !important;
    }
    :global(.CodeMirror-gutters) {
        @apply hidden;
    }
    :global(.HyperMD-header) {
        @apply after:content-[""] after:hidden !important;
    }
</style>
