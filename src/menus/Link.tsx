import React, { useState } from 'react';
import { LinkOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButtonPopover from '@/components/MenuButton/Popover';
import LinkEdit from '@/components/LinkBubbleMenu/LinkEdit';
import { getLinkText } from '@/utils';

const useLink = () => {
  const [visible, setVisible] = useState(false);
  const editor = useEditorContext();
  const locale = useLocale();

  const isLinkActive = editor?.isActive('link') ?? false;
  const linkText = getLinkText(editor);

  const isDisabled =
    !editor?.isEditable || !editor?.can().setLink({ href: '/' });

  const toggleLink = () => {
    if (isLinkActive) {
      editor
        ?.chain()
        .extendMarkRange('link')
        .unsetLink()
        .setTextSelection(editor.state.selection.to)
        .focus()
        .run();
    } else {
      setVisible(true);
    }
  };

  const handleVisibleChange = (v: boolean) => {
    setVisible(isLinkActive ? false : v);
  };

  const hidePopover = () => {
    setVisible(false);
  };

  return {
    visible,
    isLinkActive,
    isDisabled,
    linkText,
    toggleLink,
    handleVisibleChange,
    hidePopover,
    tooltip: isLinkActive ? locale.unLink : locale.link,
    insertTitle: locale.insertLink,
  };
};

const MenuButtonLink: React.FC = () => {
  const {
    visible,
    isLinkActive,
    isDisabled,
    linkText,
    toggleLink,
    handleVisibleChange,
    hidePopover,
    tooltip,
    insertTitle,
  } = useLink();

  return (
    <MenuButtonPopover
      visible={visible}
      tooltip={tooltip}
      placement="bottom"
      icon={<LinkOutlined />}
      selected={isLinkActive}
      disabled={isDisabled}
      onClick={toggleLink}
      onVisibleChange={handleVisibleChange}
    >
      <LinkEdit
        linkText={linkText}
        title={insertTitle}
        target="_blank"
        onCancel={hidePopover}
        onOk={hidePopover}
      />
    </MenuButtonPopover>
  );
};

export default MenuButtonLink;
