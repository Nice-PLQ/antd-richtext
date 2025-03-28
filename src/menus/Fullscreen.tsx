import React, { useState, useEffect } from 'react';
import { Tooltip, Button } from 'antd/es';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';

interface FullscreenProps {
  onFullscreenChange?: (fullscreen: boolean) => void;
}

const useFullscreen = (onFullscreenChange?: (fullscreen: boolean) => void) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const editor = useEditorContext();
  const locale = useLocale();

  // 切换全屏状态
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
    setTooltipVisible(false);
  };

  // 显示/隐藏提示
  const showTooltip = () => setTooltipVisible(true);
  const hideTooltip = () => setTooltipVisible(false);

  // 处理ESC键退出全屏
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'escape') {
        setFullscreen(false);
      }
    };

    const editorElement = editor?.options.element.parentElement;
    if (!editorElement) {
      return () => {};
    }

    if (fullscreen) {
      editorElement.classList.add('fullscreen');
      document.addEventListener('keydown', handleEscKey, false);
    } else {
      editorElement.classList.remove('fullscreen');
    }

    onFullscreenChange?.(fullscreen);

    return () => {
      document.removeEventListener('keydown', handleEscKey, false);
    };
  }, [fullscreen, editor, onFullscreenChange]);

  return {
    fullscreen,
    tooltipVisible,
    toggleFullscreen,
    showTooltip,
    hideTooltip,
    tooltipTitle: fullscreen ? locale.cancelFullscreen : locale.fullscreen,
  };
};

const MenuButtonFullscreen: React.FC<FullscreenProps> = ({
  onFullscreenChange,
}) => {
  const {
    fullscreen,
    tooltipVisible,
    toggleFullscreen,
    showTooltip,
    hideTooltip,
    tooltipTitle,
  } = useFullscreen(onFullscreenChange);

  return (
    <Tooltip title={tooltipTitle} open={tooltipVisible}>
      <Button
        icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        size="small"
        type="text"
        onClick={toggleFullscreen}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      />
    </Tooltip>
  );
};

export default MenuButtonFullscreen;
