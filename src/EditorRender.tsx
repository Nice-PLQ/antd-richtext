import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
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
import { EditorContext } from './context';
import { prefix } from './constants';
import { mergeExtension } from './utils';

export type EditorRenderRef = {
  editor: EditorType | null;
  getJSON: () => Content;
  getHTML: () => Content;
  getText: () => Content;
  setContent: (content: Content) => void;
  clearContent: () => void;
};

export interface EditorProps extends Partial<EditorOptions> {
  editorDependencies?: DependencyList;
  className?: string;
  style?: React.CSSProperties;
}

const EditorRender = forwardRef<EditorRenderRef, EditorProps>((props, ref) => {
  const {
    editorDependencies = [],
    extensions = [],
    editable = true,
    className,
    style,
    ...editorProps
  } = props;

  const defaultExtensions = useExtensions({
    placeholder: '',
  });

  const editor = useEditor(
    {
      extensions: mergeExtension(
        defaultExtensions as Extension[],
        extensions as Extension[],
      ),
      ...editorProps,
    },
    editorDependencies,
  );

  useImperativeHandle(ref, () => ({
    editor,
    getJSON: () => editor?.getJSON() ?? null,
    getHTML: () => editor?.getHTML() ?? null,
    getText: () => editor?.getText() ?? null,
    setContent: (content: Content) => {
      editor?.commands.setContent(content);
      /**
       * 渲染模式下，editable默认也要为true，等设置content后，再改为false
       * bug issue：https://github.com/ueberdosis/tiptap/issues/4872
       */
      editor?.setEditable(false);
    },
    clearContent: () => editor?.commands.clearContent(),
  }));

  useEffect(() => {
    if (!editor || editor.isDestroyed || editor.isEditable === editable) {
      return;
    }
    editor.setEditable(editable);
  }, [editable, editor]);

  const previousContent = useRef(props.content);
  useEffect(() => {
    if (
      !editor ||
      editor.isDestroyed ||
      props.content === undefined ||
      props.content === previousContent.current
    ) {
      return;
    }

    if (props.content !== undefined) {
      editor.commands.setContent(props.content);
      editor?.setEditable(false);
    }
  }, [props.content, editor]);

  useEffect(() => {
    if (props.content !== undefined) {
      editor.commands.setContent(props.content);
      editor?.setEditable(false);
    }

    // 移除翻译属性
    const editorRender = document.querySelector(
      `#${prefix}-render > [translate="no"]`,
    );
    if (editorRender) {
      editorRender.removeAttribute('translate');
    }
  }, []);

  return (
    <EditorContext.Provider value={editor}>
      <div
        style={style}
        className={cx(className, {
          [`${prefix}`]: true,
          [`${prefix}-readonly`]: true,
        })}
      >
        <EditorContent
          id={`${prefix}-render`}
          className={`${prefix}-content`}
          editor={editor}
        />
      </div>
    </EditorContext.Provider>
  );
});

export default EditorRender;
