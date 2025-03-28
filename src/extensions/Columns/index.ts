import { Node, mergeAttributes } from '@tiptap/core';

export interface ColumnOptions {
  /** HTML 属性 */
  HTMLAttributes: Record<string, any>;
}

export interface ColumnsOptions extends ColumnOptions {
  /** 最大列数 */
  maxColumns?: number;
}

export interface ColumnsAttributes {
  /** 列数 */
  column: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      /**
       * 设置分栏
       * @param attributes 分栏属性
       * @example editor.commands.setColumns({ column: 2 });
       */
      setColumns: (attributes: ColumnsAttributes) => ReturnType;
    };
  }
}

// 定义分栏节点
export const Columns = Node.create<ColumnsOptions>({
  name: 'columns',

  group: 'block',

  content: 'column+',

  defining: true,

  isolating: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      maxColumns: 5,
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
    return [
      'div',
      mergeAttributes(
        { class: this.name, 'data-type': this.name },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
      0,
    ];
  },

  addCommands() {
    return {
      setColumns:
        (attributes) =>
        ({ state, commands }) => {
          const { $from } = state.selection;
          // eslint-disable-next-line no-plusplus
          for (let { depth } = $from; depth > 0; depth--) {
            const node = $from.node(depth);
            if (node.type.name === 'column') {
              return false;
            }
          }

          // 插入分栏内容
          commands.insertContent({
            type: 'columns',
            content: Array.from({ length: attributes.column }, () => ({
              type: 'column',
              content: [{ type: 'paragraph' }],
            })),
          });

          return true;
        },
    };
  },
});

/**
 * 列节点
 */
export const Column = Node.create<ColumnOptions>({
  name: 'column',

  content: 'block+',

  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {},
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
    return [
      'div',
      mergeAttributes(
        { class: this.name, 'data-type': this.name },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
      0,
    ];
  },
});
