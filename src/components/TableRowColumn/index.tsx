import { useState, useCallback, useMemo } from 'react';
import cx from 'classnames';
import { prefix } from '@/constants';

/**
 * 表格行列选择器属性接口
 */
interface TableRowColumnProps {
  /** 点击回调，传入选中的行数和列数 */
  onClick: (row: number, column: number) => void;
}

/**
 * 表格单元格位置
 */
type CellPosition = [number, number];

/**
 * 使用表格行列选择的自定义Hook
 * @returns 表格行列选择相关状态和操作
 */
const useTableRowColumn = () => {
  // 当前选中的单元格位置 [行, 列]
  const [tableCell, setTableCell] = useState<CellPosition>([0, 0]);

  // 生成 10x10 的表格数据
  const tables = useMemo(
    () => Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 1)),
    [],
  );

  // 处理鼠标悬停
  const handleMouseOver = useCallback((row: number, column: number) => {
    setTableCell([row, column]);
  }, []);

  return {
    tableCell,
    tables,
    handleMouseOver,
  };
};

/**
 * 表格行列选择器组件
 * 用于选择表格的行数和列数
 */
export default function TableRowColumn({ onClick }: TableRowColumnProps) {
  const { tableCell, tables, handleMouseOver } = useTableRowColumn();

  return (
    <div>
      <div className={`${prefix}__menu-table`}>
        {tables.map((row, i) => (
          <div key={i} className={`${prefix}__menu-table-row`}>
            {row.map((_, j) => (
              <div
                key={`${i}-${j}`}
                className={cx({
                  [`${prefix}__menu-table-cell`]: true,
                  active: i <= tableCell[0] && j <= tableCell[1],
                })}
                onMouseOver={() => handleMouseOver(i, j)}
                onClick={() => onClick(i + 1, j + 1)}
              />
            ))}
          </div>
        ))}
      </div>
      <div className={`${prefix}__menu-table-tips`}>
        {tableCell[0] + 1} x {tableCell[1] + 1}
      </div>
    </div>
  );
}
