import { Editor } from '@tiptap/react';

/**
 * 检查编辑器中是否有文本被选中
 * @param params 包含编辑器实例的对象
 * @returns 是否有文本被选中
 */
export const isTextSelected = ({ editor }: { editor: Editor }): boolean => {
  if (!editor || !editor.isEditable) {
    return false;
  }

  const {
    state: {
      doc,
      selection: { empty, from, to },
    },
  } = editor;

  // 检查选中区域是否有文本内容
  const selectedText = doc.textBetween(from, to);
  const isEmptyTextBlock = !selectedText.length;

  return !(empty || isEmptyTextBlock);
};
