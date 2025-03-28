import React from 'react';
import { ClearOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButton from '@/components/MenuButton';

const useClearFormat = () => {
  const editor = useEditorContext();
  const locale = useLocale();

  const isDisabled = !editor?.isEditable || !editor?.can().clearFormat();

  const clearFormat = () => {
    editor?.chain().focus().clearFormat().run();
  };

  return {
    isDisabled,
    clearFormat,
    tooltip: locale.clearFormat,
  };
};

const MenuButtonClearFormat: React.FC = () => {
  const { isDisabled, clearFormat, tooltip } = useClearFormat();

  return (
    <MenuButton
      tooltip={tooltip}
      icon={<ClearOutlined />}
      disabled={isDisabled}
      onClick={clearFormat}
    />
  );
};

export default MenuButtonClearFormat;
