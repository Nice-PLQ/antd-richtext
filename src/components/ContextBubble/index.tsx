import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import type { Editor } from '@tiptap/core';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import { prefix } from '@/constants';

interface ContextBubbleProps {
  /** 编辑器实例 */
  editor: Editor | null;
  /** 判断是否应该显示气泡的函数 */
  shouldShow?: (e: MouseEvent) => boolean;
  /** 气泡内容 */
  children: React.ReactNode;
}

export type ContextBubbleRef = {
  /** 关闭气泡方法 */
  close: () => void;
};

interface TooltipConfig {
  /** 气泡内容元素 */
  content: HTMLElement;
  /** 气泡附加到的元素获取函数 */
  appendTo: () => HTMLElement;
  /** X坐标 */
  x: number;
  /** Y坐标 */
  y: number;
}

const createTooltip = (config: TooltipConfig): TippyInstance => {
  const { content, appendTo, x, y } = config;
  // 创建一个临时元素来显示提示
  const el = document.createElement('div');
  const top = document.body.scrollTop || document.documentElement.scrollTop;
  el.style.position = 'absolute';
  el.style.left = `${x}px`;
  el.style.top = `${y + top}px`;
  document.body.appendChild(el);

  return tippy(el, {
    duration: 200,
    content,
    appendTo,
    trigger: 'manual',
    interactive: true,
    animation: 'shift-away',
    placement: 'bottom-start',
    showOnCreate: true,
    offset: [20, -24],
    zIndex: 2,
    onHidden(instance) {
      // 提示隐藏后移除临时元素
      instance.destroy();
      document.body.removeChild(el);
    },
  });
};

const useContextBubble = (
  editor: Editor | null,
  shouldShow?: (e: MouseEvent) => boolean,
  elementRef?: React.RefObject<HTMLDivElement>,
) => {
  const tippyRef = useRef<TippyInstance>();

  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      if (!elementRef?.current || !shouldShow?.(e)) {
        return;
      }

      e.preventDefault();
      tippyRef.current = createTooltip({
        content: elementRef.current,
        appendTo: () => editor?.options.element.parentElement!,
        x: e.clientX,
        y: e.clientY,
      });
    },
    [editor, shouldShow, elementRef],
  );

  const closeTippy = useCallback(() => {
    tippyRef.current?.destroy();
  }, []);

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [handleContextMenu]);

  return {
    closeTippy,
  };
};

const ContextBubble = forwardRef<ContextBubbleRef, ContextBubbleProps>(
  ({ children, editor, shouldShow }, ref) => {
    const elementRef = useRef<HTMLDivElement | null>(null);
    const { closeTippy } = useContextBubble(editor, shouldShow, elementRef);

    useImperativeHandle(ref, () => ({
      close: closeTippy,
    }));

    useEffect(() => {
      if (elementRef.current) {
        elementRef.current.remove();
      }
    }, []);

    return (
      <div ref={elementRef} className={`${prefix}-context-bubble`}>
        {children}
      </div>
    );
  },
);

export default ContextBubble;
