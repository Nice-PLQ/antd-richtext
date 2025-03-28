import React, { useState, useCallback, ChangeEvent, useMemo } from 'react';
import { HexAlphaColorPicker, type RgbaColor } from 'react-colorful';
import { colord } from 'colord';
import cx from 'classnames';
import debounce from 'lodash-es/debounce';
import { CheckOutlined } from '@ant-design/icons';
import { Input, Space, Tooltip } from 'antd/es';
import { prefix } from '@/constants';
import { useLocale } from '@/context';

interface ColorPickerProps {
  /** 当前颜色值 */
  value?: string;
  /** 预设颜色列表 */
  colorPreset?: string[];
  /** 颜色变更回调 */
  onChange: (color: string) => void;
  /** 重置颜色回调 */
  onReset: () => void;
}

/**
 * 将颜色字符串转换为RGBA对象
 * @param color 颜色字符串
 * @returns RGBA颜色对象
 */
const toRgb = (color?: string): RgbaColor => {
  const defaultValue = { r: 0, g: 0, b: 0, a: 1 };
  if (!color) {
    return defaultValue;
  }
  const parsed = colord(color);
  return parsed.isValid() ? parsed.toRgb() : defaultValue;
};

/**
 * 检查RGB值是否有效
 */
const checkRGB = (r: number, g: number, b: number): boolean =>
  r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;

const useColorPicker = (
  initialValue?: string,
  onChange?: (color: string) => void,
  onReset?: () => void,
) => {
  const initHex = initialValue?.substring(1) || '';
  const [hex, setHex] = useState<string>(initHex);
  const [rgba, setRgba] = useState<RgbaColor>(toRgb(initialValue));

  const onColorChange = useCallback(
    (color: string) => {
      const rgbaValue = colord(color).toRgb();
      setRgba(rgbaValue);
      setHex(color.substring(1));
      onChange?.(color);
    },
    [onChange],
  );

  const onColorChangeDebounce = useMemo(
    () => debounce((color: string) => onColorChange(color), 250),
    [onColorChange],
  );

  const onHexChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const hexValue = e.target.value;
      setHex(hexValue);

      const hexString = `#${hexValue}`;
      if (colord(hexString).isValid()) {
        setRgba(colord(hexString).toRgb());
        onChange?.(hexString);
      }
    },
    [onChange],
  );

  const onRgbaChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, type: keyof RgbaColor) => {
      const val = Number(e.target.value);
      const newRgba = { ...rgba, [type]: val };
      setRgba(newRgba);

      if (checkRGB(newRgba.r, newRgba.g, newRgba.b)) {
        const hexValue = colord(newRgba).toHex();
        setHex(hexValue.substring(1));
        onChange?.(hexValue);
      }
    },
    [rgba, onChange],
  );

  const onResetColor = useCallback(() => {
    setHex('');
    setRgba({ r: 0, g: 0, b: 0, a: 1 });
    onReset?.();
  }, [onReset]);

  return {
    hex,
    rgba,
    onColorChange,
    onColorChangeDebounce,
    onHexChange,
    onRgbaChange,
    onResetColor,
  };
};

const ColorPresetItem: React.FC<{
  color: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ color, isSelected, onClick }) => (
  <div
    className={cx(`${prefix}-color-picker__item`, {
      [`${prefix}-color-picker--selected`]: isSelected,
    })}
    style={{ backgroundColor: color }}
    onClick={onClick}
  >
    {isSelected && <CheckOutlined />}
  </div>
);

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  colorPreset = [],
  onChange,
  onReset,
}) => {
  const locale = useLocale();
  const {
    hex,
    rgba,
    onColorChangeDebounce,
    onHexChange,
    onRgbaChange,
    onColorChange,
    onResetColor,
  } = useColorPicker(value, onChange, onReset);

  return (
    <div className={`${prefix}-color-picker`}>
      <HexAlphaColorPicker color={value} onChange={onColorChangeDebounce} />

      <Space size={6} className={`${prefix}-color-picker__input`}>
        <Input
          prefix="#"
          className="hex"
          maxLength={8}
          value={hex}
          onChange={onHexChange}
        />
        <Input
          prefix="R"
          maxLength={3}
          value={rgba.r}
          onChange={(e) => onRgbaChange(e, 'r')}
        />
        <Input
          prefix="G"
          maxLength={3}
          value={rgba.g}
          onChange={(e) => onRgbaChange(e, 'g')}
        />
        <Input
          prefix="B"
          maxLength={3}
          value={rgba.b}
          onChange={(e) => onRgbaChange(e, 'b')}
        />
      </Space>

      <div className={`${prefix}-color-picker__preset`}>
        {colorPreset.map((color) => (
          <ColorPresetItem
            key={color}
            color={color}
            isSelected={color === value}
            onClick={() => onColorChange(color)}
          />
        ))}

        <Tooltip placement="top" title={locale.reset} destroyTooltipOnHide>
          <div
            className={`${prefix}-color-picker__item none`}
            onClick={onResetColor}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default ColorPicker;
