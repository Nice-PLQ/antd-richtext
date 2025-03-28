import { useRef, useState, useEffect, useCallback } from 'react';
import cx from 'classnames';
import type { NodeViewProps } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { NodeViewWrapper } from '@tiptap/react';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import { Image, Progress } from 'antd/es';
import { InfoCircleOutlined } from '@ant-design/icons';
import { prefix, defaultImageWidth } from '@/constants';
import Resizable, { RESIZABLE_MIN_WIDTH } from '@/components/Resizable';
import MediaFloatMenu from '@/components/MediaFloatMenu';
import { useLocale } from '@/context';
import {
  uploadFile as internalUploadFile,
  filterDataHTMLAttributes,
  type UploadConfig,
} from '@/utils';
import type ResizableImage from './index';

interface ImageNodeAttributes extends Record<string, unknown> {
  /** 图片源地址 */
  src: string;
  /** 图片替代文本 */
  alt?: string | null;
  /** 图片标题 */
  title?: string | null;
  /** 图片宽度 */
  width: number;
  /** 图片高度 */
  height?: number;
  /** 图片宽高比 */
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

interface ResizableImageNode extends ProseMirrorNode {
  attrs: ImageNodeAttributes;
}

interface ImageViewProps extends NodeViewProps {
  /** 节点实例 */
  node: ResizableImageNode;
  // @ts-ignore
  extension: typeof ResizableImage;
}

const useImageView = (props: ImageViewProps) => {
  const {
    node: { attrs },
    updateAttributes,
    extension,
    editor,
  } = props;

  const locale = useLocale();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [preview, setPreview] = useState<boolean>(false);
  const [lazyLoaded, setLazyLoaded] = useState<boolean>(false);
  const [uploadPercent, setUploadPercent] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);

  const { inline, minWidth = RESIZABLE_MIN_WIDTH } = extension.options;

  // 获取编辑器中所有图片的URL
  const images = editor.options.element.querySelectorAll(
    `img.${prefix}-image-el`,
  );
  const imageUrls = Array.from(images)
    .map((el) => el.getAttribute('src'))
    .filter((src) => src);

  // 处理图片点击
  const handleImageClick = useCallback(() => {
    if (!editor.isEditable) {
      setPreview(true);
    }
  }, [editor.isEditable]);

  // 处理图片双击
  const handleImageDoubleClick = useCallback(() => {
    if (editor.isEditable) {
      setPreview(true);
    }
  }, [editor.isEditable]);

  // 处理图片加载
  const handleImageLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const { naturalWidth, naturalHeight } = event.currentTarget;
      const width = attrs.width ?? naturalWidth;
      if (width) {
        setLazyLoaded(true);
        updateAttributes({
          width:
            editor.isEditable && width > defaultImageWidth
              ? defaultImageWidth
              : width,
          aspectRatio: naturalHeight > 0 ? naturalWidth / naturalHeight : null,
        });
      }
    },
    [attrs.width, editor.isEditable, updateAttributes],
  );

  // 处理图片加载错误
  const handleImageError = useCallback(() => {
    setError(true);
  }, []);

  // 处理尺寸变更
  const handleSizeChange = useCallback(
    (width: number) => {
      updateAttributes({ width });
    },
    [updateAttributes],
  );

  const handlePreviewVisibleChange = useCallback((visible: boolean) => {
    setPreview(visible);
  }, []);

  // 获取元素矩形
  const getElementRect = useCallback(
    () => imageRef.current!.getBoundingClientRect(),
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
      onSuccess: (attrs: ImageNodeAttributes) =>
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
    imageRef,
    preview,
    lazyLoaded,
    uploadPercent,
    error,
    inline,
    minWidth,
    imageUrls,
    handleImageClick,
    handleImageDoubleClick,
    handleImageLoad,
    handleImageError,
    handleSizeChange,
    handlePreviewVisibleChange,
    getElementRect,
  };
};

export default function ImageView(props: ImageViewProps) {
  const {
    node: { attrs },
    selected,
    editor,
    HTMLAttributes,
  } = props;

  const {
    locale,
    imageRef,
    preview,
    lazyLoaded,
    uploadPercent,
    error,
    inline,
    minWidth,
    imageUrls,
    handleImageClick,
    handleImageDoubleClick,
    handleImageLoad,
    handleImageError,
    handleSizeChange,
    handlePreviewVisibleChange,
    getElementRect,
  } = useImageView(props);

  return (
    <MediaFloatMenu
      size={attrs.width}
      miniSize={minWidth}
      visible={editor.isEditable && selected && !error}
      onSizeChange={handleSizeChange}
    >
      <NodeViewWrapper
        as={inline ? 'span' : 'div'}
        className={cx(inline ? 'inline-image' : 'block')}
        style={{ textAlign: attrs.textAlign }}
        {...filterDataHTMLAttributes(HTMLAttributes)}
      >
        {/** @ts-ignore */}
        <LazyLoadComponent>
          <Resizable
            className={cx(`${prefix}-image`, {
              [`${prefix}-image-inline`]: inline,
            })}
            selected={selected}
            disabled={!editor.isEditable || error}
            full={attrs.fullInEditor}
            minWidth={minWidth}
            getElementRect={getElementRect}
            onResize={handleSizeChange}
          >
            {error && (
              <div className={`${prefix}-image__error`}>
                <InfoCircleOutlined />
                {locale.imageLoadError}
              </div>
            )}
            <img
              ref={imageRef}
              data-drag-handle
              src={attrs.src}
              height={attrs.height ?? 'auto'}
              onClick={handleImageClick}
              onDoubleClick={handleImageDoubleClick}
              width={attrs.fullInEditor ? '100%' : (attrs.width ?? undefined)}
              {...{
                alt: attrs.alt ?? undefined,
                title: attrs.title ?? undefined,
              }}
              className={cx(`${prefix}-image-el`, {
                'ProseMirror-selectednode': selected && editor.isEditable,
                [`${prefix}-image__view`]: !editor.isEditable,
              })}
              style={{
                maxWidth: attrs.width ? undefined : 'auto',
                opacity: lazyLoaded ? 1 : 0,
                transition: editor.isEditable ? 'none' : 'opacity .3s',
                display: error ? 'none' : undefined,
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />

            {/* 上传进度展示 */}
            {uploadPercent > 0 && uploadPercent < 100 && (
              <div className={`${prefix}-image__loading`}>
                <Progress type="circle" percent={uploadPercent} width={48} />
              </div>
            )}

            {/* 图片预览 */}
            {preview && (
              <Image.PreviewGroup
                preview={{
                  visible: preview,
                  current: imageUrls.findIndex((src) => src === attrs.src),
                  onVisibleChange: handlePreviewVisibleChange,
                  maskClosable: true,
                }}
              >
                {imageUrls.map((src) => (
                  <Image
                    key={src}
                    preview={{
                      src: src!,
                    }}
                  />
                ))}
              </Image.PreviewGroup>
            )}
          </Resizable>
        </LazyLoadComponent>
      </NodeViewWrapper>
    </MediaFloatMenu>
  );
}
