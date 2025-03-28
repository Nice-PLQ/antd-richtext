import React, { useState } from 'react';
import { TableOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButtonPopover from '@/components/MenuButton/Popover';
import TableRowColumn from '@/components/TableRowColumn';

const useTable = () => {
  const [visible, setVisible] = useState(false);
  const editor = useEditorContext();
  const locale = useLocale();

  const isDisabled = !editor?.isEditable;

  const showPopover = () => {
    setVisible(true);
  };

  const insertTable = (row: number, column: number) => {
    setVisible(false);
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: row + 1, cols: column + 1, withHeaderRow: false })
      .run();
  };

  return {
    visible,
    isDisabled,
    setVisible,
    showPopover,
    insertTable,
    tooltip: locale.table,
  };
};

const MenuButtonTable: React.FC = () => {
  const { visible, isDisabled, setVisible, showPopover, insertTable, tooltip } =
    useTable();

  return (
    <MenuButtonPopover
      visible={visible}
      tooltip={tooltip}
      icon={<TableOutlined />}
      disabled={isDisabled}
      onClick={showPopover}
      onVisibleChange={setVisible}
    >
      <TableRowColumn onClick={(row, column) => insertTable(row, column)} />
    </MenuButtonPopover>
  );
};

export default MenuButtonTable;
