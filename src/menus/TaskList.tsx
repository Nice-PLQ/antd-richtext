import React from 'react';
import { CheckSquareOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButton from '@/components/MenuButton';

const useTaskList = () => {
  const editor = useEditorContext();
  const locale = useLocale();

  const isActive = editor?.isActive('taskList') ?? false;
  const isDisabled = !editor?.isEditable || !editor?.can().toggleTaskList();

  const toggleTaskList = () => {
    editor?.chain().focus().toggleTaskList().run();
  };

  return {
    isActive,
    isDisabled,
    toggleTaskList,
    tooltip: locale.taskList,
  };
};

const MenuButtonTaskList: React.FC = () => {
  const { isActive, isDisabled, toggleTaskList, tooltip } = useTaskList();

  return (
    <MenuButton
      tooltip={tooltip}
      icon={<CheckSquareOutlined />}
      selected={isActive}
      disabled={isDisabled}
      onClick={toggleTaskList}
    />
  );
};

export default MenuButtonTaskList;
