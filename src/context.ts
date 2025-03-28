import { createContext, useContext } from 'react';
import type { Editor } from '@tiptap/react';
import { LocaleContext } from './i18n';
import zh_CN from './i18n/locale/zh_CN';
import { prefix } from './constants';

export const EditorContext = createContext<Editor | null | undefined>(
  undefined,
);

export function useEditorContext(): Editor | null {
  const editor = useContext(EditorContext);
  if (editor === undefined) {
    throw new Error(
      `${prefix} editor not found in component context. Be sure to use <EditorContext editor={editor} />!`,
    );
  }

  return editor;
}

export function useLocale() {
  const locale = useContext(LocaleContext);
  return locale?.messages ?? zh_CN.messages;
}
