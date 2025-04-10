import React from 'react';
import { OrderedListOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButtonDropdown from '@/components/MenuButton/Dropdown';

const DropdownItem = MenuButtonDropdown.Item;

const useList = () => {
  const editor = useEditorContext();
  const locale = useLocale();

  const isBulletList = editor?.isActive('bulletList') ?? false;
  const isOrderedList = editor?.isActive('orderedList') ?? false;

  const isDisabled =
    !editor?.isEditable ||
    (!editor?.can().toggleOrderedList() && !editor?.can().toggleBulletList());

  const toggleOrderedList = () => {
    editor?.chain().focus().toggleOrderedList().run();
  };

  const toggleBulletList = () => {
    editor?.chain().focus().toggleBulletList().run();
  };

  return {
    isBulletList,
    isOrderedList,
    isDisabled,
    toggleOrderedList,
    toggleBulletList,
    tooltip: locale.list,
    orderedListText: locale.orderedList,
    bulletListText: locale.bulletList,
  };
};

const MenuButtonListItem: React.FC = () => {
  const {
    isBulletList,
    isOrderedList,
    isDisabled,
    toggleOrderedList,
    toggleBulletList,
    tooltip,
    orderedListText,
    bulletListText,
  } = useList();

  return (
    <MenuButtonDropdown
      tooltip={tooltip}
      activeIcon={
        isBulletList ? <UnorderedListOutlined /> : <OrderedListOutlined />
      }
      disabled={isDisabled}
    >
      <DropdownItem
        key="orderedList"
        icon={<OrderedListOutlined />}
        selected={isOrderedList}
        label={orderedListText}
        onClick={toggleOrderedList}
      />
      <DropdownItem
        key="bulletList"
        icon={<UnorderedListOutlined />}
        selected={isBulletList}
        label={bulletListText}
        onClick={toggleBulletList}
      />
    </MenuButtonDropdown>
  );
};

export default MenuButtonListItem;
