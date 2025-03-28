import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import View from './View';

export interface HighlightBlockAttributes {
  /** 表情符号 */
  emoji?: string;
  /** 背景颜色 */
  bgColor?: string;
  /** 边框颜色 */
  borderColor?: string;
}

export interface HighlightBlockOptions {
  /**
   * HTML属性
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    highlightBlock: {
      /**
       * 设置高亮块
       */
      toggleHighlightBlock: () => ReturnType;
    };
  }
}

const createColorAttribute = (attributeName: string) => ({
  default: null,
  parseHTML: (element: HTMLElement) => element.dataset[attributeName],
  renderHTML: (attributes: Record<string, any>) => {
    if (!attributes[attributeName]) {
      return {};
    }

    return {
      [`data-${attributeName}`]: attributes[attributeName],
    };
  },
});

export default Node.create<HighlightBlockOptions>({
  name: 'highlightBlock',

  content: 'block+',

  group: 'block',

  defining: true,

  addAttributes() {
    return {
      emoji: {
        default: '📌',
        parseHTML: (element) => element.dataset.emoji,
        renderHTML: (attributes) => ({
          'data-emoji': attributes.emoji,
        }),
      },
      bgColor: createColorAttribute('bgColor'),
      borderColor: createColorAttribute('borderColor'),
    };
  },

  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const bgColor = HTMLAttributes['data-bg-color'];
    const borderColor = HTMLAttributes['data-border-color'];

    const style =
      bgColor && borderColor
        ? `background-color:${bgColor};border-color:${borderColor}`
        : null;

    return [
      'div',
      mergeAttributes(
        this.options.HTMLAttributes,
        {
          'data-type': this.name,
          style,
        },
        HTMLAttributes,
      ),
      0,
    ];
  },

  addCommands() {
    return {
      toggleHighlightBlock:
        () =>
        ({ commands }) =>
          commands.toggleWrap(this.name),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(View);
  },
});
