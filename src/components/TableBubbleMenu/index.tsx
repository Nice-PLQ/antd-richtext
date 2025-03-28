import React, { useCallback } from 'react';
import { BubbleMenu } from '@tiptap/react';
import type { Editor } from '@tiptap/core';
import { CellSelection } from '@tiptap/pm/tables';
import {
  DeleteColumnOutlined,
  DeleteRowOutlined,
  InsertRowAboveOutlined,
  InsertRowBelowOutlined,
  InsertRowLeftOutlined,
  InsertRowRightOutlined,
  MergeCellsOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import Divider from '@/menus/Divider';
import { useEditorContext, useLocale } from '@/context';
import { prefix } from '@/constants';
import MenuButton from '../MenuButton';
import MenuContainer from '../MenuContainer';
import CellColor from './CellColor';

/**
 * 检查是否选中了多个单元格
 * @param editor 编辑器实例
 * @returns 是否选中多个单元格
 */
const checkMultipleCellsSelected = (editor: Editor): boolean => {
  const { selection } = editor.state;
  // @ts-ignore
  return selection instanceof CellSelection || selection.jsonID === 'cell';
};

/**
 * 使用表格气泡菜单的自定义Hook
 * @returns 表格气泡菜单相关状态和操作
 */
const useTableBubbleMenu = () => {
  const locale = useLocale();
  const editor = useEditorContext();

  // 检查是否应该显示菜单
  const shouldShow = useCallback(
    () =>
      editor?.isEditable && editor ? checkMultipleCellsSelected(editor) : false,
    [editor],
  );

  // 执行编辑器命令
  const executeCommand = useCallback(
    (command: string) => {
      editor?.chain().focus()[command]().run();
    },
    [editor],
  );

  // 合并或拆分单元格
  const mergeOrSplit = useCallback(() => {
    editor?.chain().focus().mergeOrSplit().run();
  }, [editor]);

  // 检查是否可以拆分单元格
  const canSplitCell = editor?.can().splitCell() ?? false;

  return {
    editor,
    locale,
    shouldShow,
    executeCommand,
    mergeOrSplit,
    canSplitCell,
  };
};

/**
 * 表格气泡菜单组件
 * 用于提供表格相关操作的浮动菜单
 */
const TableBubbleMenu: React.FC = () => {
  const {
    editor,
    locale,
    shouldShow,
    executeCommand,
    mergeOrSplit,
    canSplitCell,
  } = useTableBubbleMenu();

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={{
        duration: 200,
        placement: 'top',
        animation: 'shift-away',
        offset: [0, 16],
        zIndex: 2,
      }}
    >
      <MenuContainer className={`${prefix}-table-bubble-menu`}>
        <MenuButton
          tooltip={canSplitCell ? locale.splitCell : locale.mergeCell}
          icon={<MergeCellsOutlined />}
          selected={canSplitCell}
          disabled={false}
          onClick={mergeOrSplit}
        />
        <CellColor />
        <MenuButton
          tooltip={locale.insertColumnBefore}
          icon={<InsertRowLeftOutlined />}
          onClick={() => executeCommand('addColumnBefore')}
        />
        <MenuButton
          tooltip={locale.insertColumnAfter}
          icon={<InsertRowRightOutlined />}
          onClick={() => executeCommand('addColumnAfter')}
        />
        <MenuButton
          tooltip={locale.insertRowBefore}
          icon={<InsertRowAboveOutlined />}
          onClick={() => executeCommand('addRowBefore')}
        />
        <MenuButton
          tooltip={locale.insertRowAfter}
          icon={<InsertRowBelowOutlined />}
          onClick={() => executeCommand('addRowAfter')}
        />
        <Divider />
        <MenuButton
          tooltip={locale.deleteRow}
          icon={<DeleteRowOutlined />}
          onClick={() => executeCommand('deleteRow')}
        />
        <MenuButton
          tooltip={locale.deleteColumn}
          icon={<DeleteColumnOutlined />}
          onClick={() => executeCommand('deleteColumn')}
        />
        <Divider />
        <MenuButton
          tooltip={locale.deleteTable}
          icon={<DeleteOutlined />}
          onClick={() => executeCommand('deleteTable')}
        />
      </MenuContainer>
    </BubbleMenu>
  );
};

export default TableBubbleMenu;
