import React from 'react';
import { UnderlineOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButton from '@/components/MenuButton';

const useUnderline = () => {
  const editor = useEditorContext();
  const locale = useLocale();

  const isActive = editor?.isActive('underline') ?? false;
  const isDisabled = !editor?.isEditable || !editor?.can().toggleUnderline();

  const toggleUnderline = () => {
    editor?.chain().focus().toggleUnderline().run();
  };

  return {
    isActive,
    isDisabled,
    toggleUnderline,
    tooltip: locale.underLine,
  };
};

const MenuButtonUnderline: React.FC = () => {
  const { isActive, isDisabled, toggleUnderline, tooltip } = useUnderline();

  return (
    <MenuButton
      tooltip={tooltip}
      icon={<UnderlineOutlined />}
      selected={isActive}
      disabled={isDisabled}
      onClick={toggleUnderline}
    />
  );
};

export default MenuButtonUnderline;
