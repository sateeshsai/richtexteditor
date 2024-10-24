import "@tiptap/extension-text-style";

import { Extension } from "@tiptap/core";

export type TagsOptions = {
  /**
   * The types where the background can be applied
   * @default ['textStyle']
   * @example ['heading', 'paragraph']
   */
  types: string[];
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tags: {
      /**
       * Set the tags
       * @param tags The tags to set
       * @example editor.commands.setBackground('red')
       */
      setTags: (tags: string) => ReturnType;

      /**
       * Unset the background
       * @example editor.commands.unsetBackground()
       */
      unsetTags: () => ReturnType;
    };
  }
}

/**
 * This extension allows you to set tags as data-tags with span elements.
 */
export const Tags = Extension.create<TagsOptions>({
  name: "data-tags",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          "data-tags": {
            default: null,
            parseHTML: (element) => element.getAttribute("data-tags"),
            renderHTML: (attributes) => {
              return {
                "data-tags": attributes["data-tags"],
                style: "tags",
                class: "tags",
              };
            },
            // parseHTML: (element) => element.style.background?.replace(/['"]+/g, ""),
            // renderHTML: (attributes) => {
            //   if (!attributes.background) {
            //     return {};
            //   }

            //   return {
            //     class: ,
            //     style: `background: ${attributes.background}`,
            //   };
            // },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setTags:
        (tags) =>
        ({ chain }) => {
          console.log("SET TAGS", tags);
          return chain().setMark("textStyle", { "data-tags": tags }).run();
          // return chain().setMark("textStyle", { "data-tags": tags }).run();
        },
      unsetTags:
        () =>
        ({ chain }) => {
          return chain().setMark("textStyle", { "data-tags": null }).removeEmptyTextStyle().run();
        },
    };
  },
});
