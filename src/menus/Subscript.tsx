import React from 'react';
import { ReactComponent as SubSvg } from '@/assets/icons/sub.svg';
import { useEditorContext, useLocale } from '@/context';
import MenuButton from '@/components/MenuButton';

const useSubscript = () => {
  const editor = useEditorContext();
  const locale = useLocale();

  const isActive = editor?.isActive('subscript') ?? false;
  const isDisabled = !editor?.isEditable || !editor?.can().toggleSubscript();

  const toggleSubscript = () => {
    editor?.chain().focus().toggleSubscript().run();
  };

  return {
    isActive,
    isDisabled,
    toggleSubscript,
    tooltip: locale.subscript,
  };
};

const MenuButtonSub: React.FC = () => {
  const { isActive, isDisabled, toggleSubscript, tooltip } = useSubscript();

  return (
    <MenuButton
      tooltip={tooltip}
      icon={<SubSvg />}
      selected={isActive}
      disabled={isDisabled}
      onClick={toggleSubscript}
    />
  );
};

export default MenuButtonSub;
