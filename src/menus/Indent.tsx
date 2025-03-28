import React from 'react';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButton from '@/components/MenuButton';

const useIndent = () => {
  const editor = useEditorContext();
  const locale = useLocale();

  const isDisabled = !editor?.isEditable || !editor?.can().setIndent();

  const setIndent = () => {
    editor?.chain().focus().setIndent().run();
  };

  return {
    isDisabled,
    setIndent,
    tooltip: locale.indent,
  };
};

const MenuButtonIndent: React.FC = () => {
  const { isDisabled, setIndent, tooltip } = useIndent();

  return (
    <MenuButton
      tooltip={tooltip}
      icon={<MenuUnfoldOutlined />}
      disabled={isDisabled}
      onClick={setIndent}
    />
  );
};

export default MenuButtonIndent;
