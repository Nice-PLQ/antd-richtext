import cx from 'classnames';
import React, { useRef, useEffect, useCallback } from 'react';
import { prefix } from '@/constants';

/**
 * 可调整大小组件的最小宽度
 */
export const RESIZABLE_MIN_WIDTH = 48;

/**
 * 调整大小的控制点枚举
 */
export enum ResizePoints {
  TopLeft = 'top-left',
  TopRight = 'top-right',
  BottomLeft = 'bottom-left',
  BottomRight = 'bottom-right',
}

/**
 * 可调整大小组件属性接口
 */
interface ResizableProps {
  /** 自定义类名 */
  className?: string;
  /** 是否选中 */
  selected: boolean;
  /** 是否禁用 */
  disabled: boolean;
  /** 最小宽度 */
  minWidth?: number;
  /** 是否全宽显示 */
  full?: boolean;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 获取元素矩形区域 */
  getElementRect: () => DOMRect;
  /** 调整大小回调 */
  onResize: (width: number) => void;
  /** 子元素 */
  children?: React.ReactNode;
}

/**
 * 使用可调整大小功能的自定义Hook
 * @returns 可调整大小相关状态和操作
 */
const useResizable = (props: {
  minWidth: number;
  disabled: boolean;
  getElementRect: () => DOMRect;
  onResize: (width: number) => void;
}) => {
  const { minWidth, disabled, getElementRect, onResize } = props;

  const clientX = useRef<number>(0);
  const elementWidth = useRef<number>(0);
  const resizing = useRef<boolean>(false);
  const points = useRef<ResizePoints>(ResizePoints.TopLeft);

  // 鼠标按下事件处理
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, currentPoints: ResizePoints) => {
      clientX.current = e.clientX;
      resizing.current = true;
      elementWidth.current = getElementRect().width;
      points.current = currentPoints;
    },
    [getElementRect],
  );

  // 鼠标移动事件处理
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!resizing.current) {
        return;
      }

      let resizedWidth: number;
      if (
        points.current === ResizePoints.TopRight ||
        points.current === ResizePoints.BottomRight
      ) {
        resizedWidth = e.clientX - clientX.current + elementWidth.current;
      } else {
        resizedWidth = clientX.current - e.clientX + elementWidth.current;
      }
      onResize(Math.round(Math.max(resizedWidth, minWidth)));
    },
    [minWidth, onResize],
  );

  // 鼠标释放事件处理
  const handleMouseUp = useCallback(() => {
    resizing.current = false;
  }, []);

  // 添加和移除全局事件监听
  useEffect(() => {
    if (disabled) {
      return () => {};
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [disabled, handleMouseMove, handleMouseUp]);

  return {
    handleMouseDown,
  };
};

/**
 * 可调整大小组件
 * 用于包装可调整大小的元素
 */
const Resizable: React.FC<ResizableProps> = ({
  className,
  minWidth = RESIZABLE_MIN_WIDTH,
  disabled,
  selected,
  full,
  getElementRect,
  onResize,
  style,
  children,
}) => {
  const { handleMouseDown } = useResizable({
    minWidth,
    disabled,
    getElementRect,
    onResize,
  });

  // 是否可以调整大小
  const canResize = selected && !disabled && !full;

  // 所有调整点
  const resizePoints = [
    ResizePoints.TopLeft,
    ResizePoints.TopRight,
    ResizePoints.BottomRight,
    ResizePoints.BottomLeft,
  ];

  return (
    <div
      style={style}
      className={cx(
        `${prefix}-resizer`,
        selected && !disabled && `${prefix}-resizer__selected`,
        full && `${prefix}-resizer__full`,
        className,
      )}
    >
      {children}
      {canResize &&
        resizePoints.map((resizer) => (
          <span
            key={resizer}
            className={cx(`${prefix}-resizer-point`, resizer)}
            onMouseDown={(e) => handleMouseDown(e, resizer)}
          />
        ))}
    </div>
  );
};

export default Resizable;
