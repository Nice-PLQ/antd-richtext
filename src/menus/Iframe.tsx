import React, { useState } from 'react';
import { LayoutOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButtonPopover from '@/components/MenuButton/Popover';
import IframeEdit from '@/components/IframeBubbleMenu/IframeEdit';

const useIframe = () => {
  const [visible, setVisible] = useState(false);
  const editor = useEditorContext();
  const locale = useLocale();

  const isDisabled = !editor?.isEditable;

  const toggleVisible = (v: boolean) => {
    setVisible(v);
  };

  const hidePopover = () => {
    setVisible(false);
  };

  const insertIframe = (src: string) => {
    editor
      ?.chain()
      .focus()
      .command(({ commands }) => commands.setIframe({ src, width: 500 }))
      .command(({ commands }) => commands.createParagraphNear())
      .run();
    hidePopover();
  };

  return {
    visible,
    isDisabled,
    toggleVisible,
    hidePopover,
    insertIframe,
    tooltip: locale.iframe,
    insertTitle: locale.insertIframe,
  };
};

const MenuButtonIframe: React.FC = () => {
  const {
    visible,
    isDisabled,
    toggleVisible,
    hidePopover,
    insertIframe,
    tooltip,
    insertTitle,
  } = useIframe();

  return (
    <MenuButtonPopover
      visible={visible}
      tooltip={tooltip}
      placement="bottom"
      icon={<LayoutOutlined />}
      disabled={isDisabled}
      onVisibleChange={toggleVisible}
    >
      <IframeEdit
        title={insertTitle}
        onCancel={hidePopover}
        onOk={insertIframe}
      />
    </MenuButtonPopover>
  );
};

export default MenuButtonIframe;
