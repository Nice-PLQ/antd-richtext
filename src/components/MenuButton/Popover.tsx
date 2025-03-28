import React, { useState, useEffect, useCallback } from 'react';
import cx from 'classnames';
import type { TooltipPlacement } from 'antd/es/tooltip';
import { Tooltip, Button, Popover } from 'antd/es';
import { prefix } from '@/constants';

/**
 * 菜单弹出框属性接口
 */
interface MenuPopoverProps {
  /** 是否可见 */
  visible?: boolean;
  /** 提示文本 */
  tooltip: string;
  /** 图标 */
  icon: React.ReactNode;
  /** 是否禁用 */
  disabled: boolean;
  /** 是否选中 */
  selected?: boolean;
  /** 弹出位置 */
  placement?: TooltipPlacement;
  /** 可见性变更回调 */
  onVisibleChange?: (visible: boolean) => void;
  /** 点击回调 */
  onClick?: () => void;
  /** 子元素 */
  children?: React.ReactNode;
}

/**
 * 使用菜单弹出框的自定义Hook
 * @returns 菜单弹出框相关状态和操作
 */
const useMenuPopover = (props: {
  visible?: boolean;
  disabled: boolean;
  onVisibleChange?: (visible: boolean) => void;
}) => {
  const { visible: propVisible, disabled, onVisibleChange } = props;
  const [innerVisible, setInnerVisible] = useState<boolean>(!!propVisible);

  // 处理可见性变更
  const handleVisibleChange = useCallback(
    (visible: boolean) => {
      if (disabled) {
        setInnerVisible(false);
        return;
      }

      if ('visible' in props) {
        onVisibleChange?.(visible);
      } else {
        setInnerVisible(visible);
      }
    },
    [props, disabled, onVisibleChange],
  );

  // 处理Escape键关闭弹出框
  const handleEscapeKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'escape') {
        handleVisibleChange(false);
      }
    },
    [handleVisibleChange],
  );

  // 同步外部可见性状态
  useEffect(() => {
    if (propVisible !== undefined) {
      setInnerVisible(propVisible);

      if (propVisible) {
        document.addEventListener('keydown', handleEscapeKey, false);
      } else {
        document.removeEventListener('keydown', handleEscapeKey, false);
      }

      return () => {
        document.removeEventListener('keydown', handleEscapeKey, false);
      };
    }
  }, [propVisible, handleEscapeKey]);

  return {
    visible: innerVisible,
    handleVisibleChange,
  };
};

/**
 * 菜单弹出框组件
 * 用于显示带有弹出内容的菜单按钮
 */
const MenuPopover: React.FC<MenuPopoverProps> = (props) => {
  const {
    tooltip,
    icon,
    disabled,
    selected,
    placement = 'bottomLeft',
    children,
    onClick,
  } = props;

  const { visible, handleVisibleChange } = useMenuPopover(props);

  return (
    <Tooltip placement="top" title={tooltip} destroyTooltipOnHide>
      <Popover
        overlayInnerStyle={{ padding: 6 }}
        showArrow={false}
        content={children}
        trigger={['click']}
        placement={placement}
        destroyTooltipOnHide
        open={visible}
        onOpenChange={handleVisibleChange}
      >
        <Button
          disabled={disabled}
          icon={icon}
          className={cx({ [`${prefix}-menu--selected`]: selected })}
          size="small"
          type="text"
          onClick={onClick}
        />
      </Popover>
    </Tooltip>
  );
};

export default MenuPopover;
