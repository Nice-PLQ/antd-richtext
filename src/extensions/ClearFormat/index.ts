import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    clearFormat: {
      /**
       * 清除所有格式
       */
      clearFormat: () => ReturnType;
    };
  }
}

const ClearFormat = Extension.create({
  name: 'clearFormat',

  addCommands() {
    return {
      /**
       * 清除所有格式命令
       * 该命令会清除选中内容的所有节点和标记
       */
      clearFormat:
        () =>
        ({ commands }) =>
          // 先清除节点，再清除所有标记
          commands.clearNodes() && commands.unsetAllMarks(),
    };
  },
});

export default ClearFormat;
