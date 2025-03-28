import React, { useRef } from 'react';
import type { JSONContent } from '@tiptap/core';
import { VideoCameraAddOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButton from '@/components/MenuButton';
import Video, { type VideoProps } from '@/components/MediaType/Video';

const useVideoUpload = (props: VideoProps) => {
  const editor = useEditorContext();
  const locale = useLocale();
  const fileInput = useRef<HTMLInputElement | null>(null);

  const isDisabled = !editor?.isEditable;

  const openFileDialog = () => {
    fileInput.current?.click();
  };

  const insertVideos = async (files: JSONContent[]) => {
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
    insertVideos,
    tooltip: locale.video,
    videoProps: props,
  };
};

const MenuButtonVideo: React.FC<VideoProps> = (props) => {
  const {
    fileInput,
    isDisabled,
    openFileDialog,
    insertVideos,
    tooltip,
    videoProps,
  } = useVideoUpload(props);

  return (
    <>
      <MenuButton
        tooltip={tooltip}
        icon={<VideoCameraAddOutlined />}
        disabled={isDisabled}
        onClick={openFileDialog}
      />
      <Video {...videoProps} ref={fileInput} onChange={insertVideos} />
    </>
  );
};

export default MenuButtonVideo;
