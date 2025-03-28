import React, {
  useState,
  useRef,
  useEffect,
  MouseEvent as ReactMouseEvent,
} from 'react';

// 边界偏移量
const OFFSET = 10;

/**
 * 拖拽位置接口
 */
interface Position {
  left: number;
  top: number;
}

/**
 * 拖拽功能Hook返回值接口
 */
interface DraggingResult {
  /** 是否正在拖拽中 */
  dragging: boolean;
  /** 当前位置 */
  position: Position | undefined;
  /** 重置位置方法 */
  resetPosition: () => void;
  /** 鼠标按下事件处理函数 */
  onMouseDown: (e: ReactMouseEvent<HTMLDivElement>) => void;
  /** 鼠标释放事件处理函数 */
  onMouseUp: () => void;
}

/**
 * 拖拽功能Hook
 * @param container 容器引用
 * @returns 拖拽相关状态和方法
 */
export default function useDragging(
  container: React.RefObject<HTMLDivElement>,
): DraggingResult {
  const [dragging, setDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<Position | undefined>(undefined);

  const isDragging = useRef<boolean>(false);
  const x = useRef<number>(0);
  const y = useRef<number>(0);

  /**
   * 鼠标按下事件处理
   */
  const onMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!container.current) {
      return;
    }

    isDragging.current = true;
    x.current = e.clientX - container.current.offsetLeft;
    y.current = e.clientY - container.current.offsetTop;
    setDragging(true);
  };

  /**
   * 鼠标移动事件处理
   */
  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !container.current) {
      return;
    }

    let left = e.clientX - x.current;
    let top = e.clientY - y.current;
    const { offsetHeight, offsetWidth } = container.current;

    // 限制左边界
    if (left < OFFSET) {
      left = OFFSET;
    }
    // 限制右边界
    else if (left > window.innerWidth - offsetWidth - OFFSET) {
      left = window.innerWidth - offsetWidth - OFFSET;
    }

    // 限制上边界
    if (top < OFFSET) {
      top = OFFSET;
    }
    // 限制下边界
    else if (top > window.innerHeight - offsetHeight - OFFSET) {
      top = window.innerHeight - offsetHeight - OFFSET;
    }

    setPosition({ left, top });
  };

  /**
   * 鼠标释放事件处理
   */
  const onMouseUp = () => {
    isDragging.current = false;
    setDragging(false);
  };

  /**
   * 重置位置
   */
  const resetPosition = () => {
    setPosition(undefined);
    x.current = 0;
    y.current = 0;
  };

  // 添加和移除鼠标移动事件监听
  useEffect(() => {
    if (!isDragging.current) {
      return () => {};
    }

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [isDragging.current]);

  return { dragging, position, resetPosition, onMouseDown, onMouseUp };
}
