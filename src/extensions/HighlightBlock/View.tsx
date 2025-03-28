import { useState, lazy, Suspense, useCallback } from 'react';
import cx from 'classnames';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import Tippy from '@tippyjs/react';
import type { NodeViewProps } from '@tiptap/core';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Button, Popover } from 'antd/es';
import { prefix, highlightBlockColorPreset } from '@/constants';
import { useLocale } from '@/context';
import { parseEmoji, filterDataHTMLAttributes } from '@/utils';
import MenuButton from '@/components/MenuButton';
import Divider from '@/menus/Divider';
import type HighlightBlock from './index';

const Emoji = lazy(() => import('@/components/Emoji'));

interface NodeAttributes extends Record<string, unknown> {
  /** 表情符号 */
  emoji: string;
  /** 背景颜色 */
  bgColor: string;
  /** 边框颜色 */
  borderColor: string;
}

interface HighlightBlockNode extends ProseMirrorNode {
  attrs: NodeAttributes;
}

/**
 * 高亮块视图属性接口
 */
interface HighlightBlockViewProps extends NodeViewProps {
  /** 节点实例 */
  node: HighlightBlockNode;
  // @ts-ignore
  extension: typeof HighlightBlock;
}

interface ColorListProps {
  /** 当前背景颜色 */
  bgColor: string;
  /** 删除节点函数 */
  deleteNode: NodeViewProps['deleteNode'];
  /** 更新属性函数 */
  updateAttributes: NodeViewProps['updateAttributes'];
}

function ColorList({ bgColor, deleteNode, updateAttributes }: ColorListProps) {
  const locale = useLocale();

  return (
    <div className={`${prefix}-highlight-block-bubble-menu`}>
      {highlightBlockColorPreset.map(
        ([borderColor, backgroundColor], index) => (
          <div
            className={cx(`${prefix}-highlight-block-bubble-menu__item`, {
              [`${prefix}-highlight-block-item--selected`]:
                bgColor === backgroundColor,
            })}
            key={index}
            style={{ borderColor, backgroundColor }}
            onClick={() =>
              updateAttributes({
                borderColor,
                bgColor: backgroundColor,
              })
            }
          >
            {bgColor === backgroundColor && <CheckOutlined />}
          </div>
        ),
      )}
      <Divider />
      <MenuButton
        tooltip={locale.delete}
        btnType="text"
        icon={<DeleteOutlined />}
        onClick={deleteNode}
      />
    </div>
  );
}

const useHighlightBlock = (props: HighlightBlockViewProps) => {
  const { editor, updateAttributes } = props;

  const [visible, setVisible] = useState<boolean>(false);

  // 处理表情变更
  const handleEmojiChange = useCallback(
    (emoji: string) => {
      updateAttributes({ emoji });
      setVisible(false);
    },
    [updateAttributes],
  );

  // 处理弹出框可见性变更
  const handleVisibleChange = useCallback(
    (visible: boolean) => {
      if (editor.isEditable) {
        setVisible(visible);
      }
    },
    [editor.isEditable],
  );

  // 是否显示颜色选择器
  const showColorPicker =
    editor.isEditable && editor.isActive('highlightBlock');

  return {
    visible,
    showColorPicker,
    handleEmojiChange,
    handleVisibleChange,
  };
};

export default function HighlightBlockView(props: HighlightBlockViewProps) {
  const {
    node: { attrs },
    deleteNode,
    updateAttributes,
    HTMLAttributes,
  } = props;

  const { visible, showColorPicker, handleEmojiChange, handleVisibleChange } =
    useHighlightBlock(props);

  return (
    <Tippy
      interactive
      duration={200}
      arrow={false}
      placement="top"
      animation="shift-away"
      zIndex={2}
      visible={showColorPicker}
      content={
        <ColorList
          bgColor={attrs.bgColor}
          deleteNode={deleteNode}
          updateAttributes={updateAttributes}
        />
      }
    >
      <NodeViewWrapper
        className={`${prefix}-highlight-block`}
        style={{
          backgroundColor: attrs.bgColor,
          borderColor: attrs.borderColor,
        }}
        {...filterDataHTMLAttributes(HTMLAttributes)}
      >
        <Popover
          open={visible}
          content={
            <Suspense fallback={<div style={{ width: 400, height: 280 }} />}>
              <Emoji onChange={handleEmojiChange} />
            </Suspense>
          }
          trigger="click"
          placement="bottom"
          onOpenChange={handleVisibleChange}
        >
          <div
            className={`${prefix}-highlight-block-emoji`}
            contentEditable={false}
          >
            <Button size="small" icon={parseEmoji(attrs.emoji)} />
          </div>
        </Popover>
        <NodeViewContent />
      </NodeViewWrapper>
    </Tippy>
  );
}
