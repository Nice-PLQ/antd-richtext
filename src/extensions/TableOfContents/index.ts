/* eslint-disable */
import { Extension as TiptapExtension } from '@tiptap/core';
import { Plugin as ProseMirrorPlugin, PluginKey } from '@tiptap/pm/state';
import debounce from 'lodash-es/debounce';
import throttle from 'lodash-es/throttle';
import { prefix } from '@/constants';

// 生成唯一ID
const generateId = () =>
  prefix + '-' + ([...Math.random().toString(36).slice(2)]
    .map(it => Math.random() > 0.5 ? it : it.toUpperCase())
    .join(''));

// 创建Table of Contents插件
const createTableOfContentsPlugin = ({ getId, anchorTypes = ['heading'] }) =>
  new ProseMirrorPlugin({
    key: new PluginKey('tableOfContent'),
    appendTransaction(transactions, oldState, newState) {
      const tr = newState.tr;
      let modified = false;

      if (transactions.some(tr => tr.docChanged)) {
        const ids = [];
        newState.doc.descendants((node, pos) => {
          const tocId = node.attrs['data-toc-id'];
          if (anchorTypes.includes(node.type.name) && node.textContent.length !== 0) {
            if (tocId == null || ids.includes(tocId)) {
              let newId = '';
              newId = getId ? getId(node.textContent) : generateId();
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                'data-toc-id': newId,
                id: newId,
              });
              modified = true;
            }
            ids.push(tocId);
          }
        });
      }
      return modified ? tr : null;
    },
  });

// 获取指定级别的最后一个标题
const getLastHeadingOnLevel = (headings, level) => {
  let heading = headings.filter(h => h.level === level).pop();
  if (level !== 0) {
    return heading || (heading = getLastHeadingOnLevel(headings, level - 1)), heading;
  }
};

// 获取标题层级
const getHeadlineLevel = (heading, headings) => {
  let level = 1;
  const lastHeading = headings.at(-1);
  const previousHeading = [...headings].reverse().find(h => h.originalLevel <= heading.node.attrs.level);
  const previousLevel = (previousHeading?.level) || 1;

  level = heading.node.attrs.level > (lastHeading?.originalLevel || 1)
    ? (lastHeading?.level || 1) + 1
    : heading.node.attrs.level < (lastHeading?.originalLevel || 1)
      ? previousLevel
      : (lastHeading?.level) || 1;

  return level;
};

// 获取线性索引
const getLinearIndexes = (heading, headings) => {
  const lastHeading = headings.at(-1);
  return lastHeading ? (lastHeading?.itemIndex || 1) + 1 : 1;
};

// 获取分层索引
const getHierarchicalIndexes = (heading, headings, level) => {
  let index;
  let itemIndex;
  const currentLevel = level || heading.node.attrs.level || 1;
  let hierarchicalIndex = 1;
  const filteredHeadings = headings.filter(h => h.level <= currentLevel);

  hierarchicalIndex = (index = filteredHeadings.at(-1))?.level === currentLevel
    ? ((itemIndex = filteredHeadings.at(-1))?.itemIndex || 1) + 1
    : 1;

  return hierarchicalIndex;
};

// 更新Table of Contents
const updateTableOfContents = (content, options) => {
  const { editor } = options;
  const headings = [];
  const scrolledOverHeadings = [];
  let activeHeadingId = null;

  editor.state.doc.descendants((node, pos) => {
    if (options.anchorTypes.includes(node.type.name)) {
      headings.push({ node, pos });
    }
  });

  headings.forEach(heading => {
    const domNode = editor.view.domAtPos(heading.pos + 1).node;
    if (options.storage.scrollPosition >= domNode.offsetTop) {
      activeHeadingId = heading.node.attrs['data-toc-id'];
      scrolledOverHeadings.push(heading.node.attrs['data-toc-id']);
    }
  });

  content = content.map(item => ({
    ...item,
    isActive: item.id === activeHeadingId,
    isScrolledOver: scrolledOverHeadings.includes(item.id),
  }));

  if (options.onUpdate) {
    const isEmpty = options.storage.content.length === 0;
    options.onUpdate(content, isEmpty);
  }

  return content;
};

// 防抖处理Table of Contents更新
const debouncedUpdateTableOfContents = debounce((options) => {
  const { editor, onUpdate } = options;
  const headings = [];
  let content = [];
  const domNodes = [];

  editor.state.doc.descendants((node, pos) => {
    if (options.anchorTypes.includes(node.type.name)) {
      headings.push({ node, pos });
    }
  });

  headings.forEach((heading, index) => {
    if (heading.node.textContent.length === 0) {
      return;
    }

    const domNode = editor.view.domAtPos(heading.pos + 1).node;
    const isScrolledOver = options.storage.scrollPosition >= domNode.offsetTop;
    domNodes.push(domNode);

    const level = heading.node.attrs.level;
    const previousHeading = headings[index - 1];
    const hierarchicalLevel = options.getLevelFn(heading, content);
    const hierarchicalIndex = options.getIndexFn(heading, content, hierarchicalLevel);

    content = previousHeading
      ? [
        ...content,
        {
          itemIndex: hierarchicalIndex,
          id: heading.node.attrs['data-toc-id'],
          originalLevel: level,
          level: hierarchicalLevel,
          textContent: heading.node.textContent,
          pos: heading.pos,
          editor,
          isActive: false,
          isScrolledOver,
          node: heading.node,
          dom: domNode,
        },
      ]
      : [
        ...content,
        {
          itemIndex: hierarchicalIndex,
          id: heading.node.attrs['data-toc-id'],
          originalLevel: level,
          level: hierarchicalLevel,
          textContent: heading.node.textContent,
          pos: heading.pos,
          editor,
          isActive: false,
          isScrolledOver,
          node: heading.node,
          dom: domNode,
        },
      ];
  });

  content = updateTableOfContents(content, options);

  if (onUpdate) {
    const isEmpty = options.storage.content.length === 0;
    onUpdate(content, isEmpty);
  }

  options.storage.anchors = domNodes;
  options.storage.content = content;
  editor.state.tr.setMeta('toc', content);
  editor.view.dispatch(editor.state.tr);
}, 500);

const TableOfContents = TiptapExtension.create({
  name: 'tableOfContents',
  addStorage: () => ({
    content: [],
    anchors: [],
    scrollHandler: () => null,
    scrollPosition: 0,
  }),
  addGlobalAttributes() {
    return [
      {
        types: this.options.anchorTypes || ['headline'],
        attributes: {
          id: {
            default: null,
            renderHTML: (attributes) => ({ id: attributes.id }),
            parseHTML: (element) => element.id || null,
          },
          'data-toc-id': {
            default: null,
            renderHTML: (attributes) => ({ 'data-toc-id': attributes['data-toc-id'] }),
            parseHTML: (element) => element.dataset.tocId || null,
          },
        },
      },
    ];
  },
  addOptions: () => ({
    onUpdate: () => { },
    getId: (text) => generateId(),
    scrollParent: typeof window !== 'undefined' ? () => window : undefined,
    anchorTypes: ['heading'],
  }),
  onUpdate() {
    debouncedUpdateTableOfContents({
      editor: this.editor,
      storage: this.storage,
      onUpdate: this.options.onUpdate?.bind(this),
      getIndexFn: this.options.getIndex || getLinearIndexes,
      getLevelFn: this.options.getLevel || getHeadlineLevel,
      anchorTypes: this.options.anchorTypes,
    });
  },
  onCreate() {
    const { tr } = this.editor.state;
    const ids = [];

    if (this.options.scrollParent && typeof this.options.scrollParent !== 'function') {
      console.warn(
        "[Tiptap Table of Contents Deprecation Notice]: The 'scrollParent' option must now be provided as a callback function that returns the 'scrollParent' element. The ability to pass this option directly will be deprecated in future releases.",
      );
    }

    this.editor.state.doc.descendants((node, pos) => {
      const tocId = node.attrs['data-toc-id'];
      if (this.options.anchorTypes.includes(node.type.name) && node.textContent.length !== 0) {
        if (tocId == null || ids.includes(tocId)) {
          let newId = '';
          newId = this.options.getId ? this.options.getId(node.textContent) : generateId();
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            'data-toc-id': newId,
            id: newId,
          });
        }
        ids.push(tocId);
      }
    });

    this.editor.view.dispatch(tr);

    debouncedUpdateTableOfContents({
      editor: this.editor,
      storage: this.storage,
      onUpdate: this.options.onUpdate?.bind(this),
      getIndexFn: this.options.getIndex || getLinearIndexes,
      getLevelFn: this.options.getLevel || getHeadlineLevel,
      anchorTypes: this.options.anchorTypes,
    });

    this.storage.scrollHandler = throttle(() => {
      if (!this.options.scrollParent) {
        return;
      }
      const scrollParent = typeof this.options.scrollParent === 'function'
        ? this.options.scrollParent()
        : this.options.scrollParent;
      const scrollPosition = scrollParent instanceof HTMLElement ? scrollParent.scrollTop : scrollParent.scrollY;
      this.storage.scrollPosition = scrollPosition || 0;

      const updatedContent = updateTableOfContents(this.storage.content, {
        editor: this.editor,
        anchorTypes: this.options.anchorTypes,
        storage: this.storage,
        onUpdate: this.options.onUpdate?.bind(this),
      });

      this.storage.content = updatedContent;
    }, 300);

    if (!this.options.scrollParent) {
      return;
    }

    const scrollParent = typeof this.options.scrollParent === 'function'
      ? this.options.scrollParent()
      : this.options.scrollParent;
    scrollParent && scrollParent.addEventListener('scroll', this.storage.scrollHandler);
  },
  onDestroy() {
    if (!this.options.scrollParent) {
      return;
    }
    const scrollParent = typeof this.options.scrollParent === 'function'
      ? this.options.scrollParent()
      : this.options.scrollParent;
    scrollParent && scrollParent.removeEventListener('scroll', this.storage.scrollHandler);
  },
  addProseMirrorPlugins() {
    return [
      createTableOfContentsPlugin({ getId: this.options.getId, anchorTypes: this.options.anchorTypes }),
    ];
  },
});

export {
  TableOfContents,
  createTableOfContentsPlugin as TableOfContentsPlugin,
  TableOfContents as default,
  getHeadlineLevel,
  getHierarchicalIndexes,
  getLastHeadingOnLevel,
  getLinearIndexes,
};
