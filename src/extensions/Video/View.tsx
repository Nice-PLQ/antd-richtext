import { useRef, useState, useEffect, useCallback } from 'react';
import cx from 'classnames';
import type { NodeViewProps } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { NodeViewWrapper } from '@tiptap/react';
import { Progress } from 'antd/es';
import { InfoCircleOutlined } from '@ant-design/icons';
import { prefix, defaultVideoWidth } from '@/constants';
import Resizable, { RESIZABLE_MIN_WIDTH } from '@/components/Resizable';
import MediaFloatMenu from '@/components/MediaFloatMenu';
import {
  uploadFile as internalUploadFile,
  filterDataHTMLAttributes,
  type UploadConfig,
} from '@/utils';
import { useLocale } from '@/context';
import type Video from './index';

interface VideoNodeAttributes extends Record<string, unknown> {
  /** 视频源地址 */
  src: string;
  /** 视频宽度 */
  width: number;
  /** 视频高度 */
  height?: number;
  /** 视频宽高比 */
  aspectRatio?: number;
  /** 原始文件对象 */
  rowFile?: File;
  /** 文件唯一标识 */
  fileUid: string;
  /** 是否在编辑器内全屏显示 */
  fullInEditor?: boolean;
  /** 上传地址 */
  uploadAction?: string;
  /** 上传文件处理函数 */
  uploadFileHandler?: (config: Omit<UploadConfig, 'file' | 'url'>) => void;
  /** 文本对齐方式 */
  textAlign?: string;
}

interface VideoNode extends ProseMirrorNode {
  attrs: VideoNodeAttributes;
}

/**
 * 视频视图属性接口
 */
interface VideoViewProps extends NodeViewProps {
  /** 节点实例 */
  node: VideoNode;
  // @ts-ignore
  extension: typeof Video;
}

const useVideoView = (props: VideoViewProps) => {
  const {
    node: { attrs },
    updateAttributes,
    extension,
  } = props;

  const locale = useLocale();
  const [uploadPercent, setUploadPercent] = useState<number>(0);
  const [canPlay, setCanPlay] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { inline, minWidth = RESIZABLE_MIN_WIDTH } = extension.options;

  // 处理视频可以播放事件
  const handleCanPlay = useCallback(
    (event: React.SyntheticEvent<HTMLVideoElement>) => {
      const { videoWidth, videoHeight } = event.currentTarget;
      const width = attrs.width ?? videoWidth;

      if (width) {
        updateAttributes({
          width: width > defaultVideoWidth ? defaultVideoWidth : width,
          aspectRatio: videoHeight > 0 ? videoWidth / videoHeight : null,
        });
      }
      setCanPlay(true);
    },
    [attrs.width, updateAttributes],
  );

  // 处理视频加载错误
  const handleError = useCallback(() => {
    setError(true);
  }, []);

  // 处理尺寸变更
  const handleSizeChange = useCallback(
    (width: number) => {
      updateAttributes({ width });
    },
    [updateAttributes],
  );

  // 获取元素矩形
  const getElementRect = useCallback(
    () => videoRef.current!.getBoundingClientRect(),
    [],
  );

  // 处理文件上传
  useEffect(() => {
    const { rowFile, uploadAction, uploadFileHandler } = attrs;
    if (!rowFile) {
      return;
    }

    const config = {
      onProgress: (percent: number) => setUploadPercent(percent),
      onSuccess: (attrs: VideoNodeAttributes) => {
        updateAttributes({ ...attrs, rowFile: null });
        setLoading(false);
      },
    };

    if (typeof uploadFileHandler === 'function') {
      // 自定义上传
      setLoading(true);
      uploadFileHandler(config);
    } else if (uploadAction) {
      setLoading(true);
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
    videoRef,
    uploadPercent,
    canPlay,
    loading,
    error,
    inline,
    minWidth,
    handleCanPlay,
    handleError,
    handleSizeChange,
    getElementRect,
  };
};

export default function VideoView(props: VideoViewProps) {
  const {
    node: { attrs },
    selected,
    editor,
    HTMLAttributes,
  } = props;

  const {
    locale,
    videoRef,
    uploadPercent,
    canPlay,
    loading,
    error,
    inline,
    minWidth,
    handleCanPlay,
    handleError,
    handleSizeChange,
    getElementRect,
  } = useVideoView(props);

  return (
    <MediaFloatMenu
      size={attrs.width}
      miniSize={minWidth}
      visible={editor.isEditable && selected && canPlay}
      onSizeChange={handleSizeChange}
    >
      <NodeViewWrapper
        as={inline ? 'span' : 'div'}
        className={!inline && 'block'}
        style={{ textAlign: attrs.textAlign }}
        {...filterDataHTMLAttributes(HTMLAttributes)}
      >
        <Resizable
          className={cx(`${prefix}-video`, {
            [`${prefix}-video-inline`]: inline,
          })}
          selected={selected}
          disabled={!editor.isEditable || !canPlay}
          full={attrs.fullInEditor}
          minWidth={minWidth}
          getElementRect={getElementRect}
          onResize={handleSizeChange}
          style={{ width: canPlay ? undefined : '100%' }}
        >
          {!canPlay && (
            <div
              className={`${prefix}-video-loading`}
              style={{
                maxWidth: attrs.width ? `${attrs.width}px` : defaultVideoWidth,
              }}
            >
              {(loading || (uploadPercent > 0 && uploadPercent < 100)) && (
                <>
                  <Progress type="circle" percent={uploadPercent} width={48} />
                  <div className={`${prefix}-video-tips`}>
                    {locale.uploading}
                  </div>
                </>
              )}
              {error && (
                <div className={`${prefix}-video__error`}>
                  <InfoCircleOutlined />
                  {locale.videoLoadError}
                </div>
              )}
            </div>
          )}

          <video
            ref={videoRef}
            data-drag-handle
            controls
            src={attrs.src}
            height={attrs.height ?? 'auto'}
            width={attrs.fullInEditor ? '100%' : (attrs.width ?? undefined)}
            className={cx(`${prefix}-video-el`, {
              'ProseMirror-selectednode': selected && editor.isEditable,
            })}
            style={{
              maxWidth: attrs.width ? undefined : 'auto',
              display: canPlay ? undefined : 'none',
            }}
            onCanPlay={handleCanPlay}
            onError={handleError}
          />
        </Resizable>
      </NodeViewWrapper>
    </MediaFloatMenu>
  );
}
