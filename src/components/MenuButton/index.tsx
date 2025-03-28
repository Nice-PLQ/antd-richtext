import React, { memo } from 'react';
import cx from 'classnames';
import { Tooltip, Button, ButtonProps } from 'antd/es';
import { prefix } from '@/constants';

/**
 * 菜单按钮属性接口
 */
interface MenuButtonProps {
  /** 提示文本 */
  tooltip?: string;
  /** 图标 */
  icon: React.ReactNode;
  /** 是否选中 */
  selected?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 按钮类型 */
  btnType?: ButtonProps['type'];
  /** 点击回调 */
  onClick: () => void;
  /** 子元素 */
  children?: React.ReactNode;
}

/**
 * 菜单按钮组件
 * 用于显示带有图标和提示的按钮
 */
const MenuButton: React.FC<MenuButtonProps> = ({
  tooltip,
  icon,
  style,
  selected,
  disabled,
  btnType = 'text',
  onClick,
  children,
}) => (
  <Tooltip placement="top" title={tooltip} destroyTooltipOnHide>
    <Button
      className={cx({ [`${prefix}-menu--selected`]: selected })}
      disabled={disabled}
      icon={icon}
      size="small"
      type={btnType}
      onClick={onClick}
      style={style}
    >
      {children}
    </Button>
  </Tooltip>
);

export default memo(MenuButton);
