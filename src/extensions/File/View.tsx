import { useState, useEffect, useMemo, useCallback } from 'react';
import cx from 'classnames';
import type { NodeViewProps } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { NodeViewWrapper } from '@tiptap/react';
import { Button, Tooltip, Progress } from 'antd/es';
import { prettyBytes } from '@/utils';
import { ReactComponent as PptSvg } from '@/assets/icons/ppt.svg';
import { ReactComponent as DownloadSvg } from '@/assets/icons/download.svg';
import { ReactComponent as PdfSvg } from '@/assets/icons/pdf.svg';
import { ReactComponent as DocSvg } from '@/assets/icons/doc.svg';
import { ReactComponent as XlsSvg } from '@/assets/icons/xls.svg';
import { ReactComponent as RarSvg } from '@/assets/icons/rar.svg';
import { ReactComponent as ZipSvg } from '@/assets/icons/zip.svg';
import { ReactComponent as CommonFileSvg } from '@/assets/icons/common-file.svg';
import { prefix } from '@/constants';
import { useLocale } from '@/context';
import {
  uploadFile as internalUploadFile,
  getFileExtension,
  filterDataHTMLAttributes,
  downloadFile,
  type UploadConfig,
} from '@/utils';
import type File from './index';

interface FileNodeAttributes extends Record<string, unknown> {
  /** 文件源地址 */
  src: string;
  /** 文件大小 */
  size: number;
  /** 文件名称 */
  name: string;
  /** 文件类型 */
  type: string;
  /** 原始文件对象 */
  rowFile?: File;
  /** 文件唯一标识 */
  fileUid: string;
  /** 上传地址 */
  uploadAction?: string;
  /** 上传文件处理函数 */
  uploadFileHandler?: (config: Omit<UploadConfig, 'file' | 'url'>) => void;
  /** 下载文件处理函数 */
  downloadFileHandler?: (data: {
    src: string;
    name: string;
    onProgress: (percent: number) => void;
  }) => void;
  /** 文本对齐方式 */
  textAlign?: string;
}

interface FileNode extends ProseMirrorNode {
  attrs: FileNodeAttributes;
}

interface FileViewProps extends NodeViewProps {
  /** 节点实例 */
  node: FileNode;
  // @ts-ignore
  extension: typeof File;
}

/**
 * 文件图标映射
 */
const fileIcon = {
  pdf: <PdfSvg />,
  ppt: <PptSvg />,
  pptx: <PptSvg />,
  doc: <DocSvg />,
  docx: <DocSvg />,
  xls: <XlsSvg />,
  xlsx: <XlsSvg />,
  rar: <RarSvg />,
  zip: <ZipSvg />,
};

const useFileView = (props: FileViewProps) => {
  const {
    node: { attrs },
    updateAttributes,
  } = props;

  const locale = useLocale();
  const [filePercent, setFilePercent] = useState<number>(0);

  // 格式化文件大小
  const fileSize = useMemo(() => prettyBytes(attrs.size), [attrs.size]);

  // 获取文件图标
  const icon = useMemo(() => {
    const extension = getFileExtension(attrs.name);
    if (extension) {
      const matchIcon = fileIcon[extension as keyof typeof fileIcon];
      return matchIcon ?? <CommonFileSvg />;
    }
    return <CommonFileSvg />;
  }, [attrs.name]);

  // 处理文件下载
  const handleDownload = useCallback(() => {
    const { src, name, downloadFileHandler } = attrs;
    if (typeof downloadFileHandler === 'function') {
      // 自定义下载
      downloadFileHandler({
        src,
        name,
        onProgress: (percent: number) => setFilePercent(percent),
      });
    } else {
      // 浏览器默认下载
      downloadFile(src, name);
    }
  }, [attrs]);

  // 处理文件上传
  useEffect(() => {
    const { rowFile, uploadAction, uploadFileHandler } = attrs;
    if (!rowFile) {
      return;
    }

    const config = {
      onProgress: (percent: number) => setFilePercent(percent),
      onSuccess: (attrs: FileNodeAttributes) =>
        updateAttributes({ ...attrs, rowFile: null }),
    };

    if (typeof uploadFileHandler === 'function') {
      // 自定义上传
      uploadFileHandler(config);
    } else if (uploadAction) {
      internalUploadFile({
        file: rowFile,
        url: uploadAction,
        ...config,
      });
    }
  }, [
    attrs.rowFile,
    attrs.uploadAction,
    attrs.uploadFileHandler,
    updateAttributes,
  ]);

  return {
    locale,
    filePercent,
    fileSize,
    icon,
    handleDownload,
  };
};

export default function FileView(props: FileViewProps) {
  const {
    node: { attrs },
    selected,
    editor,
    HTMLAttributes,
  } = props;

  const { locale, filePercent, fileSize, icon, handleDownload } =
    useFileView(props);

  return (
    <NodeViewWrapper
      className="block"
      style={{ textAlign: attrs.textAlign }}
      {...filterDataHTMLAttributes(HTMLAttributes)}
    >
      <div
        className={cx(`${prefix}-file`, {
          'ProseMirror-selectednode': selected && editor.isEditable,
          [`${prefix}-file__selected`]: selected && editor.isEditable,
        })}
        data-drag-handle
      >
        {icon}
        <div className={`${prefix}-file-info`}>
          <div className={`${prefix}-file-name`} title={attrs.name}>
            {attrs.name}
          </div>
          <div className={`${prefix}-file-size`}>{fileSize}</div>
        </div>

        {filePercent > 0 && filePercent < 100 && (
          <Progress type="circle" width={36} percent={filePercent} />
        )}

        {attrs.src && (
          <Tooltip title={locale.download}>
            <Button
              type="text"
              size="small"
              icon={<DownloadSvg />}
              onClick={handleDownload}
            />
          </Tooltip>
        )}
      </div>
    </NodeViewWrapper>
  );
}
