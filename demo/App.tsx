import { useRef, useState } from 'react';
import { Space, Button, Select, FloatButton } from 'antd/es';
import { Content } from '@tiptap/core';
import { type Editor as EditorType } from '@tiptap/react';
import { Editor, EditorRender, LocaleProvider, type EditorRef } from '@/index';
import zh_CN from '@/i18n/locale/zh_CN';
import zh_TW from '@/i18n/locale/zh_TW';
import en_US from '@/i18n/locale/en_US';
import ja_JP from '@/i18n/locale/ja_JP';
import ko_KR from '@/i18n/locale/ko_KR';
import { TableOfContents } from '@/extensions/TableOfContents';
import FileHandler from '@/extensions/FileHandler';
import 'antd/es/style';
import { MenuItems, FloatMenuItems } from './MenuItems';
import TableOfContent from './TableOfContent';
import { doc as defaultContent } from './doc';

import './index.scss';

const locales = [
  { key: 'zh_CN', label: '中文', locale: zh_CN },
  { key: 'zh_TW', label: '繁体中文', locale: zh_TW },
  { key: 'ja_JP', label: '日本語', locale: ja_JP },
  { key: 'ko_KR', label: '한국어', locale: ko_KR },
  { key: 'en_US', label: 'English', locale: en_US },
];

const getFileType = (mimeType: string) => {
  if (mimeType.includes('image')) {
    return 'image';
  }

  if (['video/mp4', 'video/webm'].includes(mimeType)) {
    return 'video';
  }

  return 'file';
};

const insertContent = (editor: EditorType, files: File[], pos: number) => {
  editor
    .chain()
    .insertContentAt(
      pos,
      files.map((file) => ({
        type: getFileType(file.type),
        attrs: {
          src: URL.createObjectURL(file),
          size: file.size,
          name: file.name,
        },
      })),
    )
    .focus()
    .run();
};

const App = () => {
  const [items, setItems] = useState([]);
  const [content, setContent] = useState<Content>();
  const [locale, setLocale] = useState(zh_CN);
  const editorRef = useRef<EditorRef>(null);

  const extensions = [
    TableOfContents.configure({
      onUpdate: (content: any) => setItems(content),
    }),
    FileHandler.configure({
      onDrop: insertContent,
      onPaste: insertContent,
    }),
  ];

  const onLanguageChange = (val: string) => {
    const { locale } = locales.find(({ key }) => key === val)!;
    setLocale(locale);
  };

  return (
    <div className="page">
      <div className="sidebar">
        <div className="sidebar-options">
          <div className="label-large">目录</div>
          <TableOfContent
            editor={editorRef.current?.editor as EditorType | undefined}
            items={items}
          />
        </div>
      </div>
      <div className="editor-box">
        <LocaleProvider locale={locale}>
          <Editor
            content={defaultContent}
            ref={editorRef}
            extensions={extensions}
            useTextMenu
            renderMenus={() => <MenuItems />}
            renderFloatMenus={() => <FloatMenuItems />}
          />
        </LocaleProvider>
        <Space wrap style={{ marginTop: 16, marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={() => {
              const json = editorRef.current?.getJSON();
              console.log(json);
              setContent(json);
            }}
          >
            保存JSON
          </Button>
          <Button
            type="primary"
            onClick={() => {
              const html = editorRef.current?.getHTML();
              console.log(html);
              setContent(html);
            }}
          >
            保存HTML
          </Button>
          <Button
            type="primary"
            onClick={() => {
              console.log(editorRef.current?.getText());
            }}
          >
            保存Text
          </Button>

          <Select
            style={{ width: 150 }}
            placeholder="选择语言"
            onChange={onLanguageChange}
          >
            {locales.map(({ key, label }) => (
              <Select.Option key={key} value={key}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Space>

        {content && (
          <>
            <hr />
            <EditorRender content={content} style={{ marginTop: 24 }} />
          </>
        )}
      </div>
      <FloatButton.BackTop />
    </div>
  );
};
export default App;
