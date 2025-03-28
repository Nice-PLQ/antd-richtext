import React from 'react';
import { ReactComponent as CodeBlockSvg } from '@/assets/icons/code-block.svg';
import MenuButton from '@/components/MenuButton';
import { useEditorContext, useLocale } from '@/context';

const useCodeBlock = () => {
  const editor = useEditorContext();
  const locale = useLocale();

  const isDisabled = !editor?.isEditable || !editor?.can().setCodeBlock();

  const setCodeBlock = () => {
    editor?.chain().focus().setCodeBlock().run();
  };

  return {
    isDisabled,
    setCodeBlock,
    tooltip: locale.codeBlock,
  };
};

const MenuButtonCodeBlock: React.FC = () => {
  const { isDisabled, setCodeBlock, tooltip } = useCodeBlock();

  return (
    <MenuButton
      tooltip={tooltip}
      icon={<CodeBlockSvg />}
      disabled={isDisabled}
      onClick={setCodeBlock}
    />
  );
};

export default MenuButtonCodeBlock;
