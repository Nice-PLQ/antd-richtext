import {
  InputRule,
  mergeAttributes,
  type ExtendedRegExpMatchArray,
} from '@tiptap/core';
import Image, { type ImageOptions } from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';
import View from './View';

export interface ResizableImageAttributes {
  /** 图片源地址 */
  src: string;
  /** 图片替代文本 */
  alt?: string;
  /** 图片标题 */
  title?: string;
  /** 图片宽度 */
  width?: number | string;
  /** 图片高度 */
  height?: number | string;
  /** 图片宽高比 */
  aspectRatio?: string;
  /** 文件唯一标识 */
  fileUid?: string;
  /** 上传进度 */
  uploadPercent?: number;
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

export type ResizableImageOptions = ImageOptions & {
  /**
   * 判断图片源地址是否允许
   * @param src 图片源地址
   * @returns 是否允许
   */
  isAllowedImgSrc(src: string | null): boolean;
  /** 最小宽度 */
  minWidth?: number;
};

const createNonRenderAttribute = () => ({
  default: null,
  renderHTML: () => null,
  parseHTML: () => null,
});

export default Image.extend<ResizableImageOptions>({
  addOptions() {
    return {
      ...this.parent?.(),

      isAllowedImgSrc: (src: string | null) => {
        if (!src) {
          return false;
        }

        return true;
      },
      minWidth: 200,
    };
  },

  addAttributes() {
    const parentAttributes = this.parent?.() || {};

    return {
      ...parentAttributes,
      width: {
        default: null,
        renderHTML: (attrs) => ({
          width: attrs.width as string | number | undefined,
        }),
        parseHTML: (el) => {
          let width = el.getAttribute('width');
          width = /\d/.test(el.style.width)
            ? `${parseFloat(el.style.width)}`
            : width;
          return width;
        },
      },
      height: {
        default: null,
        renderHTML: (attrs) => ({
          height: attrs.height as string | number | undefined,
        }),
        parseHTML: (el) => {
          let height = el.getAttribute('height');
          height = /\d/.test(el.style.height)
            ? `${parseFloat(el.style.height)}`
            : height;
          return height;
        },
      },
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
      uploadPercent: {
        default: 0,
        renderHTML: () => null,
        parseHTML: () => null,
      },
      rowFile: createNonRenderAttribute(),
      uploadAction: createNonRenderAttribute(),
      uploadFileHandler: createNonRenderAttribute(),
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(
        { height: 'auto' },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
    ];
  },

  parseHTML() {
    return [
      {
        tag: this.options.allowBase64
          ? 'img[src]'
          : 'img[src]:not([src^="data:"])',
        getAttrs: (node) => {
          if (!(node instanceof Element)) {
            return false;
          }

          const src = node.getAttribute('src');
          return this.options.isAllowedImgSrc(src) && null;
        },
      },
    ];
  },

  addInputRules() {
    const parentInputRules = this.parent?.();
    if (!parentInputRules) {
      return [];
    }

    const getAttributes = (match: ExtendedRegExpMatchArray) => {
      const [, , alt, src, title] = match;
      return { src, alt, title };
    };

    return parentInputRules.map(
      (rule) =>
        new InputRule({
          find: rule.find,
          handler: (props) => {
            const attributes = getAttributes(props.match);
            if (!this.options.isAllowedImgSrc(attributes.src)) {
              return null;
            }

            return rule.handler(props);
          },
        }),
    );
  },

  addNodeView() {
    return ReactNodeViewRenderer(View);
  },
});
