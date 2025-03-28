import React, { useState, useMemo, useCallback } from 'react';
import cx from 'classnames';
import { Button } from 'antd/es';
import { prefix } from '@/constants';
import { useLocale } from '@/context';
import emojis from './emoji';

interface EmojiTab {
  /** 选项卡标签 */
  label: string;
  /** 选项卡中的表情列表 */
  emoji: string[];
}

interface EmojiProps {
  /** 当前选中的表情 */
  value?: string;
  /** 表情变更回调 */
  onChange: (emoji: string) => void;
}

const useEmoji = (onChange: (emoji: string) => void) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const locale = useLocale();

  // 表情选项卡配置
  const tabs = useMemo<EmojiTab[]>(
    () => [
      {
        label: locale.peopleEmoji,
        emoji: emojis.people,
      },
      { label: locale.natureEmoji, emoji: emojis.nature },
      { label: locale.foodsEmoji, emoji: emojis.foods },
      { label: locale.activityEmoji, emoji: emojis.activity },
      { label: locale.placesEmoji, emoji: emojis.places },
      { label: locale.objectsEmoji, emoji: emojis.objects },
      { label: locale.symbolsEmoji, emoji: emojis.symbols },
    ],
    [locale],
  );

  // 切换选项卡
  const handleTabChange = useCallback((index: number) => {
    setActiveTab(index);
  }, []);

  // 选择表情
  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      onChange(emoji);
    },
    [onChange],
  );

  return {
    activeTab,
    tabs,
    handleTabChange,
    handleEmojiSelect,
  };
};

/**
 * 表情选项卡组件
 */
const EmojiTabs: React.FC<{
  tabs: EmojiTab[];
  activeTab: number;
  onTabChange: (index: number) => void;
}> = ({ tabs, activeTab, onTabChange }) => (
  <div className={`${prefix}-emoji-tabs`}>
    {tabs.map(({ label }, index) => (
      <div
        className={cx(`${prefix}-emoji-tabs__item`, {
          selected: index === activeTab,
        })}
        key={label}
        onClick={() => onTabChange(index)}
      >
        {label}
      </div>
    ))}
  </div>
);

/**
 * 表情列表组件
 */
const EmojiList: React.FC<{
  emojis: string[];
  onEmojiSelect: (emoji: string) => void;
}> = ({ emojis, onEmojiSelect }) => (
  <div className={`${prefix}-emoji-list`}>
    {emojis.map((emoji, index) => (
      <Button
        className={`${prefix}-emoji__item`}
        size="small"
        key={index}
        icon={<span>{emoji}</span>}
        onClick={() => onEmojiSelect(emoji)}
      />
    ))}
  </div>
);

const Emoji: React.FC<EmojiProps> = ({ onChange }) => {
  const { activeTab, tabs, handleTabChange, handleEmojiSelect } =
    useEmoji(onChange);

  return (
    <div className={`${prefix}-emoji`}>
      <EmojiTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <EmojiList
        emojis={tabs[activeTab].emoji}
        onEmojiSelect={handleEmojiSelect}
      />
    </div>
  );
};

export default Emoji;
