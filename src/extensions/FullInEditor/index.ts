import { Extension } from '@tiptap/core';

export interface FullInEditorOptions {
  /**
   * 可应用全屏的节点类型
   */
  types: string[];
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fullInEditor: {
      /**
       * 切换编辑器内全屏状态
       */
      toggleFullInEditor: () => ReturnType;
    };
  }
}

export default Extension.create<FullInEditorOptions>({
  name: 'fullInEditor',

  addOptions() {
    return {
      types: ['image', 'video', 'iframe'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fullInEditor: {
            default: false,
            parseHTML: (el) => el.dataset.fullInEditor === 'true',

            renderHTML: (attrs) => ({
              'data-full-in-editor': attrs.fullInEditor,
            }),
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      /**
       * 切换编辑器内全屏状态命令
       */
      toggleFullInEditor:
        () =>
        ({ state, commands }) => {
          const { from, to } = state.selection;
          let canToggle = true;

          state.doc.nodesBetween(from, to, (node) => {
            // 检查节点类型是否支持全屏
            if (!this.options.types.includes(node.type.name)) {
              canToggle = false;
              return;
            }

            // 切换节点的全屏状态
            commands.updateAttributes(node.type, {
              fullInEditor: !node.attrs.fullInEditor,
            });
          });

          return canToggle;
        },
    };
  },
});
