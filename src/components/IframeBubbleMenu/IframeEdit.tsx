import React, { useState, useEffect, useCallback } from 'react';
import cx from 'classnames';
import { Input, Button } from 'antd/es';
import { prefix } from '@/constants';
import { useLocale } from '@/context';

interface IframeEditProps {
  /** 自定义类名 */
  className?: string;
  /** iframe源地址 */
  src?: string;
  /** 标题 */
  title: string;
  /** 取消回调 */
  onCancel: () => void;
  /** 确认回调 */
  onOk: (src: string) => void;
}

const useIframeEdit = (defaultSrc?: string, onOk?: (src: string) => void) => {
  const [src, setSrc] = useState<string>('');

  // 设置iframe源地址
  const handleSrcChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSrc(e.target.value);
    },
    [],
  );

  // 提交iframe
  const handleSubmit = useCallback(() => {
    if (!src || !onOk) {
      return;
    }

    onOk(src);
  }, [src, onOk]);

  useEffect(() => {
    if (defaultSrc) {
      setSrc(defaultSrc);
    }
  }, [defaultSrc]);

  return {
    src,
    isDisabled: !src,
    handleSrcChange,
    handleSubmit,
  };
};

const IframeEdit: React.FC<IframeEditProps> = ({
  className,
  src: defaultSrc,
  title,
  onCancel,
  onOk,
}) => {
  const locale = useLocale();
  const { src, isDisabled, handleSrcChange, handleSubmit } = useIframeEdit(
    defaultSrc,
    onOk,
  );

  return (
    <div className={cx(`${prefix}-iframe-edit`, className)}>
      <div className={`${prefix}-iframe-title`}>{title}</div>
      <Input
        prefix={locale.iframeSrc}
        placeholder={locale.linkPlaceholder}
        value={src}
        onChange={handleSrcChange}
        onPressEnter={handleSubmit}
      />
      <div className={`${prefix}-iframe-btn`}>
        <Button onClick={onCancel}>{locale.cancel}</Button>
        <Button disabled={isDisabled} type="primary" onClick={handleSubmit}>
          {locale.ok}
        </Button>
      </div>
    </div>
  );
};

export default IframeEdit;
