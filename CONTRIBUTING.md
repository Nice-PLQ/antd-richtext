# 开发指南

### 介绍

首先感谢你关注 Tiptap-Editor 富文本编辑器，并进行代码贡献。
以下是关于向 Tiptap-Editor 提交代码的指南。在向 Tiptap-Editor 提交 Issue 或者 MR 之前，请先花几分钟时间阅读以下文字

### Issue 规范

- 遇到问题时，请先确认这个问题已经在 issue 中有记录或者已被修复
- 提 Issue 时，请用简短的语言描述遇到的问题，并添加出现问题时的环境和复现步骤

### Commit Message格式规范

- feat: 新特性
- fix: 修改问题
- refactor: 代码重构
- docs: 文档修改
- style: 代码格式修改, 注意不是 css 修改
- test: 测试用例修改
- chore: 其他修改, 比如构建流程, 依赖管理

### Merge Request 规范

- 如果遇到问题，建议保持你的 MR 足够小。保证一个 MR 只解决一个问题或只添加一个功能
- 在 MR 中请添加合适的描述，并关联相关的 Issue

### Merge Request 流程

1. 从主仓库中Fork一份到自己的代码仓库
2. 新建开发分支，分支规范要求如下：
   - 修复 bug，分支命名形式为 **bugfix/[扩展名]\_[问题简称]** ，如：`bugfix/table_cell_color`
   - 新增全新 extension，分支命名形式为 **feature/[扩展名]**，如：`feature/iframe`
   - 新增特性，分支命名形式为 **feature/[扩展名]\_[功能]**，如：`feature/image_align`
3. 在新分支上开发完成后，提 Merge Request 到源仓库的 Master 分支
4. Merge Request 会在 Review 通过后被合并到仓库，并发布新版本

### 目录结构

- 仓库的源代码位于 src 下
- demo 目录下是文档网站的代码，也是本地开发时的示例代码。开发时，运行 `npm run dev` 命令启动开发环境。

项目目录大致如下：

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

### 添加新自定义Extension

在开发新的自定义扩展之前，你可能需要先阅读[Tiptap](https://tiptap.dev/docs/editor/extensions/custom-extensions)的官方文档，以属性相关API和概念。

添加新的通用扩展时，请按照下面的目录结构组织文件。首先需要在`extensions`目录下创建新扩展目录，如果有样式文件，需要在`assets/style/index.scss`中引入。

```
src
|- assets
|  ├─ style
|  |  ├─ index.scss   # 引入extension样式
|- extensions
|  ├─ xxxxxx          # 新扩展目录
|  |  ├─ index.ts     # 节点声明
|  |  ├─ index.scss   # 样式(非必须)
|  |  ├─ View.tsx     # 节点渲染view(非必须)
├─ menus              # 菜单
```

### 关于相关命名规范

- 样式的 class 默认以`t-editor`作为前缀，命名规范遵循[BEM](https://github.com/Tencent/tmt-workflow/wiki/%E2%92%9B-%5B%E8%A7%84%E8%8C%83%5D--CSS-BEM-%E4%B9%A6%E5%86%99%E8%A7%84%E8%8C%83)
