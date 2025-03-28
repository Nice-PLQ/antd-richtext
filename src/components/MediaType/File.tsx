import { useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import type { JSONContent } from '@tiptap/core';
import { v4 as uuid } from 'uuid';
import { message } from 'antd/es';
import { prettyBytes } from '@/utils';
import { useEditorContext, useLocale } from '@/context';

export type FileNodeAttributes = {
  /** 文件源地址 */
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
  onSuccess: (attrs: FileNodeAttributes) => void;
}

export interface FileProps {
  /** 文件变更回调 */
  onChange?: (file: JSONContent[]) => void;
  /** 上传前检查 */
  beforeUpload?: (files: File[]) => boolean | Promise<void>;
  /** 自定义上传 */
  onUploadFile?: (fileData: FileData) => void;
  /** 自定义下载 */
  onDownloadFile?: (fileData: {
    src: string;
    name: string;
    onProgress: (percent: number) => void;
  }) => void;
  /** 上传地址 */
  uploadAction?: string;
  /** 最大上传大小 */
  maxSize?: number;
}

export interface FileRef {
  /** 触发文件选择 */
  click: () => void;
}

const useFileUpload = (props: FileProps) => {
  const {
    uploadAction,
    maxSize,
    beforeUpload,
    onUploadFile,
    onDownloadFile,
    onChange,
  } = props;

  const editor = useEditorContext();
  const locale = useLocale();

  /**
   * 处理文件插入
   * @param files 文件列表
   */
  const handleInsertFiles = useCallback(
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
          locale.fileLimit.replace('{limit}', prettyBytes(maxSize)),
        );
        return;
      }

      // 构建文件内容
      const fileContent: JSONContent[] = fileList
        .map((file) => {
          const fileUid = uuid();
          return {
            fileUid,
            src: '',
            type: '',
            size: file.size,
            name: file.name,
            rowFile: file,
            uploadAction,
            downloadFileHandler: onDownloadFile,
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
        .filter(({ size }) => size > 0)
        .map((attrs) => ({
          type: editor.schema.nodes.file.name,
          attrs,
        }));

      onChange?.(fileContent);
    },
    [
      editor,
      beforeUpload,
      maxSize,
      locale,
      uploadAction,
      onDownloadFile,
      onUploadFile,
      onChange,
    ],
  );

  return {
    handleInsertFiles,
  };
};

const File = forwardRef<FileRef, FileProps>((props, ref) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { handleInsertFiles } = useFileUpload(props);

  // 暴露点击方法
  useImperativeHandle(ref, () => ({
    click: () => fileInputRef.current?.click(),
  }));

  return (
    <input
      ref={fileInputRef}
      type="file"
      multiple
      onChange={async (event) => {
        if (event.target.files) {
          handleInsertFiles(event.target.files);
        }
        // 重置输入框值，允许重复选择相同文件
        // eslint-disable-next-line no-param-reassign
        event.target.value = '';
      }}
      style={{ display: 'none' }}
    />
  );
});

export default File;
