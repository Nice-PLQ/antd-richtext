## Antd + Tiptap 的富文本编辑器

[编辑器API文档 + DEMO体验](./)

### 1、项目介绍

适用于PC端的富文本编辑器，基于Antd + [Tiptap2](https://tiptap.dev/docs/editor/getting-started/overview)开发，使用说明请参考[文档](./)

### 2、项目技术栈

- typescript + react@18
- rollup（构建esm产物）
- vite（本地开发服务）
- vitest（单元测试）
- eslint + prettier + commitint + stylelint（代码规范）

### 3、开发指引

```bash
yarn
yarn dev
```

项目结构

```
├─ demo      # 富文本编辑器示例
├─ esm       # ESM构建产物
├─ src       # 源代码
|  ├─ assets            # 图标和样式
|  ├─ components        # 组件
|  ├─ extensions        # 编辑器自定义扩展
|  ├─ i18n              # 多语言
|  ├─ menus             # 菜单项
|  ├─ utils             # 工具函数
|  ├─ constants.ts      # 常量
|  ├─ context.ts        # context
|  ├─ Editor.tsx        # 编辑器
|  ├─ EditorRender.tsx  # 编辑器（纯渲染模式）
|  ├─ index.ts          # 入口文件
|  ├─ index.scss        # 样式文件
```
