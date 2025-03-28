import React from 'react';
import { MenuFoldOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButton from '@/components/MenuButton';

const useOutdent = () => {
  const editor = useEditorContext();
  const locale = useLocale();

  const isDisabled = !editor?.isEditable || !editor?.can().setOutdent();

  const setOutdent = () => {
    editor?.chain().focus().setOutdent().run();
  };

  return {
    isDisabled,
    setOutdent,
    tooltip: locale.outdent,
  };
};

const MenuButtonOutdent: React.FC = () => {
  const { isDisabled, setOutdent, tooltip } = useOutdent();

  return (
    <MenuButton
      tooltip={tooltip}
      icon={<MenuFoldOutlined />}
      disabled={isDisabled}
      onClick={setOutdent}
    />
  );
};

export default MenuButtonOutdent;
