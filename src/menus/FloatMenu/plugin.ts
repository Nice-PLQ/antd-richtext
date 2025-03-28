import { Extension as TiptapExtension } from '@tiptap/core';
import { PluginKey, Plugin } from '@tiptap/pm/state';
import tippy from 'tippy.js';

// 获取鼠标位置下的节点信息
const getNodeAtPosition = ({ x, y, direction, editor }) => {
  let resultElement = null;
  let resultNode = null;
  let pos = null;
  let currentX = x;

  while (resultNode === null && currentX < window.innerWidth && currentX > 0) {
    const elements = document.elementsFromPoint(currentX, y);
    const proseMirrorIndex = elements.findIndex((el) =>
      el.classList.contains('ProseMirror'),
    );
    const targetElements = elements.slice(0, proseMirrorIndex);

    if (targetElements.length > 0) {
      const targetElement = targetElements[0];
      resultElement = targetElement;
      pos = editor.view.posAtDOM(targetElement, 0);

      if (pos >= 0) {
        resultNode = editor.state.doc.nodeAt(Math.max(pos - 1, 0));
        if (resultNode && resultNode.isText) {
          resultNode = editor.state.doc.nodeAt(Math.max(pos - 1, 0));
        }
        if (!resultNode) {
          resultNode = editor.state.doc.nodeAt(Math.max(pos, 0));
        }
        break;
      }
    }

    if (direction === 'left') {
      currentX -= 1;
    } else {
      currentX += 1;
    }
  }

  return { resultElement, resultNode, pos: pos !== null ? pos : null };
};

// 移除元素
function removeElement(element) {
  element.parentNode?.removeChild(element);
}

// 获取节点的父节点
const getParentNode = (state, pos) => {
  const resolvedPos = state.resolve(pos);
  const { depth } = resolvedPos;

  if (depth === 0) {
    return pos;
  }

  return resolvedPos.pos - resolvedPos.parentOffset - 1;
};

// 获取节点的根节点
const getRootNode = (doc, pos) => {
  const node = doc.nodeAt(pos);
  const resolvedPos = doc.resolve(pos);
  let { depth } = resolvedPos;
  let rootNode = node;

  while (depth > 0) {
    const parentNode = resolvedPos.node(depth);
    depth -= 1;
    if (depth === 0) {
      rootNode = parentNode;
    }
  }

  return rootNode;
};

// 获取元素的父节点
const getParentElement = (view, element) => {
  let currentElement = element;
  while (
    currentElement &&
    currentElement.parentNode &&
    currentElement.parentNode !== view.dom
  ) {
    currentElement = currentElement.parentNode;
  }
  return currentElement;
};

// 插件键
const floatMenuPluginKey = new PluginKey('floatMenu');

// 创建拖动句柄插件
const createFloatMenuPlugin = ({
  pluginKey = floatMenuPluginKey,
  element,
  editor,
  tippyOptions = {},
  onNodeChange,
}) => {
  const container = document.createElement('div');
  let relativePosition = null;
  let isLocked = false;
  let currentNode = null;
  let currentPos = -1;
  let tippyInstance = null;

  return new Plugin({
    key: typeof pluginKey === 'string' ? new PluginKey(pluginKey) : pluginKey,
    state: {
      init: () => ({ locked: false }),
      apply(tr, value) {
        const lockFloatMenu = tr.getMeta('lockFloatMenu');
        const hideFloatMenu = tr.getMeta('hideFloatMenu');

        if (lockFloatMenu !== undefined) {
          isLocked = lockFloatMenu;
        }

        if (hideFloatMenu && relativePosition) {
          relativePosition.hide();
          isLocked = false;
          currentNode = null;
          currentPos = -1;
          onNodeChange?.({ editor, node: null, pos: -1 });
          return value;
        }

        if (tr.docChanged && currentPos !== -1 && element && relativePosition) {
          const mappedPos = tr.mapping.map(currentPos);
          if (mappedPos !== currentPos) {
            currentPos = mappedPos;
            relativePosition = null;
          }
        }

        return value;
      },
    },
    view: (view) => {
      // eslint-disable-next-line no-param-reassign
      element.style.pointerEvents = 'auto';
      view.dom.parentElement?.appendChild(container);
      container.appendChild(element);
      container.style.pointerEvents = 'none';
      container.style.position = 'absolute';
      container.style.top = '0';
      container.style.left = '0';

      tippyInstance = tippy(view.dom, {
        getReferenceClientRect: null,
        interactive: true,
        trigger: 'manual',
        placement: 'left-start',
        hideOnClick: false,
        duration: 100,
        zIndex: 2,
        popperOptions: {
          modifiers: [
            { name: 'flip', enabled: false },
            {
              name: 'preventOverflow',
              options: { rootBoundary: 'document', mainAxis: false },
            },
          ],
        },
        ...tippyOptions,
        appendTo: container,
        content: element,
      });

      return {
        update(view, prevState) {
          if (!element || !tippyInstance) {
            return;
          }

          if (view.state.doc.eq(prevState.doc) || currentPos === -1) {
            return;
          }

          let domNode = view.nodeDOM(currentPos);
          domNode = getParentElement(view, domNode);

          if (domNode === view.dom) {
            return;
          }

          if (domNode?.nodeType !== 1) {
            return;
          }

          const pos = view.posAtDOM(domNode, 0);
          const rootNode = getRootNode(view.state.doc, pos);
          const parentNodePos = getParentNode(view.state.doc, pos);

          currentNode = rootNode;
          currentPos = parentNodePos;
          onNodeChange?.({ editor, node: currentNode, pos: currentPos });

          tippyInstance.setProps({
            getReferenceClientRect: () =>
              (domNode as HTMLElement).getBoundingClientRect(),
          });
        },
        destroy() {
          tippyInstance?.destroy();
          removeElement(container);
        },
      };
    },
    props: {
      handleDOMEvents: {
        mouseleave: (view, event) => {
          if (
            !isLocked &&
            event.target &&
            !container.contains(event.relatedTarget as HTMLDivElement)
          ) {
            tippyInstance?.hide();
            currentNode = null;
            currentPos = -1;
            onNodeChange?.({ editor, node: null, pos: -1 });
          }
          return false;
        },
        mousemove(view, event) {
          if (!element || !tippyInstance || isLocked) {
            return false;
          }

          const { resultElement } = getNodeAtPosition({
            x: event.clientX,
            y: event.clientY,
            direction: 'right',
            editor,
          });

          if (!resultElement) {
            return false;
          }

          let domNode = resultElement;
          domNode = getParentElement(view, domNode);

          if (domNode === view.dom) {
            return false;
          }

          if (domNode?.nodeType !== 1) {
            return false;
          }

          const pos = view.posAtDOM(domNode, 0);
          const rootNode = getRootNode(view.state.doc, pos);
          const parentNodePos = getParentNode(view.state.doc, pos);

          if (rootNode !== currentNode) {
            currentNode = rootNode;
            currentPos = parentNodePos;
            onNodeChange?.({ editor, node: currentNode, pos: currentPos });

            tippyInstance.setProps({
              getReferenceClientRect: () => domNode.getBoundingClientRect(),
            });
            tippyInstance.show();
          }

          return false;
        },
      },
    },
  });
};

const FloatMenu = TiptapExtension.create({
  name: 'floatMenu',
  addOptions() {
    return {
      render() {
        const element = document.createElement('div');
        element.classList.add('float-menu');
        return element;
      },
      tippyOptions: {},
      onNodeChange: () => null,
    };
  },
  addProseMirrorPlugins() {
    const element = this.options.render();
    return [
      createFloatMenuPlugin({
        tippyOptions: this.options.tippyOptions,
        element,
        editor: this.editor,
        onNodeChange: this.options.onNodeChange,
      }),
    ];
  },
});

export { FloatMenu, createFloatMenuPlugin, floatMenuPluginKey };
