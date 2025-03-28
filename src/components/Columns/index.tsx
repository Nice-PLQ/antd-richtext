import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import { prefix } from '@/constants';

interface ColumnsProps {
  /** 选择列数后的回调函数 */
  onClick: (column: number) => void;
}

const useColumns = (onColumnSelect: (column: number) => void) => {
  const [activeColumn, setActiveColumn] = useState<number>(1);

  // 生成列数数组 [1, 2, 3, 4, 5]
  const columns = Array.from({ length: 5 }, (_, i) => i + 1);

  // 鼠标悬停处理
  const handleMouseOver = useCallback((column: number) => {
    setActiveColumn(column);
  }, []);

  // 点击选择处理
  const handleColumnClick = useCallback(
    (column: number) => {
      if (column > 1) {
        onColumnSelect(column);
      }
    },
    [onColumnSelect],
  );

  return {
    activeColumn,
    columns,
    handleMouseOver,
    handleColumnClick,
  };
};

const Columns: React.FC<ColumnsProps> = ({ onClick }) => {
  const { activeColumn, columns, handleMouseOver, handleColumnClick } =
    useColumns(onClick);

  return (
    <div className={`${prefix}__menu-columns`}>
      {columns.map((column) => (
        <div
          key={column}
          className={cx(`${prefix}__menu-column`, {
            active: column <= activeColumn,
            disabled: column === 1,
          })}
          onMouseOver={() => handleMouseOver(column)}
          onClick={() => handleColumnClick(column)}
        />
      ))}
    </div>
  );
};

export default Columns;
