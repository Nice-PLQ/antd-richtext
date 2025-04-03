import { message } from 'antd/es';
import { GithubFilled } from '@ant-design/icons';
import {
  Bold,
  Italic,
  Undo,
  Redo,
  Divider,
  Strike,
  Subscript,
  Superscript,
  Underline,
  Heading,
  Code,
  CodeBlock,
  HorizontalLine,
  Blockquote,
  ListItem,
  Color,
  HighlightColor,
  TextAlign,
  Indent,
  Outdent,
  Columns,
  TaskList,
  Table,
  Image,
  Video,
  Link,
  File,
  LineHeight,
  HighlightBlock,
  FontSize,
  Fullscreen,
  Iframe,
  SearchReplace,
  ClearFormat,
  MenuContainer,
  FloatMenu,
  SourceCode,
} from '@/index';
import MenuButton from '@/components/MenuButton';

const imageConfig = {
  maxSize: 1024 * 1024 * 10,
  onUploadFile: (fileData) => {
    console.log(fileData);
  },
};

const videoConfig = {
  maxSize: 1024 * 1024 * 300,
  onUploadFile: (fileData) => {
    console.log(fileData);
    const { file, onSuccess } = fileData;
    onSuccess({ src: URL.createObjectURL(file) });
  },
};

const fileConfig = {
  maxSize: 1024 * 1024 * 300,
  beforeUpload: (files) => {
    if (files.some((file) => file.name.endsWith('.zip'))) {
      message.error('文件类型不支持');
      return false;
    }
    return true;
  },
  onDownloadFile: (fileData) => {
    console.log(fileData);
  },
  onUploadFile: (fileData) => {
    console.log(fileData);
    const { file, onSuccess } = fileData;
    onSuccess({ src: URL.createObjectURL(file) });
  },
};

export function MenuItems() {
  return (
    <MenuContainer>
      <Undo />
      <Redo />

      <Divider />

      <Heading />
      <FontSize />
      <Bold />
      <Italic />
      <Strike />
      <Underline />
      <Subscript />
      <Superscript />
      <Color />
      <HighlightColor />
      <Code />

      <Divider />

      <ListItem />
      <LineHeight />
      <TextAlign />
      <Outdent />
      <Indent />

      <Divider />

      <Image {...imageConfig} />
      <Video {...videoConfig} />
      <File {...fileConfig} />
      <CodeBlock />
      <HighlightBlock />
      <Blockquote />
      <Link />
      <HorizontalLine />
      <Table />
      <Columns />
      <TaskList />
      <Iframe />
      <SearchReplace />
      <ClearFormat />

      <Divider />

      <SourceCode />

      <Fullscreen
        onFullscreenChange={(fullscreen) => {
          if (fullscreen) {
            document.body.classList.add('hidden');
          } else {
            document.body.classList.remove('hidden');
          }
        }}
      />
      <MenuButton
        tooltip="gitlab"
        style={{ marginLeft: 'auto' }}
        icon={<GithubFilled />}
        onClick={() => {
          window.open('https://github.com/Nice-PLQ/antd-richtext');
        }}
      />
    </MenuContainer>
  );
}

export function FloatMenuItems() {
  return (
    <FloatMenu
      config={{
        image: imageConfig,
        video: videoConfig,
        file: fileConfig,
      }}
    />
  );
}
