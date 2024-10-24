//ELEMENTS
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import Heading, { type Level } from "@tiptap/extension-heading";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import HardBreak from "@tiptap/extension-hard-break";
import horizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

//MARKS
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Code from "@tiptap/extension-code";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextStyle from "@tiptap/extension-text-style";

//FUNCTIONALITY
import Color from "@tiptap/extension-color";

//OTHER STUFF
import { Editor, Extension, Mark, type AnyExtension } from "@tiptap/core";

import {
  CornerDownLeft,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Table as TableIcon,
  Image as ImageIcon,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Highlighter,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Code as CodeIcon,
  Palette,
  Link2,
  IndentDecrease,
  IndentIncrease,
} from "lucide-svelte";

type NodeName =
  | "document"
  | "text"
  | "paragraph"
  | "heading"
  | "blockquote"
  | "bulletList"
  | "orderedList"
  | "listItem"
  | "hardBreak"
  | "horizontalRule"
  | "table"
  | "tableCell"
  | "tableHeader"
  | "tableRow"
  | "image"
  | "codeBlock"
  | "codeBlockLowLight"
  | "taskList"
  | "taskItem"
  | "mention"
  | "youtube";

export type NodeExtensionOptions = {
  [K in NodeName]?: {
    levels?: Level[];
    HTMLAttributes?: Record<string, string>;
    inline?: boolean;
    resizable?: true;
    lastColumnResizable?: false;
    nested?: boolean;
    showIcon?: boolean;
  };
};

interface NodeActionParams {
  id?: string;
  level?: Level;
  src?: string;
  alt?: string;
  title?: string;
  rows?: number;
  cols?: number;
  withHeaderRow?: boolean;
}

export interface NodeExtensionDetails {
  name: NodeName;
  extension: AnyExtension;
  can?: (nodeActionParams?: NodeActionParams) => boolean;
  set?: (nodeActionParams?: NodeActionParams) => void;
  unset?: (nodeActionParams?: NodeActionParams) => void;
  toggle?: (nodeActionParams?: NodeActionParams) => void;
  subCommands?: Record<string, { action: () => void; icon: any }>;
  showIcon: boolean;
  icons?: any[];
}

const headingIcons = { 1: Heading1, 2: Heading2, 3: Heading3, 4: Heading4, 5: Heading5, 6: Heading6 };

export function getNodeExtensions(editor: Editor, options: NodeExtensionOptions): { extensionDetails: NodeExtensionDetails[]; options: NodeExtensionOptions } {
  const extensionNamesChosen: Set<NodeName> = new Set(Object.keys(options) as (keyof typeof options)[]);

  const defaultExtensions: NodeExtensionDetails[] = [
    { name: "document", extension: Document, showIcon: !!options["paragraph"]?.showIcon },
    { name: "text", extension: Text, showIcon: !!options["paragraph"]?.showIcon },
  ];

  pushToExtensions(extensionNamesChosen, defaultExtensions, {
    name: "paragraph",
    extension: Paragraph.configure({
      HTMLAttributes: options["paragraph"]?.HTMLAttributes,
    }),
    can: () => editor.can().setParagraph(),
    set: () => editor.chain().focus().setParagraph().run(),
    showIcon: !!options["paragraph"]?.showIcon,
    icons: [Pilcrow],
  });

  pushToExtensions(extensionNamesChosen, defaultExtensions, {
    name: "heading",
    extension: Heading.configure({
      levels: options["heading"]?.levels,
      HTMLAttributes: options["heading"]?.HTMLAttributes,
    }).extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          id: {
            default: null,
            parseHTML: (element) => element.getAttribute("id"),
            renderHTML: (attributes) => {
              return {
                id: attributes.id,
              };
            },
          },
        };
      },
    }),
    set: (nodeActionParams) =>
      editor
        .chain()
        .focus()
        // @ts-expect-error
        .setHeading({ level: nodeActionParams?.level as Level, id: nodeActionParams?.id })
        .run(),
    toggle: (nodeActionParams) =>
      editor
        .chain()
        .focus()
        // @ts-expect-error
        .toggleHeading({ level: nodeActionParams?.level as Level, id: nodeActionParams?.id })
        .run(),
    can: (nodeActionParams) => editor.can().setHeading({ level: nodeActionParams?.level as Level }),
    showIcon: !!options["heading"]?.showIcon,
    icons: Object.values(options["heading"]?.levels || []).map((level) => headingIcons[level]),
  });
  pushToExtensions(extensionNamesChosen, defaultExtensions, {
    name: "blockquote",
    extension: Blockquote.configure({
      HTMLAttributes: options["blockquote"]?.HTMLAttributes,
    }),
    can: () => editor.can().setBlockquote(),
    set: () => editor.chain().focus().setBlockquote().run(),
    unset: () => editor.chain().focus().unsetBlockquote().run(),
    toggle: () => editor.chain().focus().toggleBlockquote().run(),
    showIcon: !!options["blockquote"]?.showIcon,
    icons: [Quote],
  });

  pushToExtensions(extensionNamesChosen, defaultExtensions, {
    name: "bulletList",
    extension: BulletList.configure({
      HTMLAttributes: options["bulletList"]?.HTMLAttributes,
    }),
    can: () => editor.can().toggleBulletList(),
    toggle: () => editor.chain().focus().toggleBulletList().run(),
    showIcon: !!options["bulletList"]?.showIcon,
    icons: [List],
  });

  pushToExtensions(extensionNamesChosen, defaultExtensions, {
    name: "orderedList",
    extension: OrderedList.configure({
      HTMLAttributes: options["orderedList"]?.HTMLAttributes,
    }),
    can: () => editor.can().toggleOrderedList(),
    toggle: () => editor.chain().focus().toggleOrderedList().run(),
    showIcon: !!options["orderedList"]?.showIcon,
    icons: [ListOrdered],
  });

  pushToExtensions(extensionNamesChosen, defaultExtensions, {
    name: "listItem",
    extension: ListItem.configure({
      HTMLAttributes: options["listItem"]?.HTMLAttributes,
    }),
    showIcon: !!options["listItem"]?.showIcon,
    subCommands: {
      "Sink list item": { action: () => editor.chain().focus().sinkListItem("listItem").run(), icon: IndentIncrease },
      "Lift list item": { action: () => editor.chain().focus().liftListItem("listItem").run(), icon: IndentDecrease },
    },
  });

  pushToExtensions(extensionNamesChosen, defaultExtensions, {
    name: "hardBreak",
    extension: HardBreak.configure({
      HTMLAttributes: options["hardBreak"]?.HTMLAttributes,
    }),
    can: () => editor.can().setHardBreak(),
    set: () => editor.chain().focus().setHardBreak().run(),
    showIcon: !!options["hardBreak"]?.showIcon,
    icons: [CornerDownLeft],
  });
  pushToExtensions(extensionNamesChosen, defaultExtensions, {
    name: "horizontalRule",
    extension: horizontalRule.configure({
      HTMLAttributes: options["horizontalRule"]?.HTMLAttributes,
    }),
    can: () => editor.can().setHorizontalRule(),
    set: () => editor.chain().focus().setHorizontalRule().run(),
    showIcon: !!options["horizontalRule"]?.showIcon,
    icons: [Minus],
  });

  pushToExtensions(extensionNamesChosen, defaultExtensions, [
    {
      name: "table",
      extension: Table.configure({
        HTMLAttributes: options["table"]?.HTMLAttributes,
        resizable: !!options["table"]?.resizable,
        lastColumnResizable: !!options["table"]?.lastColumnResizable,
      }),
      showIcon: !!options["table"]?.showIcon,
      icons: [TableIcon],
      can: () => editor.can().insertTable(),
      set: (nodeActionParams) =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: nodeActionParams?.rows || 2, cols: nodeActionParams?.cols || 2, withHeaderRow: nodeActionParams?.withHeaderRow || true })
          .run(),
      subCommands: {
        "Add column before": { action: () => editor.chain().focus().addColumnBefore().run(), icon: "" },
        "Add column after": { action: () => editor.chain().focus().addColumnAfter().run(), icon: "" },
        "Delete column": { action: () => editor.chain().focus().deleteColumn().run(), icon: "" },
        "Add row before": { action: () => editor.chain().focus().addRowBefore().run(), icon: "" },
        "Add row after": { action: () => editor.chain().focus().addRowAfter().run(), icon: "" },
        "Delete row": { action: () => editor.chain().focus().deleteRow().run(), icon: "" },
        "Delete table": { action: () => editor.chain().focus().deleteTable().run(), icon: "" },
        "Merge cells": { action: () => editor.chain().focus().mergeCells().run(), icon: "" },
        "Split cell": { action: () => editor.chain().focus().splitCell().run(), icon: "" },
        "Toggle header column": { action: () => editor.chain().focus().toggleHeaderColumn().run(), icon: "" },
        "Toggle header row": { action: () => editor.chain().focus().toggleHeaderRow().run(), icon: "" },
        "Toggle header cell": { action: () => editor.chain().focus().toggleHeaderCell().run(), icon: "" },
        "Merge or split": { action: () => editor.chain().focus().mergeOrSplit().run(), icon: "" },
        "Go to next cell": { action: () => editor.chain().focus().goToNextCell().run(), icon: "" },
        "Go to previous cell": { action: () => editor.chain().focus().goToPreviousCell().run(), icon: "" },
        // fixTables()
        // "setCellAttribute": { action: () => editor.chain().focus().setCellAttribute('customAttribute', 'value')
        //     editor.chain().focus().setCellAttribute('backgroundColor', '#000'), icon: "" },
      },
    },
  ]);

  pushToExtensions(extensionNamesChosen, defaultExtensions, {
    name: "tableCell",
    extension: TableCell.configure({
      HTMLAttributes: options["tableCell"]?.HTMLAttributes,
    }),
    showIcon: !!options["tableCell"]?.showIcon,
  });
  pushToExtensions(extensionNamesChosen, defaultExtensions, {
    name: "tableHeader",
    extension: TableHeader.configure({
      HTMLAttributes: options["tableHeader"]?.HTMLAttributes,
    }),
    showIcon: !!options["tableHeader"]?.showIcon,
  });
  pushToExtensions(extensionNamesChosen, defaultExtensions, {
    name: "tableRow",
    extension: TableRow.configure({
      HTMLAttributes: options["tableHeader"]?.HTMLAttributes,
    }),
    showIcon: !!options["tableRow"]?.showIcon,
  });
  pushToExtensions(extensionNamesChosen, defaultExtensions, [
    {
      name: "taskList",
      extension: TaskList.configure({
        HTMLAttributes: options["taskList"]?.HTMLAttributes,
      }),
      can: () => editor.can().toggleTaskList(),
      toggle: () => editor.chain().focus().toggleTaskList().run(),
      showIcon: !!options["taskList"]?.showIcon,
    },
    {
      name: "taskItem",
      extension: TaskItem.configure({
        HTMLAttributes: options["taskItem"]?.HTMLAttributes,
        nested: options["taskItem"]?.nested,
        // onReadOnlyChecked: (node, checked)
      }),
      showIcon: !!options["taskItem"]?.showIcon,
    },
  ]);

  pushToExtensions(extensionNamesChosen, defaultExtensions, {
    name: "image",
    extension: Image.configure({
      HTMLAttributes: options["image"]?.HTMLAttributes,
      inline: options["image"]?.inline,
    }),
    can: (nodeActionParams) =>
      editor.can().setImage({
        src: nodeActionParams?.src || "",
        alt: nodeActionParams?.alt || "",
        title: nodeActionParams?.title || "",
      }),
    set: (nodeActionParams) =>
      editor
        .chain()
        .focus()
        .setImage({
          src: nodeActionParams?.src || "",
          alt: nodeActionParams?.alt || "",
          title: nodeActionParams?.title || "",
        })
        .run(),
    showIcon: !!options["image"]?.showIcon,
    icons: [ImageIcon],
  });

  return { extensionDetails: defaultExtensions, options };
}

type MarkName = "bold" | "italic" | "underline" | "color" | "highlight" | "link" | "strike" | "subscript" | "superscript" | "textStyle" | "code";

export type MarkExtensionOptions = {
  [K in MarkName]?: {
    showIcon?: boolean;
    showReverseIcon?: boolean;
    HTMLAttributes?: Record<string, string>;
    addAttributes?: () => void;
  };
};
interface MarkActionParams {
  id?: string;
  color?: string;
  target?: string;
  href?: string;
  class?: string;
  "data-footnotecontent"?: string;
}

export interface MarkExtensionDetails {
  name: MarkName;
  extension: Mark;
  can?: (markActionParams?: MarkActionParams) => boolean;
  set?: (markActionParams?: MarkActionParams) => void;
  unset?: (markActionParams?: MarkActionParams) => void;
  toggle?: (markActionParams?: MarkActionParams) => void;
  showIcon: boolean;
  showReverseIcon: boolean;
  icons: any[];
}

export function getMarkExtensions(editor: Editor, options: MarkExtensionOptions): { extensionDetails: MarkExtensionDetails[]; options: MarkExtensionOptions } {
  const chosenMarkNames: Set<MarkName> = new Set(Object.keys(options) as (keyof typeof options)[]);

  const chosenMarks: MarkExtensionDetails[] = [];

  pushToExtensions(chosenMarkNames, chosenMarks, {
    name: "bold",
    extension: Bold.configure({
      HTMLAttributes: options["bold"]?.HTMLAttributes,
    }) as any,
    can: () => editor.can().toggleBold(),
    set: () => editor.chain().focus().setBold().run(),
    toggle: () => editor.chain().focus().toggleBold().run(),
    unset: () => editor.chain().focus().unsetBold().run(),
    showIcon: !!options["bold"]?.showIcon,
    showReverseIcon: !!options["link"]?.showReverseIcon,
    icons: [BoldIcon],
  });

  pushToExtensions(chosenMarkNames, chosenMarks, {
    name: "italic",
    extension: Italic.configure({
      HTMLAttributes: options["italic"]?.HTMLAttributes,
    }) as any,
    can: () => editor.can().toggleItalic(),
    set: () => editor.chain().focus().setItalic().run(),
    toggle: () => editor.chain().focus().toggleItalic().run(),
    unset: () => editor.chain().focus().unsetItalic().run(),
    showIcon: !!options["italic"]?.showIcon,
    showReverseIcon: !!options["link"]?.showReverseIcon,
    icons: [ItalicIcon],
  });

  pushToExtensions(chosenMarkNames, chosenMarks, {
    name: "underline",
    extension: Underline.configure({
      HTMLAttributes: options["underline"]?.HTMLAttributes,
    }) as any,
    can: () => editor.can().toggleUnderline(),
    set: () => editor.chain().focus().setUnderline().run(),
    toggle: () => editor.chain().focus().toggleUnderline().run(),
    unset: () => editor.chain().focus().unsetUnderline().run(),
    showIcon: !!options["underline"]?.showIcon,
    showReverseIcon: !!options["link"]?.showReverseIcon,
    icons: [UnderlineIcon],
  });

  pushToExtensions(chosenMarkNames, chosenMarks, {
    name: "highlight",
    extension: Highlight.configure({
      HTMLAttributes: options["highlight"]?.HTMLAttributes,
    }) as any,
    can: () => editor.can().toggleHighlight(),
    set: (markActionParams) =>
      editor
        .chain()
        .focus()
        .setHighlight({ color: markActionParams?.color || "" })
        .run(),
    toggle: (markActionParams) => editor.chain().focus().toggleHighlight().run(),
    unset: () => editor.chain().focus().unsetHighlight().run(),
    showIcon: !!options["highlight"]?.showIcon,
    showReverseIcon: !!options["link"]?.showReverseIcon,
    icons: [Highlighter],
  });

  pushToExtensions(chosenMarkNames, chosenMarks, {
    name: "strike",
    extension: Strike.configure({
      HTMLAttributes: options["strike"]?.HTMLAttributes,
    }) as any,
    can: () => editor.can().toggleStrike(),
    set: () => editor.chain().focus().setStrike().run(),
    toggle: () => editor.chain().focus().toggleStrike().run(),
    unset: () => editor.chain().focus().unsetStrike().run(),
    showIcon: !!options["strike"]?.showIcon,
    showReverseIcon: !!options["link"]?.showReverseIcon,
    icons: [Strikethrough],
  });

  pushToExtensions(chosenMarkNames, chosenMarks, {
    name: "subscript",
    extension: Subscript.configure({
      HTMLAttributes: options["subscript"]?.HTMLAttributes,
    }) as any,
    can: () => editor.can().toggleSubscript(),
    set: () => editor.chain().focus().setSubscript().run(),
    toggle: () => editor.chain().focus().toggleSubscript().run(),
    unset: () => editor.chain().focus().unsetSubscript().run(),
    showIcon: !!options["subscript"]?.showIcon,
    showReverseIcon: !!options["link"]?.showReverseIcon,
    icons: [SubscriptIcon],
  });

  pushToExtensions(chosenMarkNames, chosenMarks, {
    name: "superscript",
    extension: Superscript.configure({
      HTMLAttributes: options["superscript"]?.HTMLAttributes,
    }) as any,
    can: () => editor.can().toggleSuperscript(),
    set: () => editor.chain().focus().setSuperscript().run(),
    toggle: () => editor.chain().focus().toggleSuperscript().run(),
    unset: () => editor.chain().focus().unsetSuperscript().run(),
    showIcon: !!options["superscript"]?.showIcon,
    showReverseIcon: !!options["link"]?.showReverseIcon,
    icons: [SuperscriptIcon],
  });

  pushToExtensions(chosenMarkNames, chosenMarks, {
    name: "code",
    extension: Code.configure({
      HTMLAttributes: options["code"]?.HTMLAttributes,
    }) as any,
    can: () => editor.can().toggleCode(),
    set: () => editor.chain().focus().setCode().run(),
    toggle: () => editor.chain().focus().toggleCode().run(),
    unset: () => editor.chain().focus().unsetCode().run(),
    showIcon: !!options["code"]?.showIcon,
    showReverseIcon: !!options["link"]?.showReverseIcon,
    icons: [CodeIcon],
  });

  pushToExtensions(chosenMarkNames, chosenMarks, {
    name: "textStyle",
    extension: TextStyle.configure({
      HTMLAttributes: options["textStyle"]?.HTMLAttributes,
    }) as any,
    showIcon: !!options["textStyle"]?.showIcon,
    showReverseIcon: !!options["link"]?.showReverseIcon,
    icons: [],
  });

  pushToExtensions(chosenMarkNames, chosenMarks, {
    name: "color",
    extension: Color.configure({
      types: ["textStyle"],
    }) as any,
    can: (markActionParams) => editor.can().setColor(markActionParams?.color || ""),
    set: (markActionParams) =>
      editor
        .chain()
        .focus()
        // @ts-expect-error
        .setColor(markActionParams?.color | "")
        .run(),
    unset: () => editor.chain().focus().unsetCode().run(),
    showIcon: !!options["color"]?.showIcon,
    showReverseIcon: !!options["link"]?.showReverseIcon,
    icons: [Palette],
  });

  pushToExtensions(chosenMarkNames, chosenMarks, {
    name: "link",
    extension: Link.extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          id: {
            default: null,
            parseHTML: (element) => element.getAttribute("id"),
            renderHTML: (attributes) => {
              return {
                id: attributes.id,
              };
            },
          },
          class: {
            default: null,
            parseHTML: (element) => element.getAttribute("class"),
            renderHTML: (attributes) => {
              return {
                class: attributes.class,
              };
            },
          },
          target: {
            default: null,
            parseHTML: (element) => element.getAttribute("target"),
            renderHTML: (attributes) => {
              return {
                target: attributes.target,
              };
            },
          },
          "data-footnotecontent": {
            default: null,
            parseHTML: (element) => element.getAttribute("data-footnotecontent"),
            renderHTML: (attributes) => {
              return {
                "data-footnotecontent": attributes["data-footnotecontent"],
              };
            },
          },
          href: {
            default: null,
            parseHTML: (element) => element.getAttribute("href"),
            renderHTML: (attributes) => {
              return {
                href: attributes.href,
              };
            },
          },
        };
      },
    }).configure({
      HTMLAttributes: options["link"]?.HTMLAttributes,
    }) as any,
    can: () => editor.can().setLink({ href: "http://www.google.com/" }),
    set: (markActionParams) =>
      editor
        .chain()
        .focus()
        .setLink({
          // @ts-expect-error
          id: markActionParams?.id || "",
          href: markActionParams?.href || "",
          target: markActionParams?.target,
          class: markActionParams?.class,
          "data-footnotecontent": markActionParams?.["data-footnotecontent"],
        })
        .run(),
    unset: () => editor.chain().focus().unsetLink().run(),
    showIcon: !!options["link"]?.showIcon,
    showReverseIcon: !!options["link"]?.showReverseIcon,
    icons: [Link2],
  });

  return { extensionDetails: chosenMarks, options };
}

function pushToExtensions(
  extensionNamesChosen: Set<NodeName | MarkName>,
  chosenExtensions: (NodeExtensionDetails | MarkExtensionDetails)[],
  extensionDetails: (NodeExtensionDetails | NodeExtensionDetails[]) | (MarkExtensionDetails | MarkExtensionDetails[])
): void {
  if (Array.isArray(extensionDetails)) {
    if (extensionNamesChosen.has(extensionDetails[0].name)) {
      extensionDetails.forEach((extensionDetail) => {
        chosenExtensions.push(extensionDetail);
      });
    }
  } else {
    if (extensionNamesChosen.has(extensionDetails.name)) {
      chosenExtensions.push(extensionDetails);
    }
  }
}
