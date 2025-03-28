import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Card, Input, Button, Space } from 'antd/es';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { useEditorContext, useLocale } from '@/context';
import MenuButton from '@/components/MenuButton';
import { prefix } from '@/constants';
import useDragging from './useDragging';

interface SearchReplaceProps {
  showMenuIcons?: boolean;
}

type TabKey = 'search' | 'replace';

const useSearchReplace = () => {
  const [tab, setTab] = useState<TabKey>('search');
  const [searchInput, setSearchInput] = useState('');
  const [replaceInput, setReplaceInput] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const editor = useEditorContext();
  const locale = useLocale();

  const { dragging, position, resetPosition, onMouseDown, onMouseUp } =
    useDragging(containerRef);

  const currentIndex = editor?.storage.searchAndReplace.resultIndex ?? 0;
  const total = editor?.storage.searchAndReplace.results.length ?? 0;
  const isDisabled = !editor?.isEditable;

  // 跳转到选中位置
  const goToSelection = () => {
    if (!editor) {
      return;
    }

    const { results, resultIndex } = editor.storage.searchAndReplace;
    const position = results[resultIndex];

    if (!position) {
      return;
    }

    editor.commands.setTextSelection(position as any);

    const { node } = editor.view.domAtPos(editor.state.selection.anchor);
    if (node instanceof HTMLElement) {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // 替换当前匹配项
  const replace = () => {
    editor?.commands.replace();
    goToSelection();
  };

  // 下一个匹配项
  const next = () => {
    editor?.commands.nextSearchResult();
    goToSelection();
  };

  // 上一个匹配项
  const previous = () => {
    editor?.commands.previousSearchResult();
    goToSelection();
  };

  // 清除搜索
  const clear = () => {
    setSearchInput('');
    setReplaceInput('');
    editor?.commands.resetIndex();
    editor?.commands.setSearchTerm('');
    editor?.commands.setReplaceTerm('');
  };

  // 替换所有匹配项
  const replaceAll = () => editor?.commands.replaceAll();

  // 开始搜索
  const startSearch = () => {
    if (!editor) {
      return;
    }

    const { selection, doc } = editor.state;
    const txt = doc.textBetween(selection.from, selection.to);
    setSearchInput(txt);
    editor.commands.setSearchTerm(txt);
    editor.commands.resetIndex();
  };

  // 显示搜索面板
  const showSearchPanel = () => {
    setShowPanel(true);
    startSearch();
  };

  // 隐藏搜索面板
  const hideSearchPanel = () => {
    setShowPanel(false);
    clear();
  };

  // 更新搜索词
  const updateSearchTerm = (value: string) => {
    setSearchInput(value);
    editor?.commands.setSearchTerm(value);
    editor?.commands.resetIndex();
  };

  // 更新替换词
  const updateReplaceTerm = (value: string) => {
    setReplaceInput(value);
    editor?.commands.setReplaceTerm(value);
  };

  // 监听键盘快捷键
  const onShowPanelKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'f' && editor?.isFocused) {
      e.stopPropagation();
      e.preventDefault();
      showSearchPanel();
    }
  };

  // 监听Escape键关闭面板
  const onHideCardKeyDown = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'escape') {
      hideSearchPanel();
    }
  };

  // 添加和移除键盘事件监听
  useEffect(() => {
    if (!showPanel) {
      resetPosition();
      return () => {};
    }
    window.addEventListener('keydown', onHideCardKeyDown);
    return () => {
      window.removeEventListener('keydown', onHideCardKeyDown);
    };
  }, [showPanel]);

  useEffect(() => {
    if (!editor) {
      return () => {};
    }

    editor.view.dom.addEventListener('keydown', onShowPanelKeyDown);
    return () => {
      editor.view.dom.removeEventListener('keydown', onShowPanelKeyDown);
    };
  }, [editor]);

  return {
    tab,
    setTab,
    searchInput,
    replaceInput,
    showPanel,
    containerRef,
    dragging,
    position,
    currentIndex,
    total,
    isDisabled,
    next,
    previous,
    replace,
    replaceAll,
    showSearchPanel,
    hideSearchPanel,
    updateSearchTerm,
    updateReplaceTerm,
    locale,
    tabList: [
      { key: 'search', tab: locale.search },
      { key: 'replace', tab: locale.replace },
    ],
    onMouseDown,
    onMouseUp,
  };
};

/**
 * 搜索面板组件
 */
const SearchPanel: React.FC<{
  tab: TabKey;
  searchInput: string;
  replaceInput: string;
  currentIndex: number;
  total: number;
  updateSearchTerm: (value: string) => void;
  updateReplaceTerm: (value: string) => void;
  next: () => void;
  previous: () => void;
  replace: () => void;
  replaceAll: () => void;
  locale: any;
}> = ({
  tab,
  searchInput,
  replaceInput,
  currentIndex,
  total,
  updateSearchTerm,
  updateReplaceTerm,
  next,
  previous,
  replace,
  replaceAll,
  locale,
}) => {
  if (tab === 'search') {
    return (
      <>
        <Input
          autoFocus
          placeholder={locale.searchPlaceholder}
          value={searchInput}
          suffix={`${total ? currentIndex + 1 : 0} / ${total}`}
          onPressEnter={next}
          onChange={(e) => updateSearchTerm(e.target.value)}
        />
        <Space className={`${prefix}__search-btn`}>
          <Button onClick={previous} disabled={!searchInput}>
            {locale.searchPrevious}
          </Button>
          <Button onClick={next} disabled={!searchInput}>
            {locale.searchNext}
          </Button>
        </Space>
      </>
    );
  }

  return (
    <>
      <div className={`${prefix}__search-label`}>{locale.search}</div>
      <Input
        placeholder={locale.searchPlaceholder}
        style={{ marginBottom: 16 }}
        value={searchInput}
        suffix={`${total ? currentIndex + 1 : 0} / ${total}`}
        onPressEnter={next}
        onChange={(e) => updateSearchTerm(e.target.value)}
      />
      <div className={`${prefix}__search-label`}>{locale.replaceAs}</div>
      <Input
        placeholder={locale.replacePlaceholder}
        value={replaceInput}
        onPressEnter={replace}
        onChange={(e) => updateReplaceTerm(e.target.value)}
      />
      <Space size={4} className={`${prefix}__search-btn`}>
        <Button onClick={previous} disabled={!searchInput}>
          {locale.searchPrevious}
        </Button>
        <Button onClick={next} disabled={!searchInput}>
          {locale.searchNext}
        </Button>
        <Button onClick={replace} disabled={!(searchInput && replaceInput)}>
          {locale.replace}
        </Button>
        <Button
          type="primary"
          onClick={replaceAll}
          disabled={!(searchInput && replaceInput)}
        >
          {locale.replaceAll}
        </Button>
      </Space>
    </>
  );
};

const MenuButtonSearchReplace: React.FC<SearchReplaceProps> = ({
  showMenuIcons = true,
}) => {
  const {
    tab,
    setTab,
    searchInput,
    replaceInput,
    showPanel,
    containerRef,
    dragging,
    position,
    currentIndex,
    total,
    isDisabled,
    next,
    previous,
    replace,
    replaceAll,
    showSearchPanel,
    hideSearchPanel,
    updateSearchTerm,
    updateReplaceTerm,
    locale,
    tabList,
    onMouseDown,
    onMouseUp,
  } = useSearchReplace();

  const editor = useEditorContext();

  return (
    <>
      {showMenuIcons && (
        <MenuButton
          tooltip={locale.searchAndReplace}
          icon={<SearchOutlined />}
          disabled={isDisabled}
          onClick={showSearchPanel}
        />
      )}
      {showPanel &&
        createPortal(
          <div
            className={`${prefix}__search-wrapper`}
            style={{
              height: dragging ? '100%' : 0,
            }}
          >
            <div
              className={`${prefix}__search`}
              ref={containerRef}
              style={position}
            >
              <Card
                tabList={tabList}
                activeTabKey={tab}
                onTabChange={(key: TabKey) => setTab(key)}
              >
                <SearchPanel
                  tab={tab}
                  searchInput={searchInput}
                  replaceInput={replaceInput}
                  currentIndex={currentIndex}
                  total={total}
                  updateSearchTerm={updateSearchTerm}
                  updateReplaceTerm={updateReplaceTerm}
                  next={next}
                  previous={previous}
                  replace={replace}
                  replaceAll={replaceAll}
                  locale={locale}
                />
                <Button
                  className={`${prefix}__search-close`}
                  type="text"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={hideSearchPanel}
                />
                <div
                  className={`${prefix}__search-move`}
                  onMouseDown={onMouseDown}
                  onMouseUp={onMouseUp}
                />
              </Card>
            </div>
          </div>,
          editor.view.dom.parentNode as HTMLElement,
        )}
    </>
  );
};

export default MenuButtonSearchReplace;
