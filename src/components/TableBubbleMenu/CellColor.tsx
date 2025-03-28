import { useState, useEffect, useCallback } from 'react';
import { BgColorsOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import {
  highlightColorPreset as defaultColorPreset,
  defaultColor,
} from '@/constants';
import MenuButtonPopover from '../MenuButton/Popover';
import ColorPicker from '../ColorPicker';

/**
 * 单元格颜色菜单属性接口
 */
interface MenuCellColorProps {
  /** 颜色预设列表 */
  colorPreset?: string[];
}

/**
 * 使用单元格颜色功能的自定义Hook
 * @returns 单元格颜色相关状态和操作
 */
const useCellColor = (colorPreset: string[]) => {
  const editor = useEditorContext();
  const locale = useLocale();
  const [color, setColor] = useState<string>(defaultColor);

  // 获取当前单元格颜色
  const currentColor = editor?.isActive('tableCell')
    ? (editor.getAttributes('tableCell').bgColor as string | undefined)
    : undefined;

  // 设置单元格颜色
  const handleColorChange = useCallback(
    (newColor: string) => {
      setColor(newColor);
      editor?.chain().setCellAttribute('bgColor', newColor).run();
    },
    [editor],
  );

  // 重置单元格颜色
  const handleColorReset = useCallback(() => {
    setColor(defaultColor);
    editor?.chain().setCellAttribute('bgColor', null).run();
  }, [editor]);

  // 同步当前单元格颜色
  useEffect(() => {
    if (currentColor) {
      setColor(currentColor);
    }
  }, [currentColor]);

  return {
    editor,
    locale,
    color,
    colorPreset,
    handleColorChange,
    handleColorReset,
  };
};

/**
 * 单元格颜色菜单组件
 * 用于设置表格单元格背景颜色
 */
export default function MenuCellColor({
  colorPreset = defaultColorPreset,
}: MenuCellColorProps) {
  const { editor, locale, color, handleColorChange, handleColorReset } =
    useCellColor(colorPreset);

  return (
    <MenuButtonPopover
      tooltip={locale.cellColor}
      icon={<BgColorsOutlined style={{ color }} />}
      disabled={!editor?.isEditable}
    >
      <ColorPicker
        value={color}
        colorPreset={colorPreset}
        onChange={handleColorChange}
        onReset={handleColorReset}
      />
    </MenuButtonPopover>
  );
}
