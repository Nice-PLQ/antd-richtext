import React from 'react';
import { useEditorContext, useLocale } from '@/context';
import MenuButton from '@/components/MenuButton/index';
import { ReactComponent as BlockquoteSvg } from '@/assets/icons/blockquote.svg';

const useBlockquote = () => {
  const editor = useEditorContext();
  const locale = useLocale();

  const isActive = editor?.isActive('blockquote') ?? false;
  const isDisabled = !editor?.isEditable || !editor?.can().toggleBlockquote();

  const toggleBlockquote = () => {
    editor?.chain().focus().toggleBlockquote().run();
  };

  return {
    isActive,
    isDisabled,
    toggleBlockquote,
    tooltip: locale.blockquote,
  };
};

const MenuButtonBlockquote: React.FC = () => {
  const { isActive, isDisabled, toggleBlockquote, tooltip } = useBlockquote();

  return (
    <MenuButton
      tooltip={tooltip}
      icon={<BlockquoteSvg />}
      selected={isActive}
      disabled={isDisabled}
      onClick={toggleBlockquote}
    />
  );
};

export default MenuButtonBlockquote;
