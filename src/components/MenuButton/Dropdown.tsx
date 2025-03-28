import React, { useState, useCallback } from 'react';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import cx from 'classnames';
import { Tooltip, Button, Dropdown, Menu } from 'antd/es';
import { prefix } from '@/constants';

interface MenuDropdownItemProps {
  /** 图标 */
  icon?: React.ReactNode;
  /** 是否选中 */
  selected: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 点击回调 */
  onClick: () => void;
  /** 子元素 */
  children?: React.ReactNode;
}

interface MenuDropdownProps {
  /** 提示文本 */
  tooltip: string;
  /** 激活图标 */
  activeIcon: React.ReactNode;
  /** 是否禁用 */
  disabled: boolean;
  /** 下拉菜单宽度 */
  dropdownWidth?: number;
  /** 自定义类名 */
  className?: string;
  /** 是否显示箭头 */
  arrow?: boolean;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 子元素 */
  children?: React.ReactNode;
}

const useMenuDropdown = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const handleVisibleChange = useCallback((visible: boolean) => {
    setVisible(visible);
  }, []);

  const handleMenuClick = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    visible,
    handleVisibleChange,
    handleMenuClick,
  };
};

/**
 * 菜单下拉项组件
 * 用于显示下拉菜单中的选项
 */
const MenuDropdownItem: React.FC<MenuDropdownItemProps> = ({
  icon,
  onClick,
  selected,
  disabled,
  children,
}) => (
  <Menu.Item onClick={onClick} disabled={disabled}>
    <div
      className={cx(
        `${prefix}-menu__dropdown-item`,
        selected && `${prefix}-menu__dropdown--selected`,
      )}
    >
      {icon}
      {children}
      {selected && <CheckOutlined />}
    </div>
  </Menu.Item>
);

/**
 * 菜单下拉组件
 * 用于显示带有下拉菜单的按钮
 */
const MenuDropdown: React.FC<MenuDropdownProps> = ({
  tooltip,
  disabled,
  activeIcon,
  dropdownWidth,
  className,
  arrow = true,
  style,
  children,
}) => {
  const { visible, handleVisibleChange, handleMenuClick } = useMenuDropdown();

  return (
    <Tooltip placement="top" title={tooltip} destroyTooltipOnHide>
      <Dropdown
        trigger={['click']}
        disabled={disabled}
        open={visible}
        onOpenChange={handleVisibleChange}
        overlayStyle={{ width: dropdownWidth }}
        overlay={<Menu onClick={handleMenuClick}>{children}</Menu>}
      >
        <Button type="text" size="small" className={className} style={style}>
          {activeIcon}
          {arrow &&
            (visible ? (
              <CaretUpOutlined style={{ fontSize: 10, marginLeft: 4 }} />
            ) : (
              <CaretDownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
            ))}
        </Button>
      </Dropdown>
    </Tooltip>
  );
};

/**
 * 菜单下拉组件类型，包含Item子组件
 */
type MenuDropdownType = typeof MenuDropdown & {
  Item: typeof MenuDropdownItem;
};

// 将Item组件添加到MenuDropdown上
(MenuDropdown as MenuDropdownType).Item = MenuDropdownItem;

export default MenuDropdown as MenuDropdownType;
