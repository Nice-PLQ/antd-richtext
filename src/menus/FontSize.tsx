import React from 'react';
import { FontSizeOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import { fontSize as defaultFontSize } from '@/constants';
import MenuButtonDropdown from '@/components/MenuButton/Dropdown';

interface MenuButtonFontSizeProps {
  fontSize?: string[];
}

const DropdownItem = MenuButtonDropdown.Item;

const useFontSize = (fontSizes: string[]) => {
  const editor = useEditorContext();
  const locale = useLocale();

  const isDisabled = !editor?.isEditable;

  // 获取当前选中文本的字体大小
  const currentSize = editor?.isActive('textStyle')
    ? (editor.getAttributes('textStyle').fontSize as string | undefined)
    : undefined;

  // 设置字体大小
  const setFontSize = (size: string) => {
    editor?.chain().focus().setFontSize(size).run();
  };

  return {
    currentSize,
    isDisabled,
    fontSizes,
    setFontSize,
    tooltip: locale.fontSize,
  };
};

const MenuButtonFontSize: React.FC<MenuButtonFontSizeProps> = ({
  fontSize = defaultFontSize,
}) => {
  const { currentSize, isDisabled, setFontSize, tooltip } =
    useFontSize(fontSize);

  return (
    <MenuButtonDropdown
      tooltip={tooltip}
      activeIcon={
        currentSize ? (
          <span style={{ marginRight: 4, paddingLeft: 4 }}>{currentSize}</span>
        ) : (
          <FontSizeOutlined />
        )
      }
      disabled={isDisabled}
      dropdownWidth={78}
    >
      {fontSize.map((size) => (
        <DropdownItem
          key={size}
          selected={currentSize === size}
          label={size}
          onClick={() => setFontSize(size)}
        />
      ))}
    </MenuButtonDropdown>
  );
};

export default MenuButtonFontSize;
