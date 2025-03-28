import React from 'react';
import { UndoOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButton from '@/components/MenuButton';

const useUndo = () => {
  const editor = useEditorContext();
  const locale = useLocale();

  const isDisabled = !editor?.isEditable || !editor?.can().undo();

  const undo = () => {
    editor?.chain().focus().undo().run();
  };

  return {
    isDisabled,
    undo,
    tooltip: locale.undo,
  };
};

const MenuButtonUndo: React.FC = () => {
  const { isDisabled, undo, tooltip } = useUndo();

  return (
    <MenuButton
      tooltip={tooltip}
      icon={<UndoOutlined />}
      disabled={isDisabled}
      onClick={undo}
    />
  );
};

export default MenuButtonUndo;
