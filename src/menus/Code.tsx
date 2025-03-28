import React from 'react';
import { ReactComponent as CodeSvg } from '@/assets/icons/code.svg';
import MenuButton from '@/components/MenuButton';
import { useEditorContext, useLocale } from '@/context';

const useCode = () => {
  const editor = useEditorContext();
  const locale = useLocale();

  const isActive = editor?.isActive('code') ?? false;
  const isDisabled = !editor?.isEditable || !editor?.can().toggleCode();

  const toggleCode = () => {
    editor?.chain().focus().toggleCode().run();
  };

  return {
    isActive,
    isDisabled,
    toggleCode,
    tooltip: locale.code,
  };
};

const MenuButtonCode: React.FC = () => {
  const { isActive, isDisabled, toggleCode, tooltip } = useCode();

  return (
    <MenuButton
      tooltip={tooltip}
      icon={<CodeSvg />}
      selected={isActive}
      disabled={isDisabled}
      onClick={toggleCode}
    />
  );
};

export default MenuButtonCode;
