import React from 'react';
import { ReactComponent as SuperSvg } from '@/assets/icons/super.svg';
import { useEditorContext, useLocale } from '@/context';
import MenuButton from '@/components/MenuButton';

const useSuperscript = () => {
  const editor = useEditorContext();
  const locale = useLocale();

  const isActive = editor?.isActive('superscript') ?? false;
  const isDisabled = !editor?.isEditable || !editor?.can().toggleSuperscript();

  const toggleSuperscript = () => {
    editor?.chain().focus().toggleSuperscript().run();
  };

  return {
    isActive,
    isDisabled,
    toggleSuperscript,
    tooltip: locale.superscript,
  };
};

const MenuButtonSuper: React.FC = () => {
  const { isActive, isDisabled, toggleSuperscript, tooltip } = useSuperscript();

  return (
    <MenuButton
      tooltip={tooltip}
      icon={<SuperSvg />}
      selected={isActive}
      disabled={isDisabled}
      onClick={toggleSuperscript}
    />
  );
};

export default MenuButtonSuper;
