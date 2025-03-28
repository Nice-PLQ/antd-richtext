import { Extension } from '@tiptap/core';

export interface LineHeightOptions {
  /**
   * 可以设置行高的节点类型
   * @default []
   * @example ['heading', 'paragraph']
   */
  types: string[];
  /**
   * 默认行高值
   * @default null
   */
  defaultLineHeight: number | null;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      /**
       * 设置行高
       * @param lineHeight 行高值
       * @example editor.commands.setLineHeight(1.5)
       */
      setLineHeight: (lineHeight: number) => ReturnType;
      /**
       * 取消行高设置
       * @example editor.commands.unsetLineHeight()
       */
      unsetLineHeight: () => ReturnType;
    };
  }
}

export default Extension.create<LineHeightOptions>({
  name: 'lineHeight',

  addOptions() {
    return {
      types: ['heading', 'paragraph'],
      defaultLineHeight: null,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            parseHTML: (element) => {
              const { lineHeight } = element.style;
              return lineHeight ? lineHeight.replace(/['"]+/g, '') : null;
            },
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) {
                return {};
              }

              return { style: `line-height: ${attributes.lineHeight}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      /**
       * 设置行高命令
       */
      setLineHeight:
        (lineHeight: number) =>
        ({ commands }) =>
          // 为所有支持的节点类型设置行高
          this.options.types
            .map((type) => commands.updateAttributes(type, { lineHeight }))
            .every((response) => response),
      /**
       * 取消行高设置命令
       */
      unsetLineHeight:
        () =>
        ({ commands }) =>
          // 为所有支持的节点类型重置行高
          this.options.types
            .map((type) => commands.resetAttributes(type, 'lineHeight'))
            .every((response) => response),
    };
  },
});
