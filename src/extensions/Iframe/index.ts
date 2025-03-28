import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import View from './View';

export interface IframeAttributes {
  /** iframe 源地址 */
  src: string;
  /** iframe 宽度 */
  width?: number | string;
  /** iframe 高度 */
  height?: number | string;
  /** 是否允许全屏 */
  allowFullscreen?: boolean;
}

export interface IframeOptions {
  /** HTML 属性 */
  HTMLAttributes: Record<string, any>;
  /** 默认源地址 */
  src: string;
  /** 默认宽度 */
  width?: number;
  /** 最小宽度 */
  minWidth?: number;
  /** 默认高度 */
  height?: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      /**
       * 设置 iframe
       * @param options iframe 选项
       */
      setIframe: (options: Partial<IframeAttributes>) => ReturnType;
    };
  }
}

export default Node.create<IframeOptions>({
  name: 'iframe',

  group: 'block',

  addOptions() {
    return {
      HTMLAttributes: {
        frameborder: '0',
        allowfullscreen: 'true',
      },
      src: '',
      width: 640,
      height: 360,
      minWidth: 200,
    };
  },

  addAttributes() {
    return {
      src: {
        default: this.options.src,
        renderHTML: (attrs) => ({ src: attrs.src }),
        parseHTML: (el) => (el as HTMLIFrameElement).getAttribute('src'),
      },
      width: {
        default: this.options.width,
        renderHTML: (attrs) => ({
          width: attrs.width,
        }),
        parseHTML: (el) => el.getAttribute('width'),
      },
      height: {
        default: this.options.height,
        renderHTML: (attrs) => ({
          height: attrs.height,
        }),
        parseHTML: (el) => el.getAttribute('height'),
      },
      allowFullscreen: {
        default: true,
        renderHTML: (attrs) => ({
          allowfullscreen: attrs.allowFullscreen ? 'true' : null,
        }),
        parseHTML: (el) => el.getAttribute('allowfullscreen') !== null,
      },
    };
  },

  parseHTML() {
    return [{ tag: 'iframe' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'iframe',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(View);
  },

  addCommands() {
    return {
      setIframe:
        (options) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: options,
          }),
    };
  },
});
