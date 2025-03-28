import React, { useMemo } from 'react';
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButtonDropdown from '@/components/MenuButton/Dropdown';

type Align = 'left' | 'center' | 'right' | 'justify';

interface MenuButtonTextAlignProps {
  alignments?: Align[];
}

interface AlignItem {
  label: string;
  align: Align;
  icon: React.ReactNode;
}

const DropdownItem = MenuButtonDropdown.Item;

/**
 * 使用文本对齐功能的自定义Hook
 * @param alignments 对齐方式选项数组
 * @returns 文本对齐相关状态和操作
 */
const useTextAlign = (alignments: Align[]) => {
  const editor = useEditorContext();
  const locale = useLocale();

  // 对齐方式映射配置
  const alignMapping = useMemo<Record<Align, AlignItem>>(
    () => ({
      left: {
        label: locale.alignLeft,
        align: 'left',
        icon: <AlignLeftOutlined />,
      },
      center: {
        label: locale.alignCenter,
        align: 'center',
        icon: <AlignCenterOutlined />,
      },
      right: {
        label: locale.alignRight,
        align: 'right',
        icon: <AlignRightOutlined />,
      },
      justify: {
        label: locale.alignJustify,
        align: 'justify',
        icon: <MenuOutlined />,
      },
    }),
    [locale],
  );

  // 可用的对齐方式选项
  const alignItems = useMemo<AlignItem[]>(
    () => alignments.map((align) => alignMapping[align]),
    [alignments, alignMapping],
  );

  // 当前激活的对齐方式
  const currentActive =
    alignments.find((textAlign) => editor?.isActive({ textAlign })) ?? '';

  // 是否禁用
  const isDisabled =
    !editor?.isEditable ||
    !alignments.some((alignment) => editor?.can().setTextAlign(alignment));

  // 设置文本对齐方式
  const setTextAlign = (alignment: Align) => {
    editor?.chain().focus().setTextAlign(alignment).run();
  };

  return {
    alignItems,
    currentActive,
    isDisabled,
    setTextAlign,
    alignMapping,
    tooltip: locale.align,
  };
};

const MenuButtonTextAlign: React.FC<MenuButtonTextAlignProps> = ({
  alignments = ['center', 'left', 'right', 'justify'],
}) => {
  const {
    alignItems,
    currentActive,
    isDisabled,
    setTextAlign,
    alignMapping,
    tooltip,
  } = useTextAlign(alignments);

  return (
    <MenuButtonDropdown
      tooltip={tooltip}
      activeIcon={alignMapping[currentActive || 'left'].icon}
      disabled={isDisabled}
    >
      {alignItems.map(({ label, align, icon }) => (
        <DropdownItem
          key={align}
          icon={icon}
          selected={currentActive === align}
          onClick={() => setTextAlign(align)}
        >
          {label}
        </DropdownItem>
      ))}
    </MenuButtonDropdown>
  );
};

export default MenuButtonTextAlign;
