import React, { useState, useMemo, useEffect, useRef } from 'react';
import { BubbleMenu } from '@tiptap/react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { prefix } from '@/constants';
import { useEditorContext, useLocale } from '@/context';
import Divider from '@/menus/Divider';
import MenuButton from '../MenuButton';
import MenuContainer from '../MenuContainer';
import IframeEdit from './IframeEdit';

enum IframeMenuState {
  Edit = 'edit',
  Preview = 'preview',
}

const useIframeBubbleMenu = () => {
  const [state, setState] = useState<IframeMenuState>(IframeMenuState.Preview);
  const tippyRef = useRef<any>(null);
  const srcRef = useRef<string>('');

  const locale = useLocale();
  const editor = useEditorContext();

  // 获取当前iframe的src
  const currentSrc =
    (editor?.getAttributes('iframe').src as string | undefined) ?? '';
  if (currentSrc) {
    srcRef.current = currentSrc;
  }

  // tippy 插件，用于保存 tippy 实例
  const tippyPlugin = useMemo(
    () => ({
      fn(instance: any) {
        return {
          onCreate() {
            tippyRef.current = instance;
          },
          onDestroy() {
            tippyRef.current = null;
          },
        };
      },
    }),
    [],
  );

  // 处理Escape键关闭菜单
  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'escape' && tippyRef.current) {
      tippyRef.current.hide();
    }
  };

  // 切换到编辑状态
  const switchToEdit = () => {
    setState(IframeMenuState.Edit);
    if (tippyRef.current) {
      tippyRef.current.hide();
      tippyRef.current.show();
    }
  };

  // 删除iframe
  const deleteIframe = () => {
    editor?.commands.deleteSelection();
  };

  // 关闭菜单
  const closeMenu = () => {
    if (tippyRef.current) {
      tippyRef.current.hide();
    }
  };

  // 保存并返回预览
  const saveAndPreview = () => {
    if (tippyRef.current) {
      tippyRef.current.hide();
      tippyRef.current.show();
    }
    setState(IframeMenuState.Preview);
  };

  // 添加和移除键盘事件监听
  useEffect(() => {
    if (state === IframeMenuState.Edit) {
      document.addEventListener('keydown', handleEscapeKey, false);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey, false);
    };
  }, [state]);

  // 气泡菜单配置
  const bubbleMenuOptions = {
    shouldShow: () =>
      (editor?.isEditable && editor?.isActive('iframe')) ?? false,
    tippyOptions: {
      duration: 200,
      placement: 'bottom',
      animation: 'shift-away',
      offset: [0, 4],
      zIndex: 2,
      onHidden: () => setState(IframeMenuState.Preview),
      plugins: [tippyPlugin],
    },
  };

  return {
    state,
    editor,
    locale,
    srcRef,
    bubbleMenuOptions,
    switchToEdit,
    deleteIframe,
    closeMenu,
    saveAndPreview,
  };
};

/**
 * iframe预览组件
 */
const IframePreview: React.FC<{
  src: string;
  locale: any;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ src, locale, onEdit, onDelete }) => (
  <div className={`${prefix}-iframe-preview`}>
    <a
      href={src}
      target="_blank"
      title={src}
      draggable="false"
      rel="noopener noreferrer"
    >
      {src}
    </a>
    <MenuContainer>
      <Divider />
      <MenuButton
        tooltip={locale.edit}
        icon={<EditOutlined />}
        onClick={onEdit}
      />
      <MenuButton
        tooltip={locale.delete}
        icon={<DeleteOutlined />}
        onClick={onDelete}
      />
    </MenuContainer>
  </div>
);

/**
 * iframe气泡菜单组件
 * 用于编辑和管理iframe元素
 */
const IframeBubbleMenu: React.FC = () => {
  const {
    state,
    editor,
    locale,
    srcRef,
    bubbleMenuOptions,
    switchToEdit,
    deleteIframe,
    closeMenu,
    saveAndPreview,
  } = useIframeBubbleMenu();

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={bubbleMenuOptions.shouldShow}
      // @ts-ignore
      tippyOptions={bubbleMenuOptions.tippyOptions}
    >
      {state === IframeMenuState.Preview ? (
        <IframePreview
          src={srcRef.current}
          locale={locale}
          onEdit={switchToEdit}
          onDelete={deleteIframe}
        />
      ) : (
        <IframeEdit
          className={`${prefix}-iframe--float`}
          title={locale.editIframe}
          src={srcRef.current}
          onCancel={closeMenu}
          onOk={saveAndPreview}
        />
      )}
    </BubbleMenu>
  );
};

export default IframeBubbleMenu;
