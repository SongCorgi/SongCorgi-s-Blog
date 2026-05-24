---
title: "Astro + Tailwind CSS v4 博客搭建实录"
published: 2026-05-15
updated: 2026-05-20
tags: ["Astro", "Tailwind", "教程"]
belongToSet: "Astro 实战"
description: "从零搭建一个基于 Astro v6 与 Tailwind CSS v4 的极简技术博客，涵盖项目初始化、Content Collections 配置、暗色模式与字体离线化等关键步骤。"
---

## 为什么选择 Astro

Astro 是一个以内容为核心的静态站点生成器，默认输出零 JavaScript 到客户端。对于技术博客这类内容型站点，Astro 的岛屿架构（Island Architecture）恰到好处 —— 只在需要交互的地方注入 JavaScript，其余部分全部是纯 HTML。

## 项目初始化

```bash
pnpm create astro@latest CleanBlog --template minimal
cd CleanBlog
pnpm astro add tailwindcss
```

Astro v6 内置了 `@tailwindcss/vite` 插件，无需手动配置 Vite。安装后直接在 `src/styles/global.css` 中用 `@import "tailwindcss"` 引入即可。

## Content Collections 配置

Astro v6 的 Content Collections 改用 loader API，需要在 `src/content.config.ts` 中定义：

```ts
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    published: z.date(),
    updated: z.date().optional(),
    tags: z.array(z.string()).optional(),
    description: z.string(),
  }),
});

export const collections = { posts };
```

每篇博文放在 `src/content/posts/<slug>/index.md`，图片与 markdown 同目录。

## 暗色模式

采用 class-based 策略：点击按钮切换 `<html>` 上的 `.dark` 类，Tailwind 的 `@variant dark` 配合 `dark:` 前缀控制样式。通过 `localStorage` 持久化用户选择，防闪烁脚本在 `<head>` 中内联执行。
