import React from 'react';
import cx from 'classnames';
import { prefix } from '@/constants';

interface Props {
  className?: string;
}

const MenuBar: React.FC<Props> = ({ className, children }) => (
  <div className={cx(`${prefix}-menubar`, className)}>{children}</div>
);

export default MenuBar;
