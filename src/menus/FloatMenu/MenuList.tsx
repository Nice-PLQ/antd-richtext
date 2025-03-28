import React, { useRef, useState, useMemo } from 'react';
import { Divider } from 'antd/es';
import type { Node } from '@tiptap/pm/model';
import type { Level } from '@tiptap/extension-heading';
import {
  ClearOutlined,
  DeleteOutlined,
  FontSizeOutlined,
  LineOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  TableOutlined,
  CheckSquareOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  AlignLeftOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CopyOutlined,
  LayoutOutlined,
} from '@ant-design/icons';
import { ReactComponent as Heading1Svg } from '@/assets/icons/heading1.svg';
import { ReactComponent as Heading2Svg } from '@/assets/icons/heading2.svg';
import { ReactComponent as Heading3Svg } from '@/assets/icons/heading3.svg';
import { ReactComponent as Heading4Svg } from '@/assets/icons/heading4.svg';
import { ReactComponent as Heading5Svg } from '@/assets/icons/heading5.svg';
import { ReactComponent as Heading6Svg } from '@/assets/icons/heading6.svg';
import { ReactComponent as FileSvg } from '@/assets/icons/file.svg';
import { ReactComponent as HighlightBlockSvg } from '@/assets/icons/highlight-block.svg';
import { ReactComponent as BlockquoteSvg } from '@/assets/icons/blockquote.svg';
import { ReactComponent as CodeBlockSvg } from '@/assets/icons/code-block.svg';
import { ReactComponent as ColumnSvg } from '@/assets/icons/column.svg';
import { prefix } from '@/constants';
import { useEditorContext, useLocale } from '@/context';
import IframeEdit from '@/components/IframeBubbleMenu/IframeEdit';
import MenuButton from '@/components/MenuButton';
import BlockMenuButton from '@/components/MenuButton/Block';
import TableRowColumn from '@/components/TableRowColumn';
import Columns from '@/components/Columns';
import ImageInput, { ImageRef } from '@/components/MediaType/Image';
import VideoInput, { VideoRef } from '@/components/MediaType/Video';
import FileInput, { FileRef } from '@/components/MediaType/File';
import { FloatMenuConfig } from './types';
import { useFloatMenuCommands } from './actions';

interface MenuListProps {
  pos: number;
  node: Node;
  config: FloatMenuConfig;
  onClose: () => void;
}

const MenuList: React.FC<MenuListProps> = (props) => {
  const { pos, node, config, onClose } = props;
  const editor = useEditorContext();
  const locale = useLocale();
  const actions = useFloatMenuCommands(editor);
  const imageRef = useRef<ImageRef>(null);
  const videoRef = useRef<VideoRef>(null);
  const fileRef = useRef<FileRef>(null);
  const [tableVisible, setTableVisible] = useState(false);
  const [columnVisible, setColumnVisible] = useState(false);
  const [iframeVisible, setIframeVisible] = useState(false);
  const [alignVisible, setAlignVisible] = useState(false);
  const [indentVisible, setIndentVisible] = useState(false);

  const headingMapping = useMemo(
    () => [
      { label: locale.heading1, level: 1, icon: <Heading1Svg /> },
      { label: locale.heading2, level: 2, icon: <Heading2Svg /> },
      { label: locale.heading3, level: 3, icon: <Heading3Svg /> },
      { label: locale.heading4, level: 4, icon: <Heading4Svg /> },
      { label: locale.heading5, level: 5, icon: <Heading5Svg /> },
      { label: locale.heading6, level: 6, icon: <Heading6Svg /> },
    ],
    [locale],
  );

  const headings = useMemo(
    () =>
      (config.heading || [1, 2, 3, 4]).map(
        (level) => headingMapping[level - 1],
      ),
    [config.heading],
  );

  return (
    <>
      <div className={`${prefix}-float-menu-base-menu`}>
        <MenuButton
          tooltip={locale.text}
          icon={<FontSizeOutlined />}
          selected={node.type.name === 'paragraph'}
          onClick={actions.onParagraph}
        />
        {headings.map(({ label, level, icon }) => (
          <MenuButton
            key={level}
            tooltip={label}
            icon={icon}
            selected={
              node.type.name === 'heading' && node.attrs.level === level
            }
            onClick={() => actions.onHeading(level as Level)}
          />
        ))}
        <MenuButton
          tooltip={locale.blockquote}
          icon={<BlockquoteSvg />}
          selected={node.type.name === 'blockquote'}
          onClick={actions.onBlockquote}
        />
        <MenuButton
          tooltip={locale.bulletList}
          icon={<UnorderedListOutlined />}
          selected={node.type.name === 'bulletList'}
          onClick={actions.onBulletList}
        />
        <MenuButton
          tooltip={locale.orderedList}
          icon={<OrderedListOutlined />}
          selected={node.type.name === 'orderedList'}
          onClick={actions.onOrderList}
        />
        <MenuButton
          tooltip={locale.taskList}
          icon={<CheckSquareOutlined />}
          selected={node.type.name === 'taskList'}
          onClick={actions.onTaskList}
        />
        <MenuButton
          tooltip={locale.highlightBlock}
          icon={<HighlightBlockSvg />}
          selected={node.type.name === 'highlightBlock'}
          onClick={actions.onHighlightBlock}
        />
        <MenuButton
          tooltip={locale.codeBlock}
          icon={<CodeBlockSvg />}
          selected={node.type.name === 'codeBlock'}
          onClick={actions.onCodeBlock}
        />
        <MenuButton
          tooltip={locale.horizontalLine}
          icon={<LineOutlined />}
          selected={node.type.name === 'horizontalRule'}
          onClick={() => actions.onHorizontalLine(pos)}
        />
      </div>

      <Divider className={`${prefix}-float-menu-divider`} />

      <BlockMenuButton
        title={locale.file}
        icon={
          <span className="anticon">
            <FileSvg />
          </span>
        }
        onClick={() => fileRef.current?.click()}
      />
      <BlockMenuButton
        title={locale.image}
        icon={<PictureOutlined />}
        onClick={() => imageRef.current?.click()}
      />
      <BlockMenuButton
        title={locale.video}
        icon={<VideoCameraOutlined />}
        onClick={() => videoRef.current?.click()}
      />

      <Divider className={`${prefix}-float-menu-divider`} />

      <BlockMenuButton
        title={locale.table}
        icon={<TableOutlined />}
        visible={tableVisible}
        onVisibleChange={(v) => setTableVisible(v)}
      >
        <TableRowColumn
          onClick={(row, column) => {
            actions.onInsertTable(row, column, pos, node);
            setTableVisible(false);
            onClose();
          }}
        />
      </BlockMenuButton>
      <BlockMenuButton
        title={locale.columns}
        icon={
          <span className="anticon">
            <FileSvg />
          </span>
        }
        visible={columnVisible}
        onVisibleChange={(v) => setColumnVisible(v)}
      >
        <Columns
          onClick={(column) => {
            actions.onInsertColumns(column, pos, node);
            setColumnVisible(false);
            onClose();
          }}
        />
      </BlockMenuButton>

      <BlockMenuButton
        title={locale.iframe}
        icon={<LayoutOutlined />}
        visible={iframeVisible}
        onVisibleChange={(v) => setIframeVisible(v)}
      >
        <IframeEdit
          title={locale.editIframe}
          onCancel={onClose}
          onOk={(src) => {
            actions.onInsertIframe(src, pos, node);
            setIframeVisible(false);
            onClose();
          }}
        />
      </BlockMenuButton>

      <BlockMenuButton
        title={locale.align}
        icon={<AlignLeftOutlined />}
        visible={alignVisible}
        onVisibleChange={(v) => setAlignVisible(v)}
      >
        <BlockMenuButton
          title={locale.alignLeft}
          icon={<AlignLeftOutlined />}
          onClick={() => {
            actions.onAlign('left', pos);
            setAlignVisible(false);
            onClose();
          }}
        />
        <BlockMenuButton
          title={locale.alignCenter}
          icon={<AlignCenterOutlined />}
          selected={editor.isActive({ textAlign: 'center' })}
          onClick={() => {
            actions.onAlign('center', pos);
            setAlignVisible(false);
            onClose();
          }}
        />
        <BlockMenuButton
          title={locale.alignRight}
          icon={<AlignRightOutlined />}
          onClick={() => {
            actions.onAlign('right', pos);
            setAlignVisible(false);
            onClose();
          }}
        />
        <BlockMenuButton
          title={locale.alignJustify}
          icon={<MenuOutlined />}
          onClick={() => {
            actions.onAlign('justify', pos);
            setAlignVisible(false);
            onClose();
          }}
        />
      </BlockMenuButton>

      <BlockMenuButton
        title={locale.indentTitle}
        icon={<MenuUnfoldOutlined />}
        visible={indentVisible}
        onVisibleChange={(v) => setIndentVisible(v)}
      >
        <BlockMenuButton
          title={locale.indent}
          icon={<MenuUnfoldOutlined />}
          onClick={() => {
            actions.onIndent(pos);
            setIndentVisible(false);
            onClose();
          }}
        />
        <BlockMenuButton
          title={locale.outdent}
          icon={<MenuFoldOutlined />}
          onClick={() => {
            actions.onOutdent(pos);
            setIndentVisible(false);
            onClose();
          }}
        />
      </BlockMenuButton>

      <Divider className={`${prefix}-float-menu-divider`} />

      <BlockMenuButton
        title={locale.clearFormat}
        icon={<ClearOutlined />}
        onClick={() => {
          actions.onClearFormat(pos, node);
          onClose();
        }}
      />
      <BlockMenuButton
        title={locale.copyNode}
        icon={<CopyOutlined />}
        onClick={() => {
          actions.onCopyNode(pos, node);
          onClose();
        }}
      />
      <BlockMenuButton
        title={locale.delete}
        danger
        icon={<DeleteOutlined />}
        onClick={() => {
          actions.onDeleteNode(pos);
          onClose();
        }}
      />

      <ImageInput
        ref={imageRef}
        {...config.image}
        onChange={(images) => {
          actions.onInsertFile(images, pos, node);
          onClose();
        }}
      />
      <VideoInput
        ref={videoRef}
        {...config.video}
        onChange={(videos) => {
          actions.onInsertFile(videos, pos, node);
          onClose();
        }}
      />
      <FileInput
        ref={fileRef}
        {...config.file}
        onChange={(files) => {
          actions.onInsertFile(files, pos, node);
          onClose();
        }}
      />
    </>
  );
};

export default MenuList;
