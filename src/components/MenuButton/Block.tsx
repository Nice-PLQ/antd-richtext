import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { Popover } from 'antd/es';
import { RightOutlined, CheckOutlined } from '@ant-design/icons';
import { prefix } from '@/constants';

interface MenuPopoverProps {
  visible?: boolean;
  danger?: boolean;
  icon: React.ReactNode;
  title: string;
  selected?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  onClick?: () => void;
}

const MenuPopover: React.FC<MenuPopoverProps> = (props) => {
  const {
    visible,
    danger,
    icon,
    title,
    selected,
    children,
    onVisibleChange,
    onClick,
  } = props;
  const [innerVisible, setInnerVisible] = useState(false);

  const onInnerVisibleChange = (visible: boolean) => {
    if ('visible' in props) {
      onVisibleChange?.(visible);
    } else {
      setInnerVisible(visible);
    }
  };

  const listener = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'escape') {
      onInnerVisibleChange(false);
    }
  };

  useEffect(() => {
    if (visible) {
      document.addEventListener('keydown', listener, false);
    }
    setInnerVisible(visible as boolean);

    return () => {
      document.removeEventListener('keydown', listener, false);
    };
  }, [visible]);

  const content = (
    <div
      className={cx(
        `${prefix}-menu__block`,
        danger && `${prefix}-menu__block-danger`,
        selected && `${prefix}-menu__block-selected`,
      )}
      onClick={onClick}
    >
      {icon}
      {title}
      {children && (
        <RightOutlined className={`${prefix}-menu__block-expand-icon`} />
      )}
      {selected && <CheckOutlined style={{ marginLeft: 8 }} />}
    </div>
  );

  if (!children) {
    return content;
  }

  return (
    <Popover
      overlayInnerStyle={{ padding: 6 }}
      showArrow={false}
      content={children}
      placement="rightTop"
      destroyTooltipOnHide
      open={innerVisible}
      overlayStyle={{ minWidth: 172, padding: 0 }}
      onOpenChange={onInnerVisibleChange}
    >
      {content}
    </Popover>
  );
};

export default MenuPopover;
