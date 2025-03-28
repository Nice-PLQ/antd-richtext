## 如何兼容其他编辑器的数据

**首先需要说明**，Tiptap与许多其他编辑器不同，它基于定义内容结构的Schema。这使你能够定义文档中可能出现的`节点类型`、`属性`以及它们的`嵌套方式`。这个模式**非常严格**，你不能使用架构中未定义的任何 HTML 元素或属性。

换句话说，如果直接把其他编辑器的数据放在Tiptap中渲染，可能会丢失一些标签和属性，默认情况下原始数据是无法做到100%兼容的。

但是，通过开发扩展来定义原始数据中的标签和属性，也能支持到大部分的情况。以下列举了几个场景：

### 1、扩展支持额外的style样式属性

默认情况下，Tiptap自带扩展可能仅支持`span`标签的**color、fontSize、fontWeight、textAlign、LineHeight**，对于其他标签上的style可能不支持。那通过扩展，可以让`span`、`p`、`h1-h6`标签支持style的其他属性。示例如下：

```js
import { Extension } from "@tiptap/core";

// 新增支持style="background:red;padding:xxx;"
import { Extension } from "@tiptap/core";

export const ExtraStyles = Extension.create({
  name: "ExtraStyles",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle", "paragraph", "heading"],
        attributes: {
          backgroundColor: {
            default: null,
            parseHTML: (element) =>
              element.style.backgroundColor?.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.backgroundColor) {
                return {};
              }

              return {
                style: `background-color: ${attributes.backgroundColor}`,
              };
            },
          },
          padding: {
            default: null,
            parseHTML: (element) => element.style.padding,
            renderHTML: (attributes) => {
              if (!attributes.padding) {
                return {};
              }

              return {
                style: `padding: ${attributes.padding}`,
              };
            },
          },
        },
      },
    ];
  },
});
```

### 2、扩展支持标签的自定义属性

支持标签上的其他自定义属性，如`data-*`，官方文档可参考[这里](https://tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing#attributes)

```js
const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      // 保留原标签的所有属性
      ...this.parent?.(),
      // 新增支持data-version的自定义属性
      version: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-version"),
        renderHTML: (attributes) => ({
          "data-version": attributes.version,
        }),
      },
    };
  },
});
```

### 3、扩展自定义标签

如果有自定义的标签，需要单独实现扩展来处理，否则自定义标签会被丢弃。以下是一个实现`custom-msg`自定义标签的扩展

```js
import { mergeAttributes, Mark, Node } from "@tiptap/core";

// 扩展Mark，标签会被p包裹，如<p><custom-msg></custom-msg></p>
// 扩展Node节点，设置group: 'inline'，可以实现同样效果
export const CustomMsg = Mark.create({
  name: "customMsg",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [{ tag: "custom-msg" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "custom-msg",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});


// 扩展Node节点，标签和p同级，如<custom-msg></custom-msg><p></p>
export const CustomMsg = Node.create({
  name: "customMsg",

  group: 'block',

  content: 'inline*',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [{ tag: "custom-msg" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "custom-msg",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});
```

### 4、总结

通过上面3种方式的扩展，理论上可以尽可能兼容其他编辑器的数据。但是不同的编辑器产出数据各式各样，所以具体的兼容还是需要case by case来处理。
