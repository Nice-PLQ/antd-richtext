import React, { useState, useEffect } from 'react';
import { FontColorsOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButtonPopover from '@/components/MenuButton/Popover';
import ColorPicker from '@/components/ColorPicker';
import { colorPreset as defaultColorPreset, defaultColor } from '@/constants';

interface MenuButtonColorProps {
  colorPreset?: string[];
}

const useTextColor = (colorPreset: string[]) => {
  const editor = useEditorContext();
  const locale = useLocale();
  const [color, setColor] = useState(defaultColor);

  const isDisabled =
    !editor?.isEditable || !editor?.can().setColor(defaultColor);

  // 获取当前选中文本的颜色
  const currentColor = editor?.isActive('textStyle')
    ? (editor.getAttributes('textStyle').color as string | undefined)
    : undefined;

  // 设置文本颜色
  const changeColor = (newColor: string) => {
    setColor(newColor);
    editor?.chain().setColor(newColor).run();
  };

  // 重置文本颜色
  const resetColor = () => {
    setColor(defaultColor);
    editor?.chain().unsetColor().run();
  };

  // 当编辑器中的颜色变化时，同步状态
  useEffect(() => {
    if (currentColor) {
      setColor(currentColor);
    }
  }, [currentColor]);

  return {
    color,
    isDisabled,
    colorPreset,
    changeColor,
    resetColor,
    tooltip: locale.color,
  };
};

const MenuButtonColor: React.FC<MenuButtonColorProps> = ({
  colorPreset = defaultColorPreset,
}) => {
  const { color, isDisabled, changeColor, resetColor, tooltip } =
    useTextColor(colorPreset);

  return (
    <MenuButtonPopover
      tooltip={tooltip}
      icon={<FontColorsOutlined style={{ color }} />}
      disabled={isDisabled}
    >
      <ColorPicker
        value={color}
        colorPreset={colorPreset}
        onChange={changeColor}
        onReset={resetColor}
      />
    </MenuButtonPopover>
  );
};

export default MenuButtonColor;
