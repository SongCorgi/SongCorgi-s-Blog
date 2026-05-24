---
title: "用 Markdown 高效写作技术文档"
published: 2024-01-25
tags: ["Markdown", "效率"]
belongToSet: "技术写作指南"
description: "分享 Markdown 技术写作的最佳实践，涵盖文件组织、代码块使用、表格规范、图片管理与版本控制下的协作流程。"
---

## 技术文档的 Markdown 哲学

技术文档的首要目标是**清晰传达信息**。Markdown 的设计初衷就是让你专注于内容而非排版。一个贯穿始终的原则：**保持简单，避免花哨的格式**。

## 文件组织

```
docs/
├── README.md            ← 项目概述与快速上手
├── architecture/        ← 架构设计文档
│   ├── overview.md
│   └── data-flow.md
├── guides/              ← 操作指南（how-to）
│   ├── setup.md
│   └── deployment.md
└── changelog.md         ← 变更日志
```

使用连字符分割的 `kebab-case.md` 命名，避免空格和大小写不一致导致的跨平台问题。

## 代码块规范

始终指定语言标识符以启用语法高亮：

````md
```ts title="src/utils/format.ts"
// 带文件路径的代码块，方便读者定位
export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
```
````

## 表格对齐

```md
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `string` | — | 必填参数 |
| `timeout` | `number` | `5000` | 超时毫秒数 |
```

- 表头与数据用 `|` 分隔
- 对齐线用 `---`，类型和默认值用反引号包裹
- 空格对齐仅为了源码可读性，渲染后无影响

## 图片管理

文章配图与 Markdown 文件放在同一目录下，使用相对路径引用：

```
my-post/
├── index.md
├── cover.jpg        ← 封面图
└── architecture.png ← 正文配图
```

```md
![架构图](./architecture.png)
```

这样做的好处：删除文章时图片随之删除，不会在公共图片目录留下孤立文件。同时 Astro 构建时会自动优化这些图片。

## Git 协作

技术文档也应走 Code Review 流程。将 `.md` 文件纳入版本控制，修改文档时提交 PR，由团队成员审查内容准确性和表达清晰度。文档的质量标准和代码一样重要。
