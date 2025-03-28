import React from 'react';
import { ReactComponent as HighlightBlockSvg } from '@/assets/icons/highlight-block.svg';
import { useEditorContext, useLocale } from '@/context';
import MenuButton from '@/components/MenuButton';

const useHighlightBlock = () => {
  const editor = useEditorContext();
  const locale = useLocale();

  const isDisabled = !editor?.isEditable;

  const toggleHighlightBlock = () => {
    editor?.chain().focus().toggleHighlightBlock().run();
  };

  return {
    isDisabled,
    toggleHighlightBlock,
    tooltip: locale.highlightBlock,
  };
};

const MenuButtonHighlightBlock: React.FC = () => {
  const { isDisabled, toggleHighlightBlock, tooltip } = useHighlightBlock();

  return (
    <MenuButton
      tooltip={tooltip}
      icon={<HighlightBlockSvg />}
      disabled={isDisabled}
      onClick={toggleHighlightBlock}
    />
  );
};

export default MenuButtonHighlightBlock;
