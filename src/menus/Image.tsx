import React, { useRef } from 'react';
import type { JSONContent } from '@tiptap/core';
import { PictureOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButton from '@/components/MenuButton';
import Image, { type ImageProps } from '@/components/MediaType/Image';

const useImageUpload = (props: ImageProps) => {
  const editor = useEditorContext();
  const locale = useLocale();
  const fileInput = useRef<HTMLInputElement | null>(null);

  const isDisabled = !editor?.isEditable;

  const openFileDialog = () => {
    fileInput.current?.click();
  };

  const insertImages = async (files: JSONContent[]) => {
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
    insertImages,
    tooltip: locale.image,
    imageProps: props,
  };
};

const MenuButtonImage: React.FC<ImageProps> = (props) => {
  const {
    fileInput,
    isDisabled,
    openFileDialog,
    insertImages,
    tooltip,
    imageProps,
  } = useImageUpload(props);

  return (
    <>
      <MenuButton
        tooltip={tooltip}
        icon={<PictureOutlined />}
        disabled={isDisabled}
        onClick={openFileDialog}
      />
      <Image {...imageProps} ref={fileInput} onChange={insertImages} />
    </>
  );
};

export default MenuButtonImage;
