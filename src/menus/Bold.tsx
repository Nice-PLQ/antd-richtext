import React from 'react';
import { BoldOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButton from '@/components/MenuButton';

const useBold = () => {
  const editor = useEditorContext();
  const locale = useLocale();

  const isActive = editor?.isActive('bold') ?? false;
  const isDisabled = !editor?.isEditable || !editor?.can().toggleBold();

  const toggleBold = () => {
    editor?.chain().focus().toggleBold().run();
  };

  return {
    isActive,
    isDisabled,
    toggleBold,
    tooltip: locale.bold,
  };
};

const MenuButtonBold: React.FC = () => {
  const { isActive, isDisabled, toggleBold, tooltip } = useBold();

  return (
    <MenuButton
      tooltip={tooltip}
      icon={<BoldOutlined />}
      selected={isActive}
      disabled={isDisabled}
      onClick={toggleBold}
    />
  );
};

export default MenuButtonBold;
