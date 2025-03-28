import React, { useRef } from 'react';
import type { JSONContent } from '@tiptap/core';
import { ReactComponent as FileSvg } from '@/assets/icons/file.svg';
import { useEditorContext, useLocale } from '@/context';
import MenuButton from '@/components/MenuButton';
import File, { type FileProps } from '@/components/MediaType/File';

const useFileUpload = (props: FileProps) => {
  const editor = useEditorContext();
  const locale = useLocale();
  const fileInput = useRef<HTMLInputElement | null>(null);

  const isDisabled = !editor?.isEditable;

  const openFileDialog = () => {
    fileInput.current?.click();
  };

  const insertFiles = async (files: JSONContent[]) => {
    editor
      ?.chain()
      .focus()
      .command(({ commands }) => commands.insertContent(files))
      .command(({ commands }) => commands.createParagraphNear())
      .run();
  };

  return {
    fileInput,
    isDisabled,
    openFileDialog,
    insertFiles,
    tooltip: locale.file,
    fileProps: props,
  };
};

const MenuButtonFile: React.FC<FileProps> = (props) => {
  const {
    fileInput,
    isDisabled,
    openFileDialog,
    insertFiles,
    tooltip,
    fileProps,
  } = useFileUpload(props);

  return (
    <>
      <MenuButton
        tooltip={tooltip}
        icon={<FileSvg />}
        disabled={isDisabled}
        onClick={openFileDialog}
      />
      <File {...fileProps} ref={fileInput} onChange={insertFiles} />
    </>
  );
};

export default MenuButtonFile;
