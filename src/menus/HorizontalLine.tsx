import React from 'react';
import { LineOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButton from '@/components/MenuButton';

const useHorizontalLine = () => {
  const editor = useEditorContext();
  const locale = useLocale();

  const isDisabled = !editor?.isEditable || !editor?.can().setHorizontalRule();

  const insertHorizontalLine = () => {
    editor?.chain().focus().setHorizontalRule().run();
  };

  return {
    isDisabled,
    insertHorizontalLine,
    tooltip: locale.horizontalLine,
  };
};

const MenuButtonHorizontalLine: React.FC = () => {
  const { isDisabled, insertHorizontalLine, tooltip } = useHorizontalLine();

  return (
    <MenuButton
      tooltip={tooltip}
      icon={<LineOutlined />}
      disabled={isDisabled}
      onClick={insertHorizontalLine}
    />
  );
};

export default MenuButtonHorizontalLine;
