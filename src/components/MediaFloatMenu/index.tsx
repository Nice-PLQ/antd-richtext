import React, { useState, useMemo, useEffect } from 'react';
import Tippy from '@tippyjs/react';
import { message } from 'antd/es';
import {
  AlignCenterOutlined,
  AlignRightOutlined,
  AlignLeftOutlined,
  OneToOneOutlined,
} from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import { prefix } from '@/constants';
import MenuButton from '../MenuButton';
import MenuButtonContainer from '../MenuContainer';

interface Props {
  size: number | string;
  miniSize: number;
  visible: boolean;
  children: React.ReactElement;
  onSizeChange: (size: number | string) => void;
}

const MAX_SIZE = 10000;

const MediaFloatMenu: React.FC<Props> = ({
  size,
  miniSize,
  visible,
  children,
  onSizeChange,
}) => {
  const [innerSize, setInnerSize] = useState<string | number>(size || '');
  const editor = useEditorContext();
  const locale = useLocale();

  const alignItems = useMemo(
    () => [
      {
        label: locale.alignLeft,
        align: 'left',
        icon: <AlignLeftOutlined />,
      },
      {
        label: locale.alignCenter,
        align: 'center',
        icon: <AlignCenterOutlined />,
      },
      {
        label: locale.alignRight,
        align: 'right',
        icon: <AlignRightOutlined />,
      },
    ],
    [locale],
  );

  const setTextAlign = (alignment: string) => {
    editor?.chain().focus().setTextAlign(alignment).run();
  };

  const currentAlign =
    alignItems
      .map(({ align }) => align)
      .find((textAlign) => editor?.isActive({ textAlign })) ?? '';

  const placement =
    // eslint-disable-next-line no-nested-ternary
    currentAlign === 'center'
      ? 'top'
      : currentAlign === 'right'
        ? 'top-end'
        : 'top-start';

  const onKeydown = (e: React.KeyboardEvent) => {
    if (e.key.toLowerCase() === 'enter' && /^\d+$/.test(innerSize as string)) {
      if (Number(innerSize) < miniSize) {
        message.error(
          locale.sizeLessThan.replace('{MIN_SIZE}', miniSize.toString()),
        );
        return;
      }

      if (Number(innerSize) > MAX_SIZE) {
        message.error(
          locale.sizeGreaterThan.replace('{MAX_SIZE}', MAX_SIZE.toString()),
        );
        return;
      }
      onSizeChange(innerSize);
    }
  };

  useEffect(() => {
    setInnerSize(size || '');
  }, [size]);

  return (
    <Tippy
      interactive
      duration={200}
      arrow={false}
      placement={placement}
      animation="shift-away"
      zIndex={3}
      visible={visible}
      appendTo={() => editor.view.dom.parentNode as HTMLElement}
      content={
        <MenuButtonContainer className={`${prefix}-media-float-menu`}>
          {alignItems.map(({ label, align, icon }) => (
            <MenuButton
              key={align}
              tooltip={label}
              icon={icon}
              selected={currentAlign === align}
              onClick={() => setTextAlign(align)}
            />
          ))}
          <MenuButton
            tooltip={locale.fullInEditor}
            selected={editor.isActive({ fullInEditor: true })}
            icon={<OneToOneOutlined />}
            onClick={() => editor.commands.toggleFullInEditor()}
          />
          <span className={`${prefix}-media-float-input`}>
            <input
              value={innerSize}
              onKeyDown={onKeydown}
              disabled={editor.isActive({ fullInEditor: true })}
              onChange={(e) => setInnerSize(e.target.value)}
            />
            px
          </span>
        </MenuButtonContainer>
      }
    >
      {children}
    </Tippy>
  );
};

export default MediaFloatMenu;
