import React, { useState, useRef, useCallback } from 'react';
import type { Editor } from '@tiptap/core';
import { selectedRect } from '@tiptap/pm/tables';
import { Menu, InputNumber } from 'antd/es';
import {
  DeleteOutlined,
  DeleteRowOutlined,
  InsertRowAboveOutlined,
} from '@ant-design/icons';
import { ReactComponent as TableRowSvg } from '@/assets/icons/table-row.svg';
import { useEditorContext, useLocale } from '@/context';
import ContextBubble, { ContextBubbleRef } from '../ContextBubble';

/**
 * 表格操作类型
 */
type TableHeaderType = 'row' | 'column';

/**
 * 表格操作数量配置
 */
interface TableOperationCount {
  rowBefore: number;
  rowAfter: number;
  columnBefore: number;
  columnAfter: number;
}

/**
 * 执行命令多次
 * @param fn 要执行的命令函数
 * @param times 执行次数
 */
const runCommand = (fn: () => void, times = 0) => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < times; i++) {
    fn();
  }
};

/**
 * 检查指定类型的表头是否启用
 * @param type 表头类型
 * @param rect 表格区域
 * @returns 是否启用
 */
const isHeaderEnabledByType = (type: TableHeaderType, rect: any): boolean => {
  // 获取第一行或第一列的单元格位置
  const cellPositions = rect.map.cellsInRect({
    left: 0,
    top: 0,
    right: type === 'row' ? rect.map.width : 1,
    bottom: type === 'column' ? rect.map.height : 1,
  });

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < cellPositions.length; i++) {
    const cell = rect.table.nodeAt(cellPositions[i]);
    if (cell && cell.type.name !== 'tableHeader') {
      return false;
    }
  }

  return true;
};

/**
 * 检查鼠标是否在表格内
 * @param editor 编辑器实例
 * @param event 鼠标事件
 * @returns 是否在表格内
 */
const isInTable = (editor: Editor, event: MouseEvent) => {
  let inTable = false;
  const { clientX, clientY } = event;
  const { view } = editor;
  const currentPos = view.posAtCoords({ left: clientX, top: clientY });

  if (currentPos) {
    const resolvedPos = view.state.doc.resolve(currentPos.pos);
    // eslint-disable-next-line no-plusplus
    for (let { depth } = resolvedPos; depth > 0; depth--) {
      const node = resolvedPos.node(depth);
      if (node.type.name === 'table') {
        inTable = true;
        break;
      }
    }
  }

  return inTable;
};

/**
 * 文本分隔符
 */
const delimiter = '{num}';

/**
 * 输入数字组件
 */
const NumberInput: React.FC<{
  value: number;
  onChange: (value: number) => void;
}> = ({ value, onChange }) => (
  <InputNumber
    size="small"
    min={1}
    max={10}
    controls={false}
    value={value}
    style={{ width: 36, height: 24, margin: '0 4px' }}
    onClick={(e) => e.stopPropagation()}
    onChange={(val) => onChange(val as number)}
  />
);

/**
 * 使用表格菜单的自定义Hook
 * @returns 表格菜单相关状态和操作
 */
const useTableMenu = () => {
  const [counts, setCounts] = useState<TableOperationCount>({
    rowBefore: 1,
    rowAfter: 1,
    columnBefore: 1,
    columnAfter: 1,
  });
  const [headerState, setHeaderState] = useState({
    rowEnabled: false,
    columnEnabled: false,
  });
  const contextBubbleRef = useRef<ContextBubbleRef>(null);

  const locale = useLocale();
  const editor = useEditorContext();

  // 更新操作数量
  const updateCount = useCallback(
    (key: keyof TableOperationCount, value: number) => {
      setCounts((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // 检查是否应该显示菜单
  const shouldShow = useCallback(
    (e: MouseEvent) => {
      if (!editor) {
        return false;
      }

      try {
        const rect = selectedRect(editor.state);
        const isHeaderRowEnabled = isHeaderEnabledByType('row', rect);
        const isHeaderColumnEnabled = isHeaderEnabledByType('column', rect);

        setHeaderState({
          rowEnabled: isHeaderRowEnabled,
          columnEnabled: isHeaderColumnEnabled,
        });

        return isInTable(editor, e) && editor.isEditable;
      } catch {
        return false;
      }
    },
    [editor],
  );

  // 执行表格操作
  const executeTableCommand = useCallback(
    (command: string, count?: number) => {
      if (!editor) {
        return;
      }

      const commandFn = () => editor.chain().focus()[command]().run();

      if (count !== undefined) {
        runCommand(commandFn, count);
      } else {
        commandFn();
      }

      // 对于删除表格操作，关闭上下文菜单
      if (command === 'deleteTable') {
        contextBubbleRef.current?.close();
      }
    },
    [editor],
  );

  return {
    editor,
    locale,
    counts,
    headerState,
    contextBubbleRef,
    updateCount,
    shouldShow,
    executeTableCommand,
  };
};

/**
 * 表格气泡菜单组件
 * 用于提供表格相关操作
 */
const TableBubbleMenu: React.FC = () => {
  const {
    editor,
    locale,
    counts,
    headerState,
    contextBubbleRef,
    updateCount,
    shouldShow,
    executeTableCommand,
  } = useTableMenu();

  // 分割本地化文本
  const insertAnyColumnBefore = locale.insertAnyColumnBefore.split(delimiter);
  const insertAnyColumnAfter = locale.insertAnyColumnAfter.split(delimiter);
  const insertAnyRowBefore = locale.insertAnyRowBefore.split(delimiter);
  const insertAnyRowAfter = locale.insertAnyRowAfter.split(delimiter);

  return (
    <ContextBubble
      ref={contextBubbleRef}
      editor={editor}
      shouldShow={shouldShow}
    >
      <Menu selectable={false} mode="vertical">
        <Menu.SubMenu
          key="insertRowAndColumn"
          title={locale.insertRowAndColumn}
          icon={<InsertRowAboveOutlined />}
        >
          <Menu.Item
            onClick={() =>
              executeTableCommand('addRowBefore', counts.rowBefore)
            }
          >
            {insertAnyRowBefore[0]}
            <NumberInput
              value={counts.rowBefore}
              onChange={(val) => updateCount('rowBefore', val)}
            />
            {insertAnyRowBefore[1]}
          </Menu.Item>
          <Menu.Item
            onClick={() => executeTableCommand('addRowAfter', counts.rowAfter)}
          >
            {insertAnyRowAfter[0]}
            <NumberInput
              value={counts.rowAfter}
              onChange={(val) => updateCount('rowAfter', val)}
            />
            {insertAnyRowAfter[1]}
          </Menu.Item>
          <Menu.Item
            onClick={() =>
              executeTableCommand('addColumnBefore', counts.columnBefore)
            }
          >
            {insertAnyColumnBefore[0]}
            <NumberInput
              value={counts.columnBefore}
              onChange={(val) => updateCount('columnBefore', val)}
            />
            {insertAnyColumnBefore[1]}
          </Menu.Item>
          <Menu.Item
            onClick={() =>
              executeTableCommand('addColumnAfter', counts.columnAfter)
            }
          >
            {insertAnyColumnAfter[0]}
            <NumberInput
              value={counts.columnAfter}
              onChange={(val) => updateCount('columnAfter', val)}
            />
            {insertAnyColumnAfter[1]}
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          key="deleteRowAndColumn"
          title={locale.deleteRowAndColumn}
          icon={<DeleteRowOutlined />}
        >
          <Menu.Item onClick={() => executeTableCommand('deleteRow')}>
            {locale.deleteCurrentRow}
          </Menu.Item>
          <Menu.Item onClick={() => executeTableCommand('deleteColumn')}>
            {locale.deleteCurrentColumn}
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          key="toggleTableHeader"
          title={locale.toggleTableHeader}
          icon={<TableRowSvg />}
        >
          <Menu.Item onClick={() => executeTableCommand('toggleHeaderRow')}>
            {headerState.rowEnabled
              ? locale.cancelTableHeaderRow
              : locale.setTableHeaderRow}
          </Menu.Item>
          <Menu.Item onClick={() => executeTableCommand('toggleHeaderColumn')}>
            {headerState.columnEnabled
              ? locale.cancelTableHeaderColumn
              : locale.setTableHeaderColumn}
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item
          icon={<DeleteOutlined />}
          onClick={() => executeTableCommand('deleteTable')}
        >
          {locale.deleteTable}
        </Menu.Item>
      </Menu>
    </ContextBubble>
  );
};

export default TableBubbleMenu;
