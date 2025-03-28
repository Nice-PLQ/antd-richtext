import { Extension } from '@tiptap/core';

export interface IndentOptions {
  /**
   * 支持缩进的节点类型
   */
  types: string[];
  /**
   * 每次缩进的像素值
   */
  step: number;
  /**
   * 最大缩进像素值
   */
  maxIndent?: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      /**
       * 增加缩进
       * @example editor.commands.setIndent();
       */
      setIndent: () => ReturnType;
      /**
       * 减少缩进
       * @example editor.commands.setOutdent();
       */
      setOutdent: () => ReturnType;
    };
  }
}

export default Extension.create<IndentOptions>({
  name: 'indent',

  addOptions() {
    return {
      types: ['heading', 'paragraph', 'orderedList', 'bulletList', 'taskList'],
      step: 20,
      maxIndent: 200,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) => {
              const { paddingLeft } = element.style;
              return paddingLeft ? parseInt(paddingLeft, 10) : 0;
            },
            renderHTML: (attributes) => {
              if (attributes.indent === 0) {
                return {};
              }
              return {
                style: `padding-left: ${attributes.indent}px`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    /**
     * 处理节点缩进
     * @param increase 是否增加缩进
     */
    const handleIndent =
      (increase: boolean) =>
      ({ state, commands }) => {
        const { from, to } = state.selection;
        let canExecute = true;

        // 遍历选区中的节点
        state.doc.nodesBetween(from, to, (node, pos, parent) => {
          // 只处理文档直接子节点的块级节点
          if (!node.isBlock || parent !== state.doc) {
            return;
          }

          // 检查节点类型是否支持缩进
          if (!this.options.types.includes(node.type.name)) {
            canExecute = false;
            return;
          }

          const { step, maxIndent = Infinity } = this.options;
          let newIndent;

          if (increase) {
            // 增加缩进
            newIndent = Math.min(node.attrs.indent + step, maxIndent);
          } else {
            // 减少缩进
            if (node.attrs.indent === 0) {
              canExecute = false;
              return;
            }
            newIndent = Math.max(node.attrs.indent - step, 0);
          }

          commands.updateAttributes(node.type, { indent: newIndent });
        });

        return canExecute;
      };

    return {
      setIndent: () => handleIndent(true),
      setOutdent: () => handleIndent(false),
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-]': () => this.editor.commands.setIndent(),
      'Mod-[': () => this.editor.commands.setOutdent(),
    };
  },
});
