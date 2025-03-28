import { useCallback } from 'react';
import type { Editor } from '@tiptap/react';
import type { Node } from '@tiptap/pm/model';
import type { NodeSelection } from '@tiptap/pm/state';
import type { Level } from '@tiptap/extension-heading';
import type { JSONContent } from '@tiptap/core';

const getPos = (pos: number, node: Node) =>
  node.type.name === 'paragraph' && !node.textContent
    ? pos
    : pos + (node.nodeSize || 0);

export const useFloatMenuCommands = (editor: Editor) => {
  const onParagraph = useCallback(
    () => editor.chain().focus().setParagraph().run(),
    [editor],
  );
  const onHeading = useCallback(
    (level: Level) => editor.chain().focus().setHeading({ level }).run(),
    [editor],
  );
  const onBlockquote = useCallback(
    () => editor.chain().focus().toggleBlockquote().run(),
    [editor],
  );
  const onBulletList = useCallback(
    () => editor.chain().focus().toggleBulletList().run(),
    [editor],
  );
  const onOrderList = useCallback(
    () => editor.chain().focus().toggleOrderedList().run(),
    [editor],
  );
  const onTaskList = useCallback(
    () => editor.chain().focus().toggleTaskList().run(),
    [editor],
  );
  const onHighlightBlock = useCallback(
    () => editor.chain().focus().toggleHighlightBlock().run(),
    [editor],
  );
  const onCodeBlock = useCallback(
    () => editor.chain().focus().toggleCodeBlock().run(),
    [editor],
  );
  const onHorizontalLine = useCallback(
    (pos: number) =>
      editor.chain().focus().setNodeSelection(pos).setHorizontalRule().run(),
    [editor],
  );
  const onAlign = useCallback(
    (align: string, pos: number) =>
      editor.chain().setNodeSelection(pos).setTextAlign(align).run(),
    [editor],
  );

  const onIndent = useCallback(
    (pos: number) => editor.chain().setNodeSelection(pos).setIndent().run(),
    [editor],
  );

  const onOutdent = useCallback(
    (pos: number) => editor.chain().setNodeSelection(pos).setOutdent().run(),
    [editor],
  );

  const onInsertFile = useCallback(
    (files: JSONContent[], pos: number, node: Node) => {
      editor
        .chain()
        .focus()
        .setNodeSelection(getPos(pos, node))
        .command(({ commands }) => commands.insertContent(files))
        .command(({ commands }) => commands.createParagraphNear())
        .run();
    },
    [editor],
  );

  const onInsertTable = useCallback(
    (row: number, column: number, pos: number, node: Node) => {
      editor
        .chain()
        .focus()
        .setNodeSelection(getPos(pos, node))
        .insertTable({ rows: row + 1, cols: column + 1, withHeaderRow: false })
        .run();
    },
    [editor],
  );

  const onInsertColumns = useCallback(
    (column: number, pos: number, node: Node) => {
      editor
        .chain()
        .setNodeSelection(getPos(pos, node))
        .setColumns({ column })
        .focus(editor.state.selection.head - 1)
        .run();
    },
    [editor],
  );

  const onInsertIframe = useCallback(
    (src: string, pos: number, node: Node) => {
      editor
        .chain()
        .setNodeSelection(getPos(pos, node))
        .command(({ commands }) => commands.setIframe({ src, width: 500 }))
        .focus()
        .run();
    },
    [editor],
  );

  const onClearFormat = useCallback(
    (pos: number, node: Node) => {
      const chain = editor.chain();
      chain.setNodeSelection(pos).unsetAllMarks();

      if (node?.type.name !== 'paragraph') {
        chain.setParagraph();
      }
      chain.run();
    },
    [editor],
  );

  const onCopyNode = useCallback(
    (pos: number, node: Node) => {
      editor.commands.setNodeSelection(pos);

      const { $anchor } = editor.state.selection;
      const selectedNode =
        $anchor.node(1) || (editor.state.selection as NodeSelection).node;

      editor
        .chain()
        .setMeta('hideFloatMenu', true)
        .insertContentAt(pos + (node?.nodeSize || 0), selectedNode.toJSON())
        .run();
    },
    [editor],
  );

  const onDeleteNode = useCallback(
    (pos: number) => {
      editor
        .chain()
        .setMeta('hideFloatMenu', true)
        .setNodeSelection(pos)
        .deleteSelection()
        .run();
    },
    [editor],
  );

  return {
    onParagraph,
    onHeading,
    onBlockquote,
    onBulletList,
    onOrderList,
    onTaskList,
    onHighlightBlock,
    onCodeBlock,
    onHorizontalLine,
    onAlign,
    onIndent,
    onOutdent,
    onInsertFile,
    onInsertTable,
    onInsertColumns,
    onInsertIframe,
    onClearFormat,
    onCopyNode,
    onDeleteNode,
  };
};
