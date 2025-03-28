import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  isValidElement,
  type DependencyList,
} from 'react';

import {
  useEditor,
  EditorContent,
  type Editor as EditorType,
  type EditorOptions,
  type Content,
  type Extension,
} from '@tiptap/react';

import cx from 'classnames';

import useExtensions from './extensions';
import MenuBar from './components/MenuBar';
import LinkBubbleMenu from './components/LinkBubbleMenu';
import IframeBubbleMenu from './components/IframeBubbleMenu';
import TextBubbleMenu from './components/TextBubbleMenu';
import TableBubbleMenu from './components/TableBubbleMenu';
import TableContextMenu from './components/TableBubbleMenu/ContextMenu';
import { EditorContext } from './context';
import { prefix } from './constants';
import { mergeExtension } from './utils';

export type EditorRef = {
  editor: EditorType | null;
  getJSON: () => Content;
  getHTML: () => Content;
  getText: () => Content;
  setContent: (content: Content) => void;
  clearContent: () => void;
  setEditable: (v: boolean) => void;
};

export interface EditorProps extends Partial<EditorOptions> {
  readonly?: boolean;
  placeholder?: string;
  editorDependencies?: DependencyList;
  className?: string;
  style?: React.CSSProperties;
  useTextMenu?: boolean;
  renderMenus?: (editor: EditorType | null) => React.ReactNode;
  renderFloatMenus?: (editor: EditorType | null) => React.ReactNode;
}

const useEditorSetup = (props: EditorProps) => {
  const {
    readonly = false,
    editable = true,
    editorDependencies = [],
    extensions = [],
    placeholder = '',
    content,
  } = props;

  const defaultExtensions = useExtensions({
    placeholder: placeholder || 'Please enter content',
  });

  const editor = useEditor(
    {
      content,
      extensions: mergeExtension(
        defaultExtensions as Extension[],
        extensions as Extension[],
      ),
    },
    editorDependencies,
  );

  // 处理编辑状态
  useEffect(() => {
    editor?.setEditable(readonly ? false : editable);
  }, [readonly, editable, editor]);

  return editor;
};

const Editor = forwardRef<EditorRef, EditorProps>((props, ref) => {
  const {
    readonly = false,
    editable = true,
    useTextMenu = false,
    className,
    style,
    renderMenus,
    renderFloatMenus,
  } = props;

  const editor = useEditorSetup(props);
  const floatMenu = renderFloatMenus?.(editor);

  // 暴露编辑器方法
  useImperativeHandle(ref, () => ({
    editor,
    getJSON: () => editor?.getJSON() ?? null,
    getHTML: () => editor?.getHTML() ?? null,
    getText: () => editor?.getText() ?? null,
    setContent: (content: Content) => editor?.commands.setContent(content),
    clearContent: () => editor?.commands.clearContent(),
    setEditable: (v: boolean) => editor?.setEditable(v),
  }));

  const showTextBubbleMenu =
    editable && (useTextMenu || isValidElement(floatMenu));

  return (
    <EditorContext.Provider value={editor}>
      <div
        style={style}
        className={cx(className, {
          [`${prefix}`]: true,
          [`${prefix}-disabled`]: !editable,
        })}
      >
        {!readonly && <MenuBar>{renderMenus?.(editor)}</MenuBar>}
        <EditorContent className={`${prefix}-content`} editor={editor} />

        <LinkBubbleMenu />
        <IframeBubbleMenu />
        <TableBubbleMenu />
        <TableContextMenu />
        {showTextBubbleMenu && <TextBubbleMenu />}
        {floatMenu}
      </div>
    </EditorContext.Provider>
  );
});

export default Editor;
