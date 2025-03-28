import React from 'react';
import { ItalicOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButton from '@/components/MenuButton';

const useItalic = () => {
  const editor = useEditorContext();
  const locale = useLocale();

  const isActive = editor?.isActive('italic') ?? false;
  const isDisabled = !editor?.isEditable || !editor?.can().toggleItalic();

  const toggleItalic = () => {
    editor?.chain().focus().toggleItalic().run();
  };

  return {
    isActive,
    isDisabled,
    toggleItalic,
    tooltip: locale.italic,
  };
};

const MenuButtonItalic: React.FC = () => {
  const { isActive, isDisabled, toggleItalic, tooltip } = useItalic();

  return (
    <MenuButton
      tooltip={tooltip}
      icon={<ItalicOutlined />}
      selected={isActive}
      disabled={isDisabled}
      onClick={toggleItalic}
    />
  );
};

export default MenuButtonItalic;
