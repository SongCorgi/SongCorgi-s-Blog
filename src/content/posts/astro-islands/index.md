---
title: "Astro 岛屿架构详解"
published: 2025-08-15
tags: ["Astro", "前端", "教程"]
belongToSet: "Astro 实战"
description: "深入 Astro 的岛屿架构设计理念，理解如何在不同框架组件间实现选择性水合，以及与传统 SSR/SSG 方案的本质差异。"
---

## 什么是岛屿架构

岛屿架构（Islands Architecture）由 Astro 提出，核心理念是：**页面大部分是静态 HTML，交互式组件像岛屿一样独立存在于静态内容之中**。

```
┌──────────────────────────────┐
│  静态 HTML（零 JS）           │
│  ┌──────────┐   ┌─────────┐ │
│  │ 导航栏    │   │ 暗色切换 │ │  ← 岛屿：有交互，需要 JS
│  │ (React)  │   │ (Vanilla)│ │
│  └──────────┘   └─────────┘ │
│  大段正文……                   │
│  ┌───────────────────────┐   │
│  │ 评论区 (SolidJS)       │   │  ← 岛屿：有交互，需要 JS
│  └───────────────────────┘   │
│  更多正文……                   │
└──────────────────────────────┘
```

## 客户端指令

Astro 通过 `client:*` 指令控制组件的交互启动时机：

| 指令 | 行为 |
|------|------|
| `client:load` | 页面加载后立即水合 |
| `client:idle` | 浏览器空闲时水合 |
| `client:visible` | 组件进入视口时水合 |
| `client:media` | 匹配媒体查询时水合 |
| `client:only` | 跳过 SSR，仅客户端渲染 |

```astro
---
import CommentSection from "../components/CommentSection";
---
<!-- 评论区仅在用户滚动到视口内时才加载 JS -->
<CommentSection client:visible />
```

## 与 Next.js 的核心区别

Next.js 的页面要么是 SSG（静态），要么是 SSR（服务端渲染），整个页面使用同一个渲染策略。Astro 允许你**在同一页面上混合多种渲染策略** — 大部分内容预渲染为 HTML，仅交互部分按需加载 JS 框架。
