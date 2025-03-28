import { Node, nodeInputRule, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import View from './View';

export interface VideoAttributes {
  /** 视频源地址 */
  src: string;
  /** 视频宽度 */
  width?: number | string;
  /** 视频高度 */
  height?: number | string;
  /** 视频宽高比 */
  aspectRatio?: string;
  /** 文件唯一标识 */
  fileUid?: string;
  /** 原始文件对象 */
  rowFile?: File;
  /** 上传地址 */
  uploadAction?: string;
  /** 上传文件处理函数 */
  uploadFileHandler?: (
    file: File,
    onProgress: (percent: number) => void,
  ) => Promise<any>;
}

export interface VideoOptions {
  /** HTML属性 */
  HTMLAttributes: Record<string, any>;
  /** 最小宽度 */
  minWidth?: number;
  /** 是否为内联视频 */
  inline: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      /**
       * 设置视频节点
       * @param src 视频源地址
       */
      setVideo: (src: string) => ReturnType;
    };
  }
}

const VIDEO_INPUT_REGEX = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

const createNonRenderAttribute = () => ({
  default: null,
  renderHTML: () => null,
  parseHTML: () => null,
});

const createSizeAttribute = (attributeName: string) => ({
  default: null,
  renderHTML: (attrs: Record<string, any>) => ({
    [attributeName]: attrs[attributeName] as string | number | undefined,
  }),
  parseHTML: (el: HTMLElement) => {
    let value = el.getAttribute(attributeName);
    value = /\d/.test(el.style[attributeName as any])
      ? `${parseFloat(el.style[attributeName as any])}`
      : value;
    return value;
  },
});

export default Node.create<VideoOptions>({
  name: 'video',

  inline() {
    return this.options.inline;
  },

  group() {
    return this.options.inline ? 'inline' : 'block';
  },

  draggable: true,

  addOptions() {
    return {
      inline: false,
      HTMLAttributes: {},
      minWidth: 300,
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
        renderHTML: (attrs) => ({ src: attrs.src }),
        parseHTML: (el) => (el as HTMLSpanElement).getAttribute('src'),
      },
      width: createSizeAttribute('width'),
      height: createSizeAttribute('height'),
      aspectRatio: {
        default: null,
        renderHTML: (attrs) => {
          if (!attrs.aspectRatio) {
            return {};
          }

          return {
            style: `aspect-ratio: ${attrs.aspectRatio}`,
          };
        },
        parseHTML: (el) => el.style.aspectRatio,
      },
      fileUid: {
        default: null,
        renderHTML: (attrs) => ({
          'data-file-uid': attrs.fileUid,
        }),
        parseHTML: (el) => el.dataset.fileUid,
      },
      rowFile: createNonRenderAttribute(),
      uploadAction: createNonRenderAttribute(),
      uploadFileHandler: createNonRenderAttribute(),
    };
  },

  parseHTML() {
    return [{ tag: 'video' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'video',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        controls: 'controls',
      }),
    ];
  },

  addCommands() {
    return {
      setVideo:
        (src: string) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { src },
          }),
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: VIDEO_INPUT_REGEX,
        type: this.type,
        getAttributes: (match) => {
          const [, , src] = match;
          return { src };
        },
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(View);
  },
});
