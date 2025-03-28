import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Focus from '@tiptap/extension-focus';
import ListKeymap from '@tiptap/extension-list-keymap';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import Link from '@tiptap/extension-link';
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Code from '@tiptap/extension-code';
import Document from '@tiptap/extension-document';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import History from '@tiptap/extension-history';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Text from '@tiptap/extension-text';
import { prefix } from '../constants';
import SearchReplace from './SearchReplace';
import CustomCodeBlock from './CodeBlock';
import TableCell from './TableCell';
import Indent from './Indent';
import LineHeight from './LineHeight';
import { Column, Columns } from './Columns';
import TrailingNode from './TrailingNode';
import HighlightBlock from './HighlightBlock';
import FontSize from './FontSize';
import Image from './Image';
import Video from './Video';
import File from './File';
import Iframe from './Iframe';
import FullInEditor from './FullInEditor';
import ClearFormat from './ClearFormat';

const CustomLink = Link.extend({
  inclusive: false,
});

const CustomSubscript = Subscript.extend({
  excludes: 'superscript',
});

const CustomSuperscript = Superscript.extend({
  excludes: 'subscript',
});

export default function useExtensions({
  placeholder,
}: {
  placeholder: string;
}) {
  return [
    /** Nodes */
    Document,
    Paragraph.configure({
      HTMLAttributes: {
        class: `block ${prefix}-block`,
      },
    }),
    Heading.configure({
      HTMLAttributes: {
        class: `block ${prefix}-heading`,
      },
    }),
    BulletList.configure({
      HTMLAttributes: {
        class: `block ${prefix}-bullet-list`,
      },
    }),
    Blockquote.configure({
      HTMLAttributes: {
        class: `block ${prefix}-blockquote`,
      },
    }),
    CustomCodeBlock.configure({
      HTMLAttributes: {
        class: `block ${prefix}-code-block`,
      },
    }),
    ListItem.configure({
      HTMLAttributes: {
        class: `${prefix}-list-item`,
      },
    }),
    OrderedList.configure({
      HTMLAttributes: {
        class: `block ${prefix}-ordered-list`,
      },
    }),
    Columns.configure({
      HTMLAttributes: {
        class: `block ${prefix}-columns`,
      },
    }),
    Column.configure({
      HTMLAttributes: {
        class: `${prefix}-column`,
      },
    }),
    HorizontalRule.configure({
      HTMLAttributes: {
        class: `block ${prefix}-horizontal-rule`,
      },
    }),
    HighlightBlock.configure({
      HTMLAttributes: {
        class: `block ${prefix}-highlight-block`,
      },
    }),
    TaskList.configure({
      HTMLAttributes: {
        class: `block ${prefix}-task-list`,
      },
    }),
    TaskItem.configure({
      nested: true,
      HTMLAttributes: {
        class: `block ${prefix}-task-item`,
      },
    }),
    Table.configure({
      resizable: true,
      cellMinWidth: 150,
      allowTableNodeSelection: true,
      HTMLAttributes: {
        class: `block ${prefix}-table`,
      },
    }),
    TableRow,
    TableHeader,
    TableCell,
    Image.configure({
      minWidth: 100,
      HTMLAttributes: {
        class: `${prefix}-image`,
      },
    }),
    Video.configure({
      minWidth: 300,
      HTMLAttributes: {
        class: `${prefix}-video`,
      },
    }),
    File.configure({
      HTMLAttributes: {
        class: `${prefix}-file`,
      },
    }),
    Iframe.configure({
      minWidth: 500,
      HTMLAttributes: {
        class: `${prefix}-iframe`,
      },
    }),
    Placeholder.configure({
      placeholder,
    }),

    /** Marks */
    Text,
    Strike,
    Bold,
    Code,
    Italic,
    Underline,
    TextStyle,
    TextAlign.configure({
      types: ['heading', 'paragraph', 'image', 'video', 'iframe'],
      defaultAlignment: '',
    }),
    FontSize,
    Color,
    CustomSubscript,
    CustomSuperscript,
    LineHeight,
    CustomLink.configure({
      openOnClick: false,
      linkOnPaste: true,
      HTMLAttributes: {
        class: `${prefix}-link`,
      },
    }),
    Highlight.configure({ multicolor: true }),

    /** Functionality */
    Dropcursor,
    Gapcursor,
    HardBreak,
    History,
    Indent,
    ListKeymap,
    Focus,
    SearchReplace,
    FullInEditor,
    ClearFormat,
    TrailingNode,
  ];
}
