import { useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import type { JSONContent } from '@tiptap/core';
import { v4 as uuid } from 'uuid';
import { message } from 'antd/es';
import { prettyBytes } from '@/utils';
import { useEditorContext, useLocale } from '@/context';

export type ImageNodeAttributes = {
  /** 图片源地址 */
  src: string;
  /** 图片替代文本 */
  alt?: string;
  /** 图片标题 */
  title?: string;
};

interface FileData {
  /** 文件对象 */
  file: File;
  /** 文件唯一标识 */
  fileUid: string;
  /** 上传进度回调 */
  onProgress?: (percent: number) => void;
  /** 上传成功回调 */
  onSuccess: (attrs: ImageNodeAttributes) => void;
}

export interface ImageProps {
  /** 图片变更回调 */
  onChange?: (image: JSONContent[]) => void;
  /** 上传前检查 */
  beforeUpload?: (files: File[]) => boolean | Promise<void>;
  /** 自定义上传 */
  onUploadFile?: (fileData: FileData) => void;
  /** 上传地址 */
  uploadAction?: string;
  /** 最大上传大小 */
  maxSize?: number;
}

export interface ImageRef {
  /** 触发文件选择 */
  click: () => void;
}

/**
 * 使用图片上传功能的自定义Hook
 * @returns 图片上传相关状态和操作
 */
const useImageUpload = (props: ImageProps) => {
  const { uploadAction, maxSize, beforeUpload, onUploadFile, onChange } = props;

  const editor = useEditorContext();
  const locale = useLocale();

  /**
   * 处理图片插入
   * @param files 文件列表
   */
  const handleInsertImages = useCallback(
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
          locale.imageLimit.replace('{limit}', prettyBytes(maxSize)),
        );
        return;
      }

      // 构建图片内容
      const imageContent: JSONContent[] = fileList
        .map((file) => {
          const fileUid = uuid();
          return {
            fileUid,
            src: URL.createObjectURL(file),
            alt: file.name,
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
        .filter(({ src }) => !!src)
        .map((attrs) => ({
          type: editor.schema.nodes.image.name,
          attrs,
        }));

      onChange?.(imageContent);
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
    handleInsertImages,
  };
};

const Image = forwardRef<ImageRef, ImageProps>((props, ref) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { handleInsertImages } = useImageUpload(props);

  // 暴露点击方法
  useImperativeHandle(ref, () => ({
    click: () => fileInputRef.current?.click(),
  }));

  return (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      multiple
      onChange={async (event) => {
        if (event.target.files) {
          handleInsertImages(event.target.files);
        }
        // 重置输入框值，允许重复选择相同文件
        // eslint-disable-next-line no-param-reassign
        event.target.value = '';
      }}
      style={{ display: 'none' }}
    />
  );
});

export default Image;
