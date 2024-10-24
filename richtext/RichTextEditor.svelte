<script lang="ts">
  //SVELTE
  import { onMount, onDestroy } from "svelte";

  //UI
  import * as Dialog from "$lib/components/ui/dialog";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  //TIPTAP
  import { Editor } from "@tiptap/core";
  import Focus from "@tiptap/extension-focus";
  import FloatingMenu from "@tiptap/extension-floating-menu";
  import Gapcursor from "@tiptap/extension-gapcursor";
  import History from "@tiptap/extension-history";
  import BubbleMenu from "@tiptap/extension-bubble-menu";

  //FUNCTIONS
  import { createNewFormStateObj } from "../form/form_utils";
  import { cn } from "$lib/utils";
  import { randomIdString } from "$lib/functions/utils/string";

  // API
  import { readAnduploadFile } from "$api/sharepoint/api/readAndUploadFile";

  //ICONS
  import Asterisk from "lucide-svelte/icons/asterisk";
  import ImageUp from "lucide-svelte/icons/image-up";
  import LoaderCircle from "lucide-svelte/icons/loader-circle";
  import Upload from "lucide-svelte/icons/upload";

  //APP
  import { getMarkExtensions, getNodeExtensions, type MarkExtensionDetails, type NodeExtensionDetails, type NodeExtensionOptions } from "./richtext-extensions";
  import NodeExtensionButton from "./_components/NodeExtensionButton.svelte";
  import MarkExtensionButton from "./_components/MarkExtensionButton.svelte";
  import FileUpload from "../fileupload/FileUpload.svelte";

  //TYPES
  import type { FileToUpload } from "$types/file_types";
  import type { FetchError_SP, UploadFileResponse } from "$api/sharepoint/types";

  import FormStateModal from "../form/FormStateModal.svelte";

  let element: HTMLElement;
  let editor: Editor;
  export let content: string = `<h1  class="text-xl lg:text-2xl xl:text-3xl font-black mb-4 text-dgreen-500">Section looks like this</h1><h2 class="text-xl lg:text-2xl xl:text-3xl font-black mb-4 text-dgreen-500">Chapter <span data-tags="red">name</span></h2><h3 class="text-xl lg:text-2xl xl:text-3xl font-black mb-4 text-dgreen-500">Sub chapter here</h3><h4 class="text-xl lg:text-2xl xl:text-3xl font-black mb-4 text-dgreen-500">Subheading level 1</h4><h5 class="text-xl lg:text-2xl xl:text-3xl font-black mb-4 text-dgreen-500">Subhead level 2</h5><h6 class="text-xl lg:text-2xl xl:text-3xl font-black mb-4 text-dgreen-500">Subhead level 3</h6><blockquote class="pl-2 border-l-2 border-l-dgreen-500"><p id="">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id nibh tempus, malesuada tellus quis, ultrices magna. Maecenas bibendum mollis placerat. Etiam eu ipsum at ipsum rutrum placerat sed ac neque. Nullam vel velit sit amet nulla porttitor condimentum eu non massa. </p></blockquote><p id="">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id nibh tempus, malesuada tellus quis, ultrices magna. Maecenas bibendum mollis placerat. Etiam eu ipsum at ipsum rutrum placerat sed ac neque. Nullam vel velit sit amet nulla porttitor </p><img src="https://images.unsplash.com/photo-1719937206098-236a481a2b6d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8" alt="id324cf2f8cbf68---With-Vineet.jpg" title="id324cf2f8cbf68---With-Vineet.jpg"><hr><p id="">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id nibh tempus, malesuada tellus quis, ultrices magna. Maecenas bibendum mollis placerat. </p><p id="">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id nibh tempus, malesuada tellus quis, ultrices magna. Maecenas bibendum mollis placerat. </p><ul class=""><li><p id="">Etiam eu ipsum at ipsum rutrum placerat sed ac neque. </p></li><li><p id="">Nullam vel velit sit amet nulla porttitor condimentum eu non massa. Nullam a velit fringilla, iaculis leo nec, lobortis libero. Cras a arcu mattis est consectetur facilisis eget nec justo. </p></li></ul><p id="">Sed lacinia diam nisi, ac lobortis ipsum pretium sit amet. Curabitur mollis odio sed sem luctus, et suscipit lorem gravida.</p><ol><li><p id="">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id nibh tempus, malesuada tellus quis, ultrices magna. Maecenas bibendum mollis placerat. </p></li><li><p id="">Etiam eu ipsum at ipsum rutrum placerat sed ac neque. </p></li></ol><table style="min-width: 50px"><colgroup><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p id="">Table header</p></th><th colspan="1" rowspan="1"><p id="">Table header</p></th></tr><tr><td colspan="1" rowspan="1"><p id="">Table cell</p></td><td colspan="1" rowspan="1"><p id="">Table cell</p></td></tr></tbody></table>`;
  let className: string = "";
  export { className as class };
  let nodeExtensionDetails: NodeExtensionDetails[] = [];
  let markExtensionDetails: MarkExtensionDetails[] = [];
  onMount(() => {
    let nodeExtentionsAndOptions = getNodeExtensions(editor, {
      document: { showIcon: false },
      text: { showIcon: false },
      paragraph: {
        showIcon: true,
        HTMLAttributes: { id: "" },
      },
      bulletList: {
        showIcon: true,

        // HTMLAttributes: { class: "" },
      },
      // heading: {
      //   levels: [1, 2, 3, 4, 5, 6],
      //   showIcon: true,
      //   HTMLAttributes: {
      //     class: "",
      //     id: "",
      //   },
      // },

      orderedList: {
        showIcon: true,
      },
      listItem: {
        showIcon: false,
      },

      table: {
        showIcon: true,
        resizable: true,
        lastColumnResizable: false,
      },
      tableCell: {},
      tableHeader: {},
      tableRow: {},
      taskItem: {},
      taskList: {},
    });

    let markExtentionsAndOptions = getMarkExtensions(editor, {
      bold: {
        showIcon: true,
        HTMLAttributes: {},
      },
      italic: {
        showIcon: true,
        HTMLAttributes: {},
      },
      underline: {
        showIcon: true,
        HTMLAttributes: {},
      },
      color: {
        showIcon: false,
      },
      highlight: {
        showIcon: true,
        HTMLAttributes: {},
      },
      link: {
        showIcon: true,
        HTMLAttributes: {
          id: randomIdString(),
          target: "_blank",
          "data-footnotecontent": "",
          class: "defaultLinkClass",
          href: "#defaultHREF",
        },
      },
      strike: {
        showIcon: true,
        HTMLAttributes: {},
      },
      subscript: {
        showIcon: true,
        HTMLAttributes: {},
      },
      superscript: {
        showIcon: true,
        HTMLAttributes: {},
      },

      textStyle: {
        showIcon: false,
        HTMLAttributes: {
          "data-tags": "",
        },
      },
      code: {
        showIcon: false,
        HTMLAttributes: {},
      },
    });

    editor = new Editor({
      element: element,
      extensions: [
        ...nodeExtentionsAndOptions.extensionDetails.map((extn) => extn.extension),
        ...markExtentionsAndOptions.extensionDetails.map((extn) => extn.extension),
        BubbleMenu.configure({
          element: bubbleMenuElement,
        }),
        FloatingMenu.configure({
          element: floatingMenuElement,
        }),
        Focus.configure({
          className: "has-focus",
          mode: "all",
        }),
        Gapcursor,
        History,
      ],
      content: content,
      onTransaction: () => {
        // force re-render so `editor.isActive` works as expected
        editor = editor;
        content = editor.getHTML();
      },
    });

    nodeExtensionDetails = getNodeExtensions(editor, nodeExtentionsAndOptions.options).extensionDetails;
    markExtensionDetails = getMarkExtensions(editor, markExtentionsAndOptions.options).extensionDetails;
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });

  let bubbleMenuElement: HTMLElement;
  let floatingMenuElement: HTMLElement;

  let isTable: boolean;
  let isListItem: boolean;

  function handleContextMenu(e: CustomEvent<MouseEvent> | MouseEvent) {
    let element = e.target as HTMLElement;
    isTable = !!element?.closest("table");
    isListItem = !!element?.closest("li");
    console.log(isTable, isListItem);
  }

  $: tableOptions = nodeExtensionDetails.find((extn) => extn.name === "table")?.subCommands || {};
  $: listItemOptions = nodeExtensionDetails.find((extn) => extn.name === "listItem")?.subCommands || {};

  let contextMenuOpen: boolean;

  let imagesAdded = [];

  let filesUploaded: string[] = [];

  const uploadImageFormStates = createNewFormStateObj();

  let fileUploadModalOpen: boolean;

  export let sharepointAssetFolderName: string;
  export let sharepointSiteUrl: string;
  export let sharepointServerRelativeUrl: string;
  export let sharepointDomainUrl: string;

  async function addFileToDocument(e: CustomEvent, extensionDetail: NodeExtensionDetails) {
    //TODO: MAKE THIS ROBUST
    uploadImageFormStates.initial = false;
    uploadImageFormStates.inprogress = true;

    const filesToUpload = e.detail;
    const uploadPromises: Promise<UploadFileResponse | FetchError_SP>[] = [];

    filesToUpload.forEach((fileToUpload: FileToUpload) => {
      uploadPromises.push(readAnduploadFile(sharepointServerRelativeUrl, sharepointSiteUrl, sharepointAssetFolderName, fileToUpload.name, fileToUpload.file));
    });

    const uploadFileResponses = await Promise.allSettled(uploadPromises);
    const uploadErrors: FetchError_SP[] = [];

    uploadFileResponses.forEach((p) => {
      if (p.status === "rejected") {
        uploadErrors.push(p.reason as FetchError_SP);
      }
    });

    const uploadsFailed = uploadErrors.length;
    if (uploadsFailed) {
      //HANDLE ERROR
      uploadImageFormStates.error = uploadErrors.map((err) => err.error.message.value).join(" \n");
    } else {
      console.log("UPLOADED");
      uploadFileResponses.forEach((uploadFileResponse) => {
        if (uploadFileResponse.status === "fulfilled" && "d" in uploadFileResponse.value) {
          let imageParams = {
            src: sharepointDomainUrl + uploadFileResponse.value.d?.ServerRelativeUrl,
            title: uploadFileResponse.value?.d?.Name,
            alt: uploadFileResponse.value.d?.Name,
          };
          extensionDetail.set && extensionDetail.set(imageParams);
        }
      });
      fileUploadModalOpen = false;
      uploadImageFormStates.inprogress = false;
      uploadImageFormStates.initial = true;
      filesUploaded = [];
      imagesAdded = [];
    }
  }

  let linkText: string;

  let linkModalOpen: boolean;
  let editorHTML: string;
  // $: console.log(content);

  let footnoteModalOpen: boolean;
  let footnoteText: string;

  let currentMarkActiveTagIds: number[] = [];
  $: if (editor) {
    currentMarkActiveTagIds =
      editor.getAttributes("textStyle") &&
      editor
        .getAttributes("textStyle")
        ["data-tags"]?.split("")
        ?.map((id: string) => +id);

    // console.log(tagGradient);
  }

  function addTag(tagId: number) {
    if (!currentMarkActiveTagIds) currentMarkActiveTagIds = [];
    let joinedTags = "";
    if (currentMarkActiveTagIds.includes(tagId)) {
      joinedTags = currentMarkActiveTagIds
        .filter((id) => id !== tagId)
        .map((id) => String(id))
        .join("");
    } else {
      joinedTags = [...currentMarkActiveTagIds, tagId].map((id) => String(id)).join("");
    }
    editor.chain().focus().setTags(joinedTags).run();
  }

  // $: console.log(content);
</script>

<div class="editorContainer relative size-full">
  <div class="bubbleMenu shadow-lg rounded flex gap-[1px] h-6" bind:this={bubbleMenuElement}>
    <!-- bind:this={bubbleMenuElement} -->
    <!-- <button on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} class:active={editor.isActive("heading", { level: 1 })}> H1 </button> -->
    <!-- <button on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} class:active={editor.isActive("heading", { level: 2 })}> H2 </button> -->
    <!-- <button on:click={() => editor.chain().focus().setParagraph().run()} class:active={editor.isActive("paragraph")}> P </button> -->
    {#each markExtensionDetails as extensionDetail}
      {@const randomId = randomIdString()}
      {#if extensionDetail.showIcon && extensionDetail.icons?.length}
        {#each extensionDetail.icons as icon, idx}
          {#if extensionDetail.name === "link"}
            <Dialog.Root bind:open={linkModalOpen}>
              <Dialog.Trigger>
                <Button size="icon" variant="outline" class="h-6 w-6 rounded-sm p-1 border-none shadow-none outline-none bg-white">
                  <svelte:component this={icon} size="16" />
                </Button>
              </Dialog.Trigger>
              <Dialog.Content class="z-[10000]">
                <Dialog.Header>
                  <Dialog.Title>Add link</Dialog.Title>
                </Dialog.Header>

                <Textarea bind:value={linkText} />
                <Button
                  on:click={() => {
                    extensionDetail?.set && extensionDetail.set({ href: linkText, target: "_blank" });
                    linkText = "";
                    linkModalOpen = false;
                  }}>Add link</Button
                >
              </Dialog.Content>
            </Dialog.Root>

            <Dialog.Root bind:open={footnoteModalOpen}>
              <Dialog.Trigger>
                <Button size="icon" variant="outline" class="h-6 w-6 rounded-sm p-1 border-none shadow-none outline-none bg-white">
                  <svelte:component this={Asterisk} size="16" />
                </Button>
              </Dialog.Trigger>
              <Dialog.Content class="z-[10000]">
                <Dialog.Header>
                  <Dialog.Title>Add footnote</Dialog.Title>
                </Dialog.Header>

                <Textarea bind:value={footnoteText} />
                <Button
                  on:click={() => {
                    extensionDetail?.set && extensionDetail.set({ id: randomId, class: "footnote", href: "#fn-" + randomId, target: "_self", "data-footnotecontent": footnoteText });
                    footnoteText = "";
                    footnoteModalOpen = false;
                  }}>Add footnote</Button
                >
              </Dialog.Content>
            </Dialog.Root>
          {:else}
            <MarkExtensionButton {extensionDetail} {icon} {idx} {editor} />
          {/if}
        {/each}
      {/if}
    {/each}
  </div>

  <div class="floatingMenu border flex items-center gap-1 p-1 pl-2 rounded-lg hidden">
    <!-- bind:this={floatingMenuElement} -->
    <div class="whitespace-nowrap text-sm font-mono">Add new element</div>
    {#each nodeExtensionDetails as extensionDetail}
      {#if extensionDetail.showIcon && extensionDetail.icons?.length}
        {#each extensionDetail.icons as icon, idx}
          {#if extensionDetail.name === "image"}
            <Dialog.Root>
              <Dialog.Trigger>
                <Button size="icon" variant="outline" class="h-auto w-auto rounded-sm p-1">
                  <svelte:component this={icon} size="16" />
                </Button>
              </Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Add image</Dialog.Title>
                </Dialog.Header>

                {#if uploadImageFormStates.initial}
                  <FileUpload accept="image/*" fileIcon={ImageUp} on:filesadded={(e) => addFileToDocument(e, extensionDetail)} />
                {:else}
                  <FormStateModal>
                    <LoaderCircle class="animate-spin" />
                    <p>Uploading...</p>
                  </FormStateModal>
                {/if}
              </Dialog.Content>
            </Dialog.Root>
          {:else}
            <NodeExtensionButton {extensionDetail} {icon} {idx} {editor} />
          {/if}
        {/each}
      {/if}
    {/each}
  </div>

  {#if editor}
    <div class="editorButtonsWrapper flex justify-between border-b border-b-foreground z-10 items-end absolute top-0 right-0 w-fit hidden">
      <!-- <button on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} class:active={editor.isActive("heading", { level: 1 })}> H1 </button> -->
      <!-- <button on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} class:active={editor.isActive("heading", { level: 2 })}> H2 </button> -->
      <!-- <button on:click={() => editor.chain().focus().setParagraph().run()} class:active={editor.isActive("paragraph")}> P </button> -->
      <div class="editButtonsApp">
        <slot name="editButtonsAppTop" />
      </div>
      <div class="editorButtons flex gap-.5">
        {#each nodeExtensionDetails as extensionDetail}
          {#if extensionDetail.showIcon && extensionDetail.icons?.length}
            {#each extensionDetail.icons as icon, idx}
              {#if extensionDetail.name === "image"}
                <Dialog.Root bind:open={fileUploadModalOpen}>
                  <Dialog.Trigger>
                    <Button size="icon" variant="outline" class="h-auto w-auto rounded-sm p-1">
                      <svelte:component this={icon} size="16" />
                    </Button>
                  </Dialog.Trigger>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>Add image</Dialog.Title>
                    </Dialog.Header>

                    {#if uploadImageFormStates.initial}
                      <FileUpload accept="image/*" fileIcon={ImageUp} on:filesadded={(e) => addFileToDocument(e, extensionDetail)} />
                    {:else}
                      <FormStateModal>
                        <LoaderCircle class="animate-spin" />
                        <p>Uploading...</p>
                      </FormStateModal>
                    {/if}
                  </Dialog.Content>
                </Dialog.Root>
              {:else}
                <NodeExtensionButton {extensionDetail} {icon} {idx} {editor} />
              {/if}
            {/each}
          {/if}
        {/each}
        <!-- <AddTagPopOver activeTagIds={currentMarkActiveTagIds} on:tag={(e) => addTag(e.detail)} on:deletetag={(e) => addTag(e.detail)} /> -->
      </div>
    </div>
  {/if}

  <div class="{cn(className, 'editor size-full')} " role="application" bind:this={element} on:click />

  <!-- <ContextMenu.Root bind:open={contextMenuOpen}>
    <ContextMenu.Trigger class="h-full">
      <div class="{cn(className, 'editor size-full')} " on:contextmenu={handleContextMenu} role="application" bind:this={element} on:click />
    </ContextMenu.Trigger>
    <ContextMenu.Content class="flex flex-col shadow-xl">
      {#if isTable}
        {#each Object.entries(tableOptions) as [optionName, optionDetails]}
          <button
            on:click={() => {
              contextMenuOpen = false;
              optionDetails.action();
            }}
            class="h-auto w-auto rounded-xs p-1 text-left hover:bg-foreground/10 font-mono text-xs font-light [&:not(:last-child)]:border-b"
          >
            {optionName}
          </button>
        {/each}
      {:else if isListItem}
        {#each Object.entries(listItemOptions) as [optionName, optionDetails]}
          <button
            on:click={() => {
              contextMenuOpen = false;
              optionDetails.action();
            }}
            class="h-auto w-auto flex gap-1 items-center rounded-xs p-1 text-left hover:bg-foreground/10 font-mono text-xs font-light [&:not(:last-child)]:border-b"
          >
            <svelte:component this={optionDetails.icon} size="16" />{optionName}
          </button>
        {/each}
      {:else}
        Work in progress
      {/if}
    </ContextMenu.Content>
  </ContextMenu.Root> -->
  <div class="editButtonsApp">
    <!-- border-t border-foreground -->
    <slot name="editButtonsAppBottom" />
  </div>
</div>

<style>
  :global(button.active) {
    @apply bg-foreground text-background hover:bg-foreground/50 hover:text-background/70;
  }

  :global(.tiptap.ProseMirror) {
    /* @apply bg-background; */
    @apply min-w-[100px];
  }

  :global(.ProseMirror) {
    @apply size-full;
  }

  :global(.has-focus) {
    /* @apply border; */
  }

  .editorButtonsWrapper {
    /* box-shadow: rgba(33, 35, 38, 0.1) 0px 10px 10px -10px; */
  }
</style>
