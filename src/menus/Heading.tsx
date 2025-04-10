import React, { useMemo } from 'react';
import type { Level } from '@tiptap/extension-heading';
import { FontSizeOutlined } from '@ant-design/icons';
import { ReactComponent as Heading1Svg } from '@/assets/icons/heading1.svg';
import { ReactComponent as Heading2Svg } from '@/assets/icons/heading2.svg';
import { ReactComponent as Heading3Svg } from '@/assets/icons/heading3.svg';
import { ReactComponent as Heading4Svg } from '@/assets/icons/heading4.svg';
import { ReactComponent as Heading5Svg } from '@/assets/icons/heading5.svg';
import { ReactComponent as Heading6Svg } from '@/assets/icons/heading6.svg';
import { useEditorContext, useLocale } from '@/context';
import { prefix } from '@/constants';
import MenuButtonDropdown from '@/components/MenuButton/Dropdown';

interface MenuButtonHeadingProps {
  levels?: Level[];
}

interface HeadingItem {
  label: string;
  level: number;
  icon: React.ReactNode;
}

const DropdownItem = MenuButtonDropdown.Item;

const useHeading = (levels: Level[]) => {
  const editor = useEditorContext();
  const locale = useLocale();

  // 标题映射配置
  const headingMapping = useMemo<HeadingItem[]>(
    () => [
      // 约定：level 0 为正文
      { label: locale.text, level: 0, icon: <FontSizeOutlined /> },
      { label: locale.heading1, level: 1, icon: <Heading1Svg /> },
      { label: locale.heading2, level: 2, icon: <Heading2Svg /> },
      { label: locale.heading3, level: 3, icon: <Heading3Svg /> },
      { label: locale.heading4, level: 4, icon: <Heading4Svg /> },
      { label: locale.heading5, level: 5, icon: <Heading5Svg /> },
      { label: locale.heading6, level: 6, icon: <Heading6Svg /> },
    ],
    [locale],
  );

  // 可用的标题选项
  const headings = useMemo<HeadingItem[]>(
    () => [0, ...levels].map((level) => headingMapping[level]),
    [levels, headingMapping],
  );

  // 当前激活的标题级别
  const currentActive =
    levels.find((level) => editor?.isActive('heading', { level })) ?? 0;

  // 是否禁用
  const isDisabled =
    !editor?.isEditable ||
    (!editor?.can().setParagraph() &&
      !editor?.can().setHeading({ level: levels[0] }));

  // 设置标题
  const setHeading = (level: Level) => {
    editor?.chain().focus().setHeading({ level }).run();
  };

  // 设置为正文
  const setParagraph = () => editor?.chain().focus().setParagraph().run();

  return {
    headings,
    currentActive,
    isDisabled,
    setHeading,
    setParagraph,
    headingMapping,
    tooltip: locale.fontStyle,
  };
};

const MenuButtonHeading: React.FC<MenuButtonHeadingProps> = ({
  levels = [1, 2, 3, 4, 5, 6],
}) => {
  const {
    headings,
    currentActive,
    isDisabled,
    setHeading,
    setParagraph,
    headingMapping,
    tooltip,
  } = useHeading(levels);

  return (
    <MenuButtonDropdown
      tooltip={tooltip}
      className={`${prefix}-heading-menu__btn`}
      activeIcon={<span>{headingMapping[currentActive].label}</span>}
      disabled={isDisabled}
    >
      {headings.map(({ label, level, icon }) => (
        <DropdownItem
          key={level}
          icon={icon}
          selected={currentActive === level}
          label={label}
          onClick={() =>
            level === 0 ? setParagraph() : setHeading(level as Level)
          }
        />
      ))}
    </MenuButtonDropdown>
  );
};

export default MenuButtonHeading;
