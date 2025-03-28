import React from 'react';
import { useEditor } from '@tiptap/react';
import { EditorContext } from '@/context';
import useExtensions from '@/extensions';
import { TableOfContents } from '@/extensions/TableOfContents';
import FileHandler from '@/extensions/FileHandler';

const RenderComponent: React.FC = ({ children }) => {
  const extensions = useExtensions({
    placeholder: 'Please enter content',
  });
  const editor = useEditor({
    extensions: [
      ...extensions,
      TableOfContents,
      FileHandler.configure({
        onDrop: () => {},
        onPaste: () => {},
      }),
    ],
  });

  return (
    <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
  );
};

export default RenderComponent;
