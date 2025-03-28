import React, { useState, useEffect } from 'react';
import { BgColorsOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButtonPopover from '@/components/MenuButton/Popover';
import ColorPicker from '@/components/ColorPicker';
import {
  highlightColorPreset as defaultColorPreset,
  defaultColor,
} from '@/constants';

interface MenuHighlightButtonColorProps {
  colorPreset?: string[];
}

const useHighlightColor = (colorPreset: string[]) => {
  const editor = useEditorContext();
  const locale = useLocale();
  const [color, setColor] = useState(defaultColor);

  const isDisabled = !editor?.isEditable || !editor?.can().toggleHighlight();

  // 获取当前选中文本的高亮颜色
  const currentColor = editor?.isActive('highlight')
    ? (editor.getAttributes('highlight').color as string | undefined)
    : undefined;

  // 设置高亮颜色
  const changeHighlightColor = (newColor: string) => {
    setColor(newColor);
    editor?.chain().setHighlight({ color: newColor }).run();
  };

  // 移除高亮
  const removeHighlight = () => {
    setColor(defaultColor);
    editor?.chain().unsetHighlight().run();
  };

  // 当编辑器中的高亮颜色变化时，同步状态
  useEffect(() => {
    if (currentColor) {
      setColor(currentColor);
    }
  }, [currentColor]);

  return {
    color,
    isDisabled,
    colorPreset,
    changeHighlightColor,
    removeHighlight,
    tooltip: locale.highlightColor,
  };
};

const MenuHighlightButtonColor: React.FC<MenuHighlightButtonColorProps> = ({
  colorPreset = defaultColorPreset,
}) => {
  const { color, isDisabled, changeHighlightColor, removeHighlight, tooltip } =
    useHighlightColor(colorPreset);

  return (
    <MenuButtonPopover
      tooltip={tooltip}
      icon={<BgColorsOutlined style={{ color }} />}
      disabled={isDisabled}
    >
      <ColorPicker
        value={color}
        colorPreset={colorPreset}
        onChange={changeHighlightColor}
        onReset={removeHighlight}
      />
    </MenuButtonPopover>
  );
};

export default MenuHighlightButtonColor;
