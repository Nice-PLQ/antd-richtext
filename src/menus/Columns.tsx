import React, { useState } from 'react';
import { ReactComponent as ColumnSvg } from '@/assets/icons/column.svg';
import { useEditorContext, useLocale } from '@/context';
import MenuButtonPopover from '@/components/MenuButton/Popover';
import Columns from '@/components/Columns';

const useColumns = () => {
  const [visible, setVisible] = useState(false);
  const editor = useEditorContext();
  const locale = useLocale();

  const isDisabled =
    !editor?.isEditable || !editor?.can().setColumns({ column: 1 });

  const openPopover = () => {
    setVisible(true);
  };

  const insertColumns = (columnCount: number) => {
    editor
      ?.chain()
      .setColumns({ column: columnCount })
      .focus(editor.state.selection.head - 1)
      .run();
    setVisible(false);
  };

  return {
    visible,
    isDisabled,
    setVisible,
    openPopover,
    insertColumns,
    tooltip: locale.columns,
  };
};

const MenuButtonColumns: React.FC = () => {
  const {
    visible,
    isDisabled,
    setVisible,
    openPopover,
    insertColumns,
    tooltip,
  } = useColumns();

  return (
    <MenuButtonPopover
      visible={visible}
      tooltip={tooltip}
      icon={<ColumnSvg />}
      disabled={isDisabled}
      onClick={openPopover}
      onVisibleChange={setVisible}
    >
      <Columns onClick={insertColumns} />
    </MenuButtonPopover>
  );
};

export default MenuButtonColumns;
