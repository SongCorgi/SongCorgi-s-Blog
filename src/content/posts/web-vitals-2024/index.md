---
title: "Web Vitals 指标优化指南"
published: 2024-12-01
updated: 2025-01-10
tags: ["前端", "性能优化"]
belongToSet: "前端性能优化"
description: "逐一拆解 Core Web Vitals 三大核心指标 LCP、INP、CLS 的测量方式、优化策略与常见陷阱，附带实际项目中的优化案例与数据对比。"
---

## Core Web Vitals 概览

Google 将用户体验量化为三个核心指标：

| 指标 | 全称 | 衡量 | 良好阈值 |
|------|------|------|----------|
| LCP | Largest Contentful Paint | 加载性能 | ≤ 2.5s |
| INP | Interaction to Next Paint | 交互响应 | ≤ 200ms |
| CLS | Cumulative Layout Shift | 视觉稳定性 | ≤ 0.1 |

## LCP 优化策略

LCP 测量的是视口内最大的可见元素（通常是大图或标题文字块）的渲染时间。影响 LCP 的四个阶段：

1. **TTFB** — 服务端响应时间，优化 CDN、缓存策略
2. **资源加载延迟** — 将 LCP 资源预加载：`<link rel="preload" as="image" href="hero.webp" />`
3. **资源加载时长** — 图片用现代格式（AVIF/WebP），合适的尺寸
4. **渲染延迟** — 不阻塞渲染的 JS，关键 CSS 内联

## 图片引起 CLS 的根治方案

CLS 最常由**无尺寸的图片**引起：图片加载前占据 0 空间，加载后撑开布局，导致后续内容下移。

```html
<!-- 坏：无尺寸，加载后跳变 -->
<img src="hero.jpg" alt="" />

<!-- 好：显式设置宽高，浏览器预分配空间 -->
<img src="hero.jpg" alt="" width="800" height="400" />

<!-- 更好：CSS aspect-ratio 确保弹性容器中也稳定 -->
<style>
  .hero { width: 100%; aspect-ratio: 2 / 1; }
</style>
<img class="hero" src="hero.jpg" alt="" />
```

## 在实际项目中测量

使用 `web-vitals` 库在真实用户设备上收集数据，而非仅依赖 Lighthouse 的实验室数据：

```ts
import { onLCP, onINP, onCLS } from "web-vitals";

onLCP(console.log);
onINP(console.log);
onCLS(console.log);
```

> 实验室数据告诉你"可能的最优表现"，RUM 数据告诉你"用户实际体验到了什么"。两者结合才完整。
