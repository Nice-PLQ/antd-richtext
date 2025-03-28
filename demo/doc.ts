export const doc = `<h1 class="block at-heading" id="at-NhrWkkhKxCO" data-toc-id="at-NhrWkkhKxCO">富文本编辑器（for <a target="_blank" rel="noopener noreferrer nofollow" class="at-link" href="https://4x-ant-design.antgroup.com/">Antd@4.x</a>）</h1><h2 class="block at-heading" id="o8zrkajVtH" data-toc-id="o8zrkajVtH">安装与使用</h2><hr class="block at-horizontal-rule"><pre class="block at-code-block"><code class="language-bash">npm install antd-richtext</code></pre><p class="block at-block">或者</p><pre class="block at-code-block"><code class="language-bash">yarn add antd-richtext</code></pre><p class="block at-block">在编辑模式下，可按需导入需要支持的编辑功能，如<code>Undo</code>、<code>Redo</code>、<code>Heading</code>、<code>Bold</code> ...，<a target="_blank" rel="noopener noreferrer nofollow" class="at-link t-editor-link" href="https://code.djicorp.com/fe/tiptap-editor/-/blob/master/src/menus/index.ts">查阅全部菜单项</a></p><pre class="block at-code-block"><code class="language-typescript">import { useRef } from 'react';
import {
  Editor,
  type EditorRef,
  MenuContainer,
  Undo,
  Redo,
  Divider // 菜单分割线
  Heading,
  Bold,
  ...
} from 'antd-richtext';

// 菜单项
const MenuItems = () =&gt; (
  &lt;MenuContainer&gt;
    &lt;Undo /&gt;
    &lt;Redo /&gt;

    &lt;Divider /&gt;

    &lt;Heading /&gt;
    &lt;Bold /&gt;
    ...
  &lt;/MenuContainer&gt;
);

const YourComponent = () =&gt; {
  const editorRef = useRef&lt;EditorRef | null&gt;(null);
  return (
    &lt;&gt;
      &lt;Editor
        placeholder="请输入内容"
        ref={editorRef}
        renderMenus={() =&gt; &lt;MenuItems /&gt;}
      /&gt;
      &lt;button onClick={() =&gt; editorRef.current?.getJSON()}&gt;获取JSON格式内容&lt;/button&gt;
      &lt;button onClick={() =&gt; editorRef.current?.getHTML()}&gt;获取HTML格式内容&lt;/button&gt;
      &lt;button onClick={() =&gt; editorRef.current?.getText()}&gt;获取Text格式内容&lt;/button&gt;
    &lt;/&gt;
  );
};</code></pre><p class="block at-block">纯渲染模式下，可使用<code>EditorRender</code>组件渲染富文本内容，此时没有编辑器的菜单项。</p><pre class="block at-code-block"><code class="language-typescript">import { useRef } from 'react';
import { EditorRender, type EditorRenderRef } from 'antd-richtext';

const YourComponent = () =&gt; {
  const content = '&lt;h1&gt;antd-richtext&lt;/h1&gt;';
  const editorRef = useRef&lt;EditorRenderRef | null&gt;(null);

  return &lt;EditorRender ref={editorRef} content={content} /&gt;;
};</code></pre><h2 class="block at-heading" id="rtRISErqAX" data-toc-id="rtRISErqAX">多语言配置</h2><hr class="block at-horizontal-rule"><p class="block at-block">编辑器多语言支持简体中文、繁体、英语、日语、韩语等5中语言，也可以自行扩展其他语言。</p><pre class="block at-code-block"><code class="language-typescript">import { useState, useRef, useMemo } from 'react';
import { useLocale } from 'umi';
import {
  Editor,
  type EditorRef,
  LocaleProvider,
  MenuContainer,
  Heading,
  Bold,
  ...
} from 'antd-richtext';
import zh_CN from 'antd-richtext/esm/i18n/locale/zh_CN';
import zh_TW from 'antd-richtext/esm/i18n/locale/zh_TW';
import en_US from 'antd-richtext/esm/i18n/locale/en_US';
import ja_JP from 'antd-richtext/esm/i18n/locale/ja_JP';
import ko_KR from 'antd-richtext/esm/i18n/locale/ko_KR';

const locales = {
  zh: zh_CN,
  zhTw: zh_TW,
  en: en_US,
  ja: ja_JP,
  ko: ko_KR,
};

const YourComponent = () =&gt; {
  const content = '&lt;h1&gt;antd-richtext&lt;/h1&gt;';
  const editorRef = useRef&lt;EditorRef | null&gt;(null);
  const [locale] = useLocale();
  const editorLocale = useMemo(() =&gt; locales[locale] || zh_CN, [locale]);
  return (
    &lt;LocaleProvider locale={editorLocale}&gt;
      &lt;Editor
        placeholder="请输入内容"
        content={content}
        ref={editorRef}
        renderMenus={() =&gt; &lt;MenuItems /&gt;}
      /&gt;
    &lt;/LocaleProvider&gt;
  );
};</code></pre><h2 class="block at-heading" id="jW8cAuj0lub" data-toc-id="jW8cAuj0lub">Menu配置</h2><hr class="block at-horizontal-rule"><p class="block at-block">一些菜单项提供了配置属性，具体如下<span style="font-size: 20px; color: rgb(31, 31, 31)">👇</span></p><h4 class="block at-heading" id="t-editor-41d0Nd99rv8" data-toc-id="t-editor-41d0Nd99rv8">1. Heading标题</h4><pre class="block at-code-block"><code class="language-typescript">// 支持配置等级，1-6
&lt;Heading levels={[1, 2, 3, 4, 5, 6]} /&gt;</code></pre><h4 class="block at-heading" id="t-editor-9EHxQGER8Cr" data-toc-id="t-editor-9EHxQGER8Cr">2. LineHeight行高</h4><pre class="block at-code-block"><code class="language-typescript">// 支持配置任意行高
&lt;LineHeight lineHeights={[1, 1.15, 1.3, 1.5, 2, 3]} /&gt;</code></pre><h4 class="block at-heading" id="t-editor-tGOZNGnDKMB" data-toc-id="t-editor-tGOZNGnDKMB">3. FontSize字体大小</h4><pre class="block at-code-block"><code class="language-typescript">// 支持配置任意字体大小，配置项必须包含px
&lt;FontSize fontSize={['14px', '18px', '22px']} /&gt;</code></pre><h4 class="block at-heading" id="t-editor-CWo960Wg1YC" data-toc-id="t-editor-CWo960Wg1YC">4. 图片视频文件</h4><p class="block at-block">Image、Video、File媒体文件配置大小和自定义上传，以Image为例：</p><p class="block at-block">1、使用编辑器内置的上传能力，通过<code>uploadAction</code> 属性配置上传地址，接口响应需返回 <span style="color: rgb(51, 85, 255)"><strong>src</strong> </span>字段</p><pre class="block at-code-block"><code class="language-typescript">&lt;Image
  // 接口响应需返回
  // { src: 'http://test.com/test.png' }
  // 或者
  // { data: { src: 'http://test.com/test.png' } }
  uploadAction="https://test.com/upload"
/&gt;</code></pre><p class="block at-block">2、自定义上传，通过<code>onUploadFile</code>属性实现自定义上传</p><pre class="block at-code-block"><code class="language-typescript">&lt;Image
  maxSize={1024 * 1024 * 300} // 允许上传的最大size
  onUploadFile={(fileData) =&gt; {
    const { file, onProgress, onSuccess } = fileData;
    // uploadFile为自定义的上传方法，上传成功后调用onSuccess设置图片地址
    // onProgress上传进度，值为0-100
    uploadFile({ file, onProgress }).then((url) =&gt; {
      onSuccess({ src: url });
    });
  }}
/&gt;</code></pre><h4 class="block at-heading" id="t-editor-Y3l61kSbfVd" data-toc-id="t-editor-Y3l61kSbfVd">5. 字体颜色与背景色</h4><p class="block at-block">支持配置色板的预设颜色</p><pre class="block at-code-block"><code class="language-typescript">&lt;Color colorPreset={['red', 'blue']} /&gt;</code></pre><pre class="block at-code-block"><code class="language-typescript">&lt;HighlightColor colorPreset={['red', 'blue']} /&gt;</code></pre><h4 class="block at-heading" id="t-editor-ARezTHDBFR8" data-toc-id="t-editor-ARezTHDBFR8">6. Fullscreen全屏</h4><p class="block at-block">激活和取消全屏时触发<span style="color: rgb(51, 85, 255)"><strong>onFullscreenChange</strong></span>事件，同时编辑器的根节点会增加<code>fullscreen</code>的className，开发者通过事件和类名处理全屏显示逻辑</p><pre class="block at-code-block"><code class="language-typescript">&lt;Fullscreen
  onFullscreenChange={(fullscreen) =&gt; {
    if (fullscreen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }}
/&gt;</code></pre><h2 class="block at-heading" id="t-editor-c08JhP17eUC" data-toc-id="t-editor-c08JhP17eUC">块级悬浮菜单</h2><p class="block at-block">编辑器支持块级的悬浮菜单，需要自定引入<code>FloatMenu</code> 组件。<a target="_blank" rel="noopener noreferrer nofollow" class="at-link t-editor-link" href="https://code.djicorp.com/fe/tiptap-editor/-/blob/master/src/menus/FloatMenu/types.ts">config配置配置项</a></p><pre class="block at-code-block"><code class="language-typescript">import { useRef } from 'react';
import { Editor, type EditorRef, FloatMenu } from 'antd-richtext';

// 菜单项
const FloatMenuItems = () =&gt; (
  &lt;FloatMenu
    config={{
      image: {
        maxSize: 1024 * 1024 * 10,
        onUploadFile: (fileData) =&gt; {
          console.log(fileData);
        },
      },
      video: {
        maxSize: 1024 * 1024 * 300,
        onUploadFile: (fileData) =&gt; {
          const { file, onSuccess } = fileData;
          onSuccess({ src: URL.createObjectURL(file) });
        },
      },
      file: {
        maxSize: 1024 * 1024 * 300,
        beforeUpload: (files) =&gt; {
          if (files.some((file) =&gt; file.name.endsWith('.zip'))) {
            return false;
          }
          return true;
        },
        onDownloadFile: (fileData) =&gt; {
          console.log(fileData);
        },
        onUploadFile: (fileData) =&gt; {
          console.log(fileData);
          const { file, onSuccess } = fileData;
          onSuccess({ src: URL.createObjectURL(file) });
        },
      },
    }}
  /&gt;
);

const YourComponent = () =&gt; {
  const editorRef = useRef&lt;EditorRef | null&gt;(null);
  return (
    &lt;Editor
      placeholder="请输入内容"
      ref={editorRef}
      renderFloatMenus={() =&gt; &lt;FloatMenuItems /&gt;}
    /&gt;
  );
};
</code></pre><h2 class="block at-heading" id="2aS4tnzMkKT" data-toc-id="2aS4tnzMkKT">标题目录</h2><hr class="block at-horizontal-rule"><p class="block at-block"><span style="font-size: 20px; color: rgb(31, 31, 31)">👈 </span>如左侧的标题目录，默认标题目录不集成在编辑器内，需要自行将<code>TableOfContents</code>扩展声明在Editor的 <span style="color: rgb(51, 85, 255)"><strong>extensions </strong></span>属性中，接着自定义实现一个标题目录的UI。</p><pre class="block at-code-block"><code class="language-typescript">import { useState, MouseEvent } from 'react';
import {
  Editor,
  type EditorRef,
  MenuContainer,
  Heading,
  Bold,
  ...
} from 'antd-richtext';
// 导入标题目录扩展
import {
  TableOfContents,
} from 'antd-richtext/esm/extensions/TableOfContents';

interface ToCItem {
  id: string;
  isActive: boolean;
  isScrolledOver: boolean;
  itemIndex: number;
  level: number;
  textContent: string;
}

// 目录组件
const TableOfContent = ({
  items = [],
  editor,
}: {
  items: ToCItem[];
  editor?: Editor;
}) =&gt; {
  if (items.length === 0) {
    return null;
  }

  const onItemClick = (e: MouseEvent&lt;HTMLAnchorElement&gt;, id: string) =&gt; {
    e.preventDefault();

    if (editor) {
      const element = editor.view.dom.querySelector(\`[data-toc-id="\${id}"\`);
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    &lt;div className="table-of-contents"&gt;
      {items.map((item) =&gt; (
        &lt;a
          key={item.id}
          href={\`#\${item.id}\`}
          onClick={(e) =&gt; onItemClick(e, item.id)}
          className={item.isActive &amp;&amp; active}
          style={{ '--level': item.level }}
        &gt;
          {item.textContent}
        &lt;/a&gt;
      ))}
    &lt;/div&gt;
  );
};

const YourComponent = () =&gt; {
  const content = '&lt;h1&gt;antd-richtext&lt;/h1&gt;';
  const [items, setItems] = useState([]);
  const editorRef = useRef&lt;EditorRef | null&gt;(null);

  const extensions = [
    // 配置扩展
    TableOfContents.configure({
      onUpdate: (toc: ToCItem[]) =&gt; setItems(toc),
    }),
  ];

  return (
    &lt;&gt;
      &lt;TableOfContent
        editor={editorRef.current?.editor}
        items={items}
      /&gt;
      &lt;Editor
        placeholder="请输入内容"
        content={content}
        ref={editorRef}
        extensions={extensions}
      /&gt;
    &lt;/&gt;
  );
};</code></pre><h2 class="block at-heading" id="t-editor-VJhuVk7YMk" data-toc-id="t-editor-VJhuVk7YMk">拖拽与粘贴</h2><hr class="block at-horizontal-rule"><p class="block at-block">使用<code>FileHandler</code>扩展可以使编辑器支持将文件拖拽或粘贴到编辑器中，以图片为例</p><pre class="block at-code-block"><code class="language-typescript">// 导入FileHandler扩展
import { Editor, FileHandler } from 'antd-richtext';

const insertContent = (editor, files, pos) =&gt; {
  editor
    .chain()
    .insertContentAt(
      pos,
      files.map((file) =&gt; ({
        type: 'image', // image-图片、video-视频、file-文件
        attrs: {
          src: URL.createObjectURL(file),
          size: file.size,
          name: file.name,
          rowFile: file,
          // 上传地址
          uploadAction: 'https://your_upload_url',
          // 自定义上传，如果有该配置，将优先使用自定义上传。否则使用内部上传到uploadAction指定的地址
          uploadFileHandler: (fileData) =&gt; {
            const { onProgress, onSuccess } = fileData;
            // uploadFile为自定义的上传方法，上传成功后调用onSuccess
            // onProgress上传进度，值为0-100
            uploadFile({ file, onProgress }).then((url) =&gt; {
              onSuccess({ src: url });
            });
          },
        },
      })),
    )
    .focus()
    .run();
};

const YourComponent = () =&gt; {
  const content = '&lt;h1&gt;antd-richtext&lt;/h1&gt;';

  const extensions = [
    // 配置扩展
    FileHandler.configure({
      onDrop: insertContent,
      onPaste: insertContent,
    }),
  ];

  return (
    &lt;Editor
      placeholder="请输入内容"
      content={content}
      extensions={extensions}
    /&gt;
  );
};
</code></pre><h2 class="block at-heading" id="Z27ci1sA55" data-toc-id="Z27ci1sA55">API</h2><hr class="block at-horizontal-rule"><p class="block at-block">1、<strong>Editor </strong>编辑器API</p><table class="block at-table" style="min-width: 600px"><colgroup><col><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p class="block at-block">属性</p></th><th colspan="1" rowspan="1"><p class="block at-block">说明</p></th><th colspan="1" rowspan="1"><p class="block at-block">类型</p></th><th colspan="1" rowspan="1"><p class="block at-block">默认值</p></th></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>placeholder</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">编辑器占位符</p></td><td colspan="1" rowspan="1"><p class="block at-block">string</p></td><td colspan="1" rowspan="1"><p class="block at-block">-</p></td></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>editable</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">是否可编辑</p></td><td colspan="1" rowspan="1"><p class="block at-block">boolean</p></td><td colspan="1" rowspan="1"><p class="block at-block">true</p></td></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>readonly</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">是否只读（不展示菜单项）</p></td><td colspan="1" rowspan="1"><p class="block at-block">boolean</p></td><td colspan="1" rowspan="1"><p class="block at-block">false</p></td></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>className</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">编辑器 className</p></td><td colspan="1" rowspan="1"><p class="block at-block">string</p></td><td colspan="1" rowspan="1"><p class="block at-block">-</p></td></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>extensions</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">额外的编辑器扩展</p></td><td colspan="1" rowspan="1"><p class="block at-block">Array&lt;Extension&gt;</p></td><td colspan="1" rowspan="1"><p class="block at-block">[]</p></td></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>useTextMenu</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">启用文本划词菜单</p></td><td colspan="1" rowspan="1"><p class="block at-block">boolean</p></td><td colspan="1" rowspan="1"><p class="block at-block">false</p></td></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>renderMenus</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">编辑器的菜单项</p></td><td colspan="1" rowspan="1"><p class="block at-block">() =&gt; React.ReactNode</p></td><td colspan="1" rowspan="1"><p class="block at-block">-</p></td></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>renderFloatMenus</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">编辑器的块级悬浮菜单项</p></td><td colspan="1" rowspan="1"><p class="block at-block">() =&gt; &lt;FloatMenu <a target="_blank" rel="noopener noreferrer nofollow" class="at-link t-editor-link" href="https://code.djicorp.com/fe/tiptap-editor/-/blob/master/src/menus/FloatMenu/types.ts">config={...}</a> /&gt;</p></td><td colspan="1" rowspan="1"><p class="block at-block">-</p></td></tr></tbody></table><p class="block at-block">2、<strong>Editor </strong>实例</p><table class="block at-table" style="min-width: 450px"><colgroup><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p class="block at-block">名称</p></th><th colspan="1" rowspan="1"><p class="block at-block">说明</p></th><th colspan="1" rowspan="1"><p class="block at-block">类型</p></th></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>editor</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">编辑器实例</p></td><td colspan="1" rowspan="1"><p class="block at-block">Editor | null</p></td></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>getJSON</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">获取编辑器的 JSON 输出</p></td><td colspan="1" rowspan="1"><p class="block at-block">JSONContent</p></td></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>getHTML</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">获取编辑器的 HTML 输出</p></td><td colspan="1" rowspan="1"><p class="block at-block">string</p></td></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>getText</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">获取编辑器的纯文本输出</p></td><td colspan="1" rowspan="1"><p class="block at-block">string</p></td></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>setContent</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">设置编辑器内容</p></td><td colspan="1" rowspan="1"><p class="block at-block">(content: JSONContent | string) =&gt; void</p></td></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>clearContent</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">清除编辑器内容</p></td><td colspan="1" rowspan="1"><p class="block at-block">() =&gt; void</p></td></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>setEditable</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">设置编辑器的编辑态</p></td><td colspan="1" rowspan="1"><p class="block at-block">(editable: boolean) =&gt; void</p></td></tr></tbody></table><p class="block at-block">3、<strong>EditorRender</strong> 编辑器API</p><table class="block at-table" style="min-width: 600px"><colgroup><col><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p class="block at-block">属性</p></th><th colspan="1" rowspan="1"><p class="block at-block">说明</p></th><th colspan="1" rowspan="1"><p class="block at-block">类型</p></th><th colspan="1" rowspan="1"><p class="block at-block">默认值</p></th></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>className</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">编辑器 className</p></td><td colspan="1" rowspan="1"><p class="block at-block">string</p></td><td colspan="1" rowspan="1"><p class="block at-block">-</p></td></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>extensions</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">额外的编辑器扩展</p></td><td colspan="1" rowspan="1"><p class="block at-block">Array&lt;Extension&gt;</p></td><td colspan="1" rowspan="1"><p class="block at-block">[]</p></td></tr></tbody></table><p class="block at-block">4、<strong>EditorRender</strong> 实例</p><table class="block at-table" style="min-width: 450px"><colgroup><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p class="block at-block">名称</p></th><th colspan="1" rowspan="1"><p class="block at-block">说明</p></th><th colspan="1" rowspan="1"><p class="block at-block">类型</p></th></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>editor</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">编辑器实例</p></td><td colspan="1" rowspan="1"><p class="block at-block">Editor | null</p></td></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>getJSON</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">获取编辑器的 JSON 输出</p></td><td colspan="1" rowspan="1"><p class="block at-block">JSONContent</p></td></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>getHTML</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">获取编辑器的 HTML 输出</p></td><td colspan="1" rowspan="1"><p class="block at-block">string</p></td></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>getText</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">获取编辑器的纯文本输出</p></td><td colspan="1" rowspan="1"><p class="block at-block">string</p></td></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>setContent</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">设置编辑器内容</p></td><td colspan="1" rowspan="1"><p class="block at-block">(content: JSONContent | string) =&gt; void</p></td></tr><tr><td colspan="1" rowspan="1"><p class="block at-block"><strong>clearContent</strong></p></td><td colspan="1" rowspan="1"><p class="block at-block">清除编辑器内容</p></td><td colspan="1" rowspan="1"><p class="block at-block">() =&gt; void</p></td></tr></tbody></table><p class="block at-block"></p>`;
