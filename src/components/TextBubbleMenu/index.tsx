import React, { useMemo, useRef, useCallback } from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import { BubbleMenu } from '@tiptap/react';
import type { Editor } from '@tiptap/core';
import { EditorState } from '@tiptap/pm/state';
import { EditorView } from '@tiptap/pm/view';
import { CellSelection } from '@tiptap/pm/tables';
import LinkNode from '@tiptap/extension-link';
import { prefix } from '@/constants';
import {
  FontSize,
  Bold,
  Italic,
  Strike,
  Underline,
  Color,
  HighlightColor,
  LineHeight,
  Link,
} from '@/menus';
import CodeBlock from '@/extensions/CodeBlock';
import File from '@/extensions/File';
import Image from '@/extensions/Image';
import Video from '@/extensions/Video';
import Iframe from '@/extensions/Iframe';
import { isTextSelected } from '@/utils/text';
import { ReactComponent as SubSvg } from '@/assets/icons/sub.svg';
import { ReactComponent as SuperSvg } from '@/assets/icons/super.svg';
import { ReactComponent as CodeSvg } from '@/assets/icons/code.svg';
import { useEditorContext, useLocale } from '@/context';
import MenuContainer from '../MenuContainer';
import MenuButtonDropdown from '../MenuButton/Dropdown';

/**
 * 气泡菜单显示条件参数接口
 */
interface ShouldShowProps {
  editor?: Editor;
  view: EditorView;
  state?: EditorState;
  oldState?: EditorState;
  from?: number;
  to?: number;
}

/**
 * 需要忽略的节点类型
 */
const IgnoreNode = [
  CodeBlock.name,
  File.name,
  Image.name,
  Video.name,
  Iframe.name,
  LinkNode.name,
];

/**
 * 使用文本气泡菜单的自定义Hook
 * @returns 文本气泡菜单相关状态和操作
 */
const useTextBubbleMenu = () => {
  const tippyRef = useRef<any>(null);
  const editor = useEditorContext();
  const locale = useLocale();

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

  // 判断是否应该显示气泡菜单
  const shouldShow = useCallback(
    ({ view, from }: ShouldShowProps) => {
      if (!view || !editor || !from) {
        return false;
      }

      const domNode = view.domAtPos(from).node as unknown as HTMLElement;

      // 不在搜索结果中显示
      if (domNode.querySelector?.('.search-result')) {
        return false;
      }

      // 不在特定节点中显示
      if (IgnoreNode.some((type) => editor.isActive(type))) {
        return false;
      }

      const { selection } = editor.state;
      // 不在表格选择中显示
      // @ts-ignore
      if (selection instanceof CellSelection || selection.jsonID === 'cell') {
        return false;
      }

      // 只在文本选中时显示
      return isTextSelected({ editor });
    },
    [editor],
  );

  // 执行编辑器命令
  const executeCommand = useCallback(
    (command: string) => {
      editor?.chain().focus()[command]().run();
    },
    [editor],
  );

  return {
    editor,
    locale,
    tippyPlugin,
    shouldShow,
    executeCommand,
  };
};

const DropdownItem = MenuButtonDropdown.Item;

/**
 * 文本气泡菜单组件
 * 用于提供文本编辑相关操作的浮动菜单
 */
const TextBubbleMenu: React.FC = () => {
  const { editor, locale, tippyPlugin, shouldShow, executeCommand } =
    useTextBubbleMenu();

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={{
        duration: 200,
        placement: 'bottom',
        animation: 'shift-away',
        offset: [0, 4],
        zIndex: 3,
        plugins: [tippyPlugin],
      }}
    >
      <div className={`${prefix}-text-bubble-menu`}>
        <MenuContainer>
          <FontSize />
          <Bold />
          <Italic />
          <Strike />
          <Underline />
          <Color />
          <HighlightColor />
          <LineHeight />
          <Link />
          <MenuButtonDropdown
            tooltip={locale.more}
            activeIcon={<EllipsisOutlined />}
            disabled={false}
            arrow={false}
            className={`${prefix}-menu__more`}
          >
            <DropdownItem
              key="code"
              icon={<CodeSvg />}
              selected={editor.isActive('code')}
              disabled={!editor.isEditable || !editor.can().toggleCode()}
              label={locale.code}
              onClick={() => executeCommand('toggleCode')}
            />

            <DropdownItem
              key="subscript"
              icon={<SubSvg />}
              selected={editor.isActive('subscript')}
              disabled={!editor.isEditable || !editor.can().toggleSubscript()}
              label={locale.subscript}
              onClick={() => executeCommand('toggleSubscript')}
            />

            <DropdownItem
              key="superscript"
              icon={<SuperSvg />}
              selected={editor.isActive('superscript')}
              disabled={!editor.isEditable || !editor.can().toggleSuperscript()}
              label={locale.superscript}
              onClick={() => executeCommand('toggleSuperscript')}
            />
          </MenuButtonDropdown>
        </MenuContainer>
      </div>
    </BubbleMenu>
  );
};

export default TextBubbleMenu;
