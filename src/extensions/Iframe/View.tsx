import { useRef, useEffect, useState, MouseEvent, useCallback } from 'react';
import cx from 'classnames';
import type { NodeViewProps } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { NodeViewWrapper } from '@tiptap/react';
import { prefix } from '@/constants';
import Resizable from '@/components/Resizable';
import MediaFloatMenu from '@/components/MediaFloatMenu';
import { filterDataHTMLAttributes } from '@/utils';
import type Iframe from './index';

interface IframeNodeAttributes extends Record<string, unknown> {
  /** iframe 源地址 */
  src: string;
  /** iframe 宽度 */
  width: number;
  /** 是否在编辑器内全屏显示 */
  fullInEditor?: boolean;
  /** 文本对齐方式 */
  textAlign?: string;
}

interface IframeNode extends ProseMirrorNode {
  attrs: IframeNodeAttributes;
}

interface IframeViewProps extends NodeViewProps {
  /** 节点实例 */
  node: IframeNode;
  // @ts-ignore
  extension: typeof Iframe;
}

const useIframeView = (props: IframeViewProps) => {
  const { selected, updateAttributes, extension } = props;

  const [showMask, setShowMask] = useState<boolean>(true);
  const [resizable, setResizable] = useState<boolean>(true);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // 获取最小宽度
  const minWidth = extension.options.minWidth ?? 300;

  // 处理遮罩层点击
  const handleMaskClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowMask(false);
    setResizable(false);
  }, []);

  // 处理尺寸变更
  const handleSizeChange = useCallback(
    (width: number) => {
      updateAttributes({ width });
    },
    [updateAttributes],
  );

  // 获取元素矩形
  const getElementRect = useCallback(
    () => iframeRef.current!.getBoundingClientRect(),
    [],
  );

  // 当选中状态变化时重置遮罩层
  useEffect(() => {
    if (!selected) {
      setShowMask(true);
      setResizable(true);
    }
  }, [selected]);

  return {
    iframeRef,
    showMask,
    resizable,
    minWidth,
    handleMaskClick,
    handleSizeChange,
    getElementRect,
  };
};

export default function IframeView(props: IframeViewProps) {
  const {
    node: { attrs },
    selected,
    editor,
    HTMLAttributes,
  } = props;

  const {
    iframeRef,
    showMask,
    resizable,
    minWidth,
    handleMaskClick,
    handleSizeChange,
    getElementRect,
  } = useIframeView(props);

  return (
    <MediaFloatMenu
      size={attrs.width}
      miniSize={minWidth}
      visible={editor.isEditable && selected}
      onSizeChange={handleSizeChange}
    >
      <NodeViewWrapper
        className="block"
        style={{ textAlign: attrs.textAlign }}
        {...filterDataHTMLAttributes(HTMLAttributes)}
      >
        <Resizable
          className={`${prefix}-iframe`}
          selected={selected}
          disabled={!(editor.isEditable && resizable)}
          full={attrs.fullInEditor}
          minWidth={minWidth}
          getElementRect={getElementRect}
          onResize={handleSizeChange}
        >
          <iframe
            ref={iframeRef}
            src={attrs.src}
            width={attrs.fullInEditor ? '100%' : (attrs.width ?? undefined)}
            className={cx(`${prefix}-iframe-el`, {
              'ProseMirror-selectednode': selected && editor.isEditable,
            })}
          />
          {editor.isEditable && showMask && (
            <div
              className={`${prefix}-iframe-mask`}
              onDoubleClick={handleMaskClick}
            />
          )}
        </Resizable>
      </NodeViewWrapper>
    </MediaFloatMenu>
  );
}
