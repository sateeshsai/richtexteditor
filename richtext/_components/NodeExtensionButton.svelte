<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import type { Editor } from "@tiptap/core";
  import type { MarkExtensionDetails, NodeExtensionDetails } from "../richtext-extensions";
  import type { Level } from "@tiptap/extension-heading";
  import { randomIdString } from "$lib/functions/utils/string";
  export let extensionDetail: NodeExtensionDetails;
  export let editor: Editor;
  export let idx: number;
  let level = (idx + 1) as Level;
  export let icon: any;
</script>

<Button
  size="icon"
  on:click={() => {
    if (extensionDetail.name === "image") {
    } else {
      extensionDetail.toggle ? extensionDetail.toggle({ level: level || 0, id: randomIdString() }) : extensionDetail.set && extensionDetail.set({ level: level, id: randomIdString() });
    }
  }}
  value={extensionDetail.name + (extensionDetail.name === "heading" ? level : "")}
  aria-label={extensionDetail.name}
  class="h-5 w-5 rounded-sm p-1   {(extensionDetail.name === 'heading' ? editor.isActive(extensionDetail.name, { level: level }) : editor.isActive(extensionDetail.name)) ? 'active' : ''}"
>
  <!-- disabled={extensionDetail.can ? (extensionDetail.name === "heading" ? !extensionDetail.can({ level: idx + 1 }) : !extensionDetail.can()) : true} -->

  <svelte:component this={icon} size="16" />
</Button>
