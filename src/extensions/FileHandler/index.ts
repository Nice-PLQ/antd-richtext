import { Extension, Editor } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { EditorView } from '@tiptap/pm/view';

/**
 * 文件处理器选项接口
 */
export interface FileHandlerOptions {
  /**
   * 粘贴文件处理函数
   * @param editor 编辑器实例
   * @param files 文件列表
   * @param pos 插入位置
   * @param html HTML内容
   * @returns 是否处理成功
   */
  onPaste?: (
    editor: Editor,
    files: File[],
    pos: number,
    html: string,
  ) => void | boolean;

  /**
   * 拖放文件处理函数
   * @param editor 编辑器实例
   * @param files 文件列表
   * @param pos 插入位置
   */
  onDrop?: (editor: Editor, files: File[], pos: number) => void;
}

/**
 * 插件键
 */
const pluginKey = new PluginKey('fileHandler');

/**
 * 文件处理器扩展
 *
 * 用于处理文件的粘贴和拖放操作
 */
export default Extension.create<FileHandlerOptions>({
  name: 'fileHandler',

  addOptions() {
    return {
      onPaste: undefined,
      onDrop: undefined,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: pluginKey,
        props: {
          /**
           * 处理粘贴事件
           */
          handlePaste: (view: EditorView, event: ClipboardEvent) => {
            const { onPaste } = this.options;

            // 检查回调函数是否存在
            if (!onPaste || typeof onPaste !== 'function') {
              return false;
            }

            const { clipboardData } = event;

            // 检查剪贴板数据是否存在
            if (!clipboardData || clipboardData.files.length === 0) {
              return false;
            }

            const files = Array.from(clipboardData.files);
            const html = clipboardData.getData('text/html');

            // 处理文件粘贴
            if (files.length > 0) {
              event.preventDefault();
              event.stopPropagation();

              return onPaste(
                this.editor,
                files,
                this.editor.state.tr.selection.from,
                html,
              );
            }

            // 如果有HTML内容，让其他插件处理
            return !(html.length > 0);
          },

          /**
           * 处理拖放事件
           */
          handleDrop: (view: EditorView, event: DragEvent) => {
            const { onDrop } = this.options;

            // 检查回调函数是否存在
            if (!onDrop || typeof onDrop !== 'function') {
              return false;
            }

            const fileData = event.dataTransfer;

            // 检查拖放数据是否存在
            if (!fileData || fileData.files.length === 0) {
              return false;
            }

            // 获取拖放位置
            const position = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });

            const files = Array.from(fileData.files);

            // 处理文件拖放
            if (files.length > 0) {
              event.preventDefault();
              event.stopPropagation();

              onDrop(this.editor, files, position ? position.pos : 0);
              return true;
            }

            return false;
          },
        },
      }),
    ];
  },
});
