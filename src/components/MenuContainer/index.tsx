import React, { memo } from 'react';
import cx from 'classnames';
import { prefix } from '@/constants';

/**
 * 菜单容器属性接口
 */
interface MenuContainerProps {
  /** 菜单项间距 */
  menuGap?: number;
  /** 自定义类名 */
  className?: string;
  /** 子元素 */
  children?: React.ReactNode;
}

/**
 * 菜单容器组件
 * 用于包装和排列菜单按钮
 */
const MenuContainer: React.FC<MenuContainerProps> = ({
  className,
  menuGap,
  children,
}) => (
  <div
    className={cx(`${prefix}-menu__container`, className)}
    style={{ gap: menuGap }}
  >
    {children}
  </div>
);

export default memo(MenuContainer);
