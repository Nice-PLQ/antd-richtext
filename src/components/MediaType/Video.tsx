import { useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import type { JSONContent } from '@tiptap/core';
import { v4 as uuid } from 'uuid';
import { message } from 'antd/es';
import { prettyBytes } from '@/utils';
import { useEditorContext, useLocale } from '@/context';

export type VideoNodeAttributes = {
  /** 视频源地址 */
  src: string;
};

interface FileData {
  /** 文件对象 */
  file: File;
  /** 文件唯一标识 */
  fileUid: string;
  /** 上传进度回调 */
  onProgress?: (percent: number) => void;
  /** 上传成功回调 */
  onSuccess: (attrs: VideoNodeAttributes) => void;
}

export interface VideoProps {
  /** 视频变更回调 */
  onChange?: (video: JSONContent[]) => void;
  /** 上传前检查 */
  beforeUpload?: (files: File[]) => boolean | Promise<void>;
  /** 自定义上传 */
  onUploadFile?: (fileData: FileData) => void;
  /** 上传地址 */
  uploadAction?: string;
  /** 最大上传大小 */
  maxSize?: number;
}

export interface VideoRef {
  /** 触发文件选择 */
  click: () => void;
}

const useVideoUpload = (props: VideoProps) => {
  const { uploadAction, maxSize, beforeUpload, onUploadFile, onChange } = props;

  const editor = useEditorContext();
  const locale = useLocale();

  /**
   * 处理视频插入
   * @param files 文件列表
   */
  const handleInsertVideos = useCallback(
    async (files: FileList) => {
      if (!editor || editor.isDestroyed || files.length === 0) {
        return;
      }

      const fileList = Array.from(files);

      // 执行上传前检查
      if (typeof beforeUpload === 'function') {
        const canUpload = await beforeUpload(fileList);
        if (!canUpload) {
          return;
        }
      }

      // 检查文件大小
      if (maxSize && fileList.some((file) => file.size > maxSize)) {
        message.warning(
          locale.videoLimit.replace('{limit}', prettyBytes(maxSize)),
        );
        return;
      }

      // 构建视频内容
      const videoContent: JSONContent[] = fileList
        .map((file) => {
          const fileUid = uuid();
          return {
            fileUid,
            rowFile: file,
            uploadAction,
            uploadFileHandler: onUploadFile
              ? (config: Omit<FileData, 'file' | 'fileUid'>) =>
                  onUploadFile({
                    file,
                    fileUid,
                    ...config,
                  })
              : undefined,
          };
        })
        .map((attrs) => ({
          type: editor.schema.nodes.video.name,
          attrs,
        }));

      onChange?.(videoContent);
    },
    [
      editor,
      beforeUpload,
      maxSize,
      locale,
      uploadAction,
      onUploadFile,
      onChange,
    ],
  );

  return {
    handleInsertVideos,
  };
};

/**
 * 视频上传组件
 * 用于处理视频上传和插入
 */
const Video = forwardRef<VideoRef, VideoProps>((props, ref) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { handleInsertVideos } = useVideoUpload(props);

  // 暴露点击方法
  useImperativeHandle(ref, () => ({
    click: () => fileInputRef.current?.click(),
  }));

  return (
    <input
      ref={fileInputRef}
      type="file"
      accept="video/mp4,video/webm"
      multiple
      onChange={async (event) => {
        if (event.target.files) {
          handleInsertVideos(event.target.files);
        }
        // 重置输入框值，允许重复选择相同文件
        // eslint-disable-next-line no-param-reassign
        event.target.value = '';
      }}
      style={{ display: 'none' }}
    />
  );
});

export default Video;
