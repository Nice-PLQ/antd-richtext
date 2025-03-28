import React from 'react';
import { RedoOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButton from '@/components/MenuButton';

const useRedo = () => {
  const editor = useEditorContext();
  const locale = useLocale();

  const isDisabled = !editor?.isEditable || !editor?.can().redo();

  const redo = () => {
    editor?.chain().focus().redo().run();
  };

  return {
    isDisabled,
    redo,
    tooltip: locale.redo,
  };
};

const MenuButtonRedo: React.FC = () => {
  const { isDisabled, redo, tooltip } = useRedo();

  return (
    <MenuButton
      tooltip={tooltip}
      icon={<RedoOutlined />}
      disabled={isDisabled}
      onClick={redo}
    />
  );
};

export default MenuButtonRedo;
