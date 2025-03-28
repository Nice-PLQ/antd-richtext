import React, { useState, useMemo, useEffect, useRef } from 'react';
import { BubbleMenu } from '@tiptap/react';
import { DisconnectOutlined, EditOutlined } from '@ant-design/icons';
import { getLinkText } from '@/utils';
import { prefix } from '@/constants';
import { useEditorContext, useLocale } from '@/context';
import Divider from '@/menus/Divider';
import MenuButton from '../MenuButton';
import MenuContainer from '../MenuContainer';
import LinkEdit from './LinkEdit';

enum LinkMenuState {
  Edit = 'edit',
  Preview = 'preview',
}

const useLinkBubbleMenu = () => {
  const [state, setState] = useState<LinkMenuState>(LinkMenuState.Preview);
  const tippyRef = useRef<any>(null);
  const hrefRef = useRef<string>('');

  const locale = useLocale();
  const editor = useEditorContext();

  // 获取链接文本和属性
  const linkText = getLinkText(editor);
  const linkAttrs = editor?.getAttributes('link');
  const currentHref = (linkAttrs.href as string | undefined) ?? '';
  const currentTarget = (linkAttrs.target as string | undefined) ?? '';

  // 保存当前链接地址
  if (currentHref) {
    hrefRef.current = currentHref;
  }

  // 取消链接
  const handleUnlink = () => {
    editor
      ?.chain()
      .extendMarkRange('link')
      .unsetLink()
      .setTextSelection(editor?.state.selection.to)
      .focus()
      .run();
  };

  // 切换到编辑状态
  const switchToEdit = () => {
    setState(LinkMenuState.Edit);
    if (tippyRef.current) {
      tippyRef.current.hide();
      tippyRef.current.show();
    }
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
    setState(LinkMenuState.Preview);
  };

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

  // 添加和移除键盘事件监听
  useEffect(() => {
    if (state === LinkMenuState.Edit) {
      document.addEventListener('keydown', handleEscapeKey, false);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey, false);
    };
  }, [state]);

  // 气泡菜单配置
  const bubbleMenuOptions = {
    shouldShow: () => (editor?.isEditable && editor?.isActive('link')) ?? false,
    tippyOptions: {
      duration: 200,
      placement: 'bottom',
      animation: 'shift-away',
      offset: [0, 2],
      zIndex: 2,
      onHidden: () => setState(LinkMenuState.Preview),
      plugins: [tippyPlugin],
    },
  };

  return {
    state,
    editor,
    locale,
    hrefRef,
    linkText,
    currentTarget,
    bubbleMenuOptions,
    handleUnlink,
    switchToEdit,
    closeMenu,
    saveAndPreview,
  };
};

const LinkPreview: React.FC<{
  href: string;
  locale: any;
  onEdit: () => void;
  onUnlink: () => void;
}> = ({ href, locale, onEdit, onUnlink }) => (
  <div className={`${prefix}-link-preview`}>
    <a
      href={href}
      target="_blank"
      title={href}
      draggable="false"
      rel="noopener noreferrer"
    >
      {href}
    </a>
    <MenuContainer>
      <Divider />
      <MenuButton
        tooltip={locale.edit}
        icon={<EditOutlined />}
        onClick={onEdit}
      />
      <MenuButton
        tooltip={locale.unLink}
        icon={<DisconnectOutlined />}
        onClick={onUnlink}
      />
    </MenuContainer>
  </div>
);

const LinkBubbleMenu: React.FC = () => {
  const {
    state,
    editor,
    locale,
    hrefRef,
    linkText,
    currentTarget,
    bubbleMenuOptions,
    handleUnlink,
    switchToEdit,
    closeMenu,
    saveAndPreview,
  } = useLinkBubbleMenu();

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
      {state === LinkMenuState.Preview ? (
        <LinkPreview
          href={hrefRef.current}
          locale={locale}
          onEdit={switchToEdit}
          onUnlink={handleUnlink}
        />
      ) : (
        <LinkEdit
          className={`${prefix}-link--float`}
          title={locale.editLink}
          linkText={linkText}
          href={hrefRef.current}
          target={currentTarget}
          onCancel={closeMenu}
          onOk={saveAndPreview}
        />
      )}
    </BubbleMenu>
  );
};

export default LinkBubbleMenu;
