import React from 'react';
import { StrikethroughOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButton from '@/components/MenuButton';

const useStrike = () => {
  const editor = useEditorContext();
  const locale = useLocale();

  const isActive = editor?.isActive('strike') ?? false;
  const isDisabled = !editor?.isEditable || !editor?.can().toggleStrike();

  const toggleStrike = () => {
    editor?.chain().focus().toggleStrike().run();
  };

  return {
    isActive,
    isDisabled,
    toggleStrike,
    tooltip: locale.strike,
  };
};

const MenuButtonStrike: React.FC = () => {
  const { isActive, isDisabled, toggleStrike, tooltip } = useStrike();

  return (
    <MenuButton
      tooltip={tooltip}
      icon={<StrikethroughOutlined />}
      selected={isActive}
      disabled={isDisabled}
      onClick={toggleStrike}
    />
  );
};

export default MenuButtonStrike;
