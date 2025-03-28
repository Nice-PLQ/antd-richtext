import React, { useState, useEffect, useCallback } from 'react';
import cx from 'classnames';
import { Input, Button, message } from 'antd/es';
import { prefix } from '@/constants';
import { useEditorContext, useLocale } from '@/context';
import { isValidURL } from '@/utils/editorLink';

interface LinkEditProps {
  /** 自定义类名 */
  className?: string;
  /** 链接文本 */
  linkText: string;
  /** 标题 */
  title: string;
  /** 链接地址 */
  href?: string;
  /** 链接目标 */
  target: string;
  /** 取消回调 */
  onCancel: () => void;
  /** 确认回调 */
  onOk: () => void;
}

const useLinkEdit = (props: {
  linkText: string;
  href?: string;
  target: string;
  onOk: () => void;
}) => {
  const { linkText, href: defaultHref, target: defaultTarget, onOk } = props;
  const editor = useEditorContext();
  const locale = useLocale();

  const [target, setTarget] = useState<string | null>('_blank');
  const [text, setText] = useState('');
  const [href, setHref] = useState('');

  // 设置链接文本
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
    },
    [],
  );

  // 设置链接地址
  const handleHrefChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setHref(e.target.value);
    },
    [],
  );

  // 设置链接目标
  const handleTargetChange = useCallback((checked: boolean) => {
    setTarget(checked ? '_blank' : null);
  }, []);

  // 提交链接
  const handleSubmit = useCallback(() => {
    if (!isValidURL(href)) {
      message.error(locale.linkInvalid);
      return;
    }

    editor
      ?.chain()
      .extendMarkRange('link')
      .insertContent({
        type: 'text',
        marks: [
          {
            type: 'link',
            attrs: { href, target },
          },
        ],
        text,
      })
      .setLink({ href, target })
      .focus()
      .run();
    onOk();
  }, [editor, href, target, text, onOk, locale]);

  // 初始化状态
  useEffect(() => {
    setText(linkText);
    if (defaultHref) {
      setHref(defaultHref);
    }
  }, [linkText, defaultHref]);

  useEffect(() => {
    setTarget(defaultTarget);
  }, [defaultTarget]);

  return {
    text,
    href,
    target,
    isDisabled: !text || !href,
    handleTextChange,
    handleHrefChange,
    handleTargetChange,
    handleSubmit,
  };
};

const LinkEdit: React.FC<LinkEditProps> = ({
  className,
  linkText,
  title,
  target: defaultTarget,
  href: defaultHref,
  onCancel,
  onOk,
}) => {
  const locale = useLocale();
  const {
    text,
    href,
    isDisabled,
    handleTextChange,
    handleHrefChange,
    handleSubmit,
  } = useLinkEdit({
    linkText,
    href: defaultHref,
    target: defaultTarget,
    onOk,
  });

  return (
    <div className={cx(`${prefix}-link-edit`, className)}>
      <div className={`${prefix}-link-title`}>{title}</div>
      <Input
        prefix={locale.linkText}
        value={text}
        onChange={handleTextChange}
      />
      <Input
        prefix={locale.linkHref}
        placeholder={locale.linkPlaceholder}
        value={href}
        onChange={handleHrefChange}
        onPressEnter={handleSubmit}
      />
      <div className={`${prefix}-link-btn`}>
        <Button onClick={onCancel}>{locale.cancel}</Button>
        <Button disabled={isDisabled} type="primary" onClick={handleSubmit}>
          {locale.ok}
        </Button>
      </div>
    </div>
  );
};

export default LinkEdit;
