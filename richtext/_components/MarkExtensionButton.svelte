<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import type { Editor } from "@tiptap/core";
  import type { MarkExtensionDetails } from "../richtext-extensions";
  import type { Level } from "@tiptap/extension-heading";
  export let extensionDetail: MarkExtensionDetails;
  export let editor: Editor;
  export let idx: number;
  let level = (idx + 1) as Level;
  export let icon: any;
</script>

<Button
  size="icon"
  variant="outline"
  on:click={() => {
    if (extensionDetail.name === "link") {
    } else {
      extensionDetail.toggle ? extensionDetail.toggle() : extensionDetail.set && extensionDetail.set();
    }
  }}
  value={extensionDetail.name}
  aria-label={extensionDetail.name}
  class="h-6 w-6 rounded-none p-1 border-none  shadow-none outline-none bg-white  {editor.isActive(extensionDetail.name) ? 'active' : ''}"
>
  <!-- disabled={extensionDetail.can ? (extensionDetail.name === "heading" ? !extensionDetail.can({ level: idx + 1 }) : !extensionDetail.can()) : true} -->

  <svelte:component this={icon} size="16" />
</Button>
