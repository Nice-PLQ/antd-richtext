import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { prettyBytes } from '@/utils';
import View from './View';

export interface FileOptions {
  /** HTML 属性 */
  HTMLAttributes: Record<string, any>;
}

export interface FileAttributes {
  /** 文件源地址 */
  src: string;
  /** 文件类型 */
  fileType: string;
  /** 文件名称 */
  fileName: string;
  /** 文件大小 */
  size?: number;
  /** 文件唯一标识 */
  fileUid?: string;
  /** 原始文件对象 */
  rowFile?: File;
  /** 上传地址 */
  uploadAction?: string;
  /** 上传文件处理函数 */
  uploadFileHandler?: (file: File) => Promise<any>;
  /** 下载文件处理函数 */
  downloadFileHandler?: (src: string, fileName: string) => void;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    file: {
      /**
       * 设置文件节点
       * @param attrs 文件属性
       * @example editor.commands.setFile({ src: 'file.pdf', fileType: 'application/pdf', fileName: 'document.pdf' });
       */
      setFile: (attrs: FileAttributes) => ReturnType;
    };
  }
}

const createAttribute = (name: string, dataAttrName?: string) => ({
  default: null,
  renderHTML: (attrs: Record<string, any>) => ({
    [`data-${dataAttrName || name}`]: attrs[name],
  }),
  parseHTML: (el: HTMLElement) => el.dataset[dataAttrName || name],
});

const createNonRenderAttribute = () => ({
  default: null,
  renderHTML: () => null,
  parseHTML: () => null,
});

export default Node.create<FileOptions>({
  name: 'file',

  group: 'block',

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: createAttribute('src'),
      type: {
        ...createAttribute('type', 'file-type'),
        parseHTML: (el) => el.dataset.fileType,
      },
      name: createAttribute('name'),
      size: {
        ...createAttribute('size'),
        parseHTML: (el) =>
          el.dataset.size ? parseInt(el.dataset.size, 10) : 0,
      },
      fileUid: createAttribute('fileUid', 'file-uid'),
      rowFile: createNonRenderAttribute(),
      uploadAction: createNonRenderAttribute(),
      uploadFileHandler: createNonRenderAttribute(),
      downloadFileHandler: createNonRenderAttribute(),
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="file"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'file',
      }),
      [
        'div',
        { class: 'file-info' },
        ['div', { class: 'file-name' }, HTMLAttributes['data-name']],
        [
          'div',
          { class: 'file-size' },
          prettyBytes(HTMLAttributes['data-size']),
        ],
      ],
    ];
  },

  addCommands() {
    return {
      setFile:
        (attrs: FileAttributes) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs,
          }),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(View);
  },
});
