import React from 'react';
import { LineHeightOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButtonDropdown from '@/components/MenuButton/Dropdown';

interface MenuButtonLineHeightProps {
  lineHeights?: number[];
}

const DropdownItem = MenuButtonDropdown.Item;

const useLineHeight = (lineHeights: number[]) => {
  const editor = useEditorContext();
  const locale = useLocale();

  // 获取当前激活的行高
  const currentActive =
    lineHeights.find((lineHeight) => editor?.isActive({ lineHeight })) ?? '';

  // 是否禁用
  const isDisabled =
    !editor?.isEditable ||
    !lineHeights.some((lineHeight) => editor?.can().setLineHeight(lineHeight));

  // 设置行高
  const setLineHeight = (lineHeight: number) => {
    if (currentActive === lineHeight) {
      editor?.chain().focus().unsetLineHeight().run();
    } else {
      editor?.chain().focus().setLineHeight(lineHeight).run();
    }
  };

  return {
    currentActive,
    isDisabled,
    setLineHeight,
    tooltip: locale.lineHeight,
  };
};

const MenuButtonLineHeight: React.FC<MenuButtonLineHeightProps> = ({
  lineHeights = [1, 1.15, 1.3, 1.5, 2, 3],
}) => {
  const { currentActive, isDisabled, setLineHeight, tooltip } =
    useLineHeight(lineHeights);

  return (
    <MenuButtonDropdown
      tooltip={tooltip}
      activeIcon={<LineHeightOutlined />}
      disabled={isDisabled}
      dropdownWidth={78}
    >
      {lineHeights.map((lineHeight) => (
        <DropdownItem
          key={lineHeight}
          selected={currentActive === lineHeight}
          label={String(lineHeight)}
          onClick={() => setLineHeight(lineHeight)}
        />
      ))}
    </MenuButtonDropdown>
  );
};

export default MenuButtonLineHeight;
