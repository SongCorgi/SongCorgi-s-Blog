---
title: "前端性能优化实战笔记"
published: 2026-03-10
updated: 2026-04-01
tags: ["前端", "性能优化"]
belongToSet: "前端性能优化"
description: "从网络、渲染、JavaScript 三个维度梳理前端性能优化的实用技巧，涵盖资源加载策略、关键渲染路径优化与运行时性能调优。"
---

## 性能优化的三个维度

| 维度 | 关注点 | 核心指标 |
|------|--------|----------|
| 网络 | 资源加载速度 | TTFB、LCP |
| 渲染 | 页面呈现速度 | FCP、CLS |
| 运行时 | 交互响应速度 | INP、Long Task |

## 网络优化

### 资源提示（Resource Hints）

```html
<!-- DNS 预解析：提前解析第三方域名的 DNS -->
<link rel="dns-prefetch" href="https://api.example.com" />

<!-- 预连接：DNS + TCP + TLS 握手全部提前完成 -->
<link rel="preconnect" href="https://cdn.example.com" />

<!-- 预加载：提前请求当前页面即将用到的关键资源 -->
<link rel="preload" href="/fonts/inter.woff2" as="font" crossorigin />
```

### 图片优化

- AVIF/WebP 格式：比 JPEG 体积减少 50%+，Astro 构建时自动生成
- 响应式图片：`srcset` + `sizes` 属性按屏幕宽度加载不同分辨率
- 懒加载：`<img loading="lazy" />` 推迟屏外图片加载

## 渲染优化

关键渲染路径（Critical Rendering Path）的优化原则：

1. **减少关键资源数量** — 内联关键 CSS，异步加载非关键 CSS
2. **减少关键字节数** — 压缩 HTML/CSS/JS，Tree Shaking 移除死代码
3. **缩短关键路径长度** — 减少资源请求的往返次数

Astro 默认就是性能最优的：构建产物为零 JS，CSS 按页面拆分且自动 Tree Shaking，图片在构建时完成优化。唯一需要关注的是**避免在 `.astro` 组件中引入重量级 UI 框架**。

## JavaScript 运行时优化

```ts
// 使用 requestAnimationFrame 批量 DOM 读写，避免强制同步布局
let tasks: (() => void)[] = [];

function scheduleTask(task: () => void) {
  tasks.push(task);
  if (tasks.length === 1) {
    requestAnimationFrame(() => {
      const batch = tasks;
      tasks = [];
      batch.forEach(t => t());
    });
  }
}

// 使用 Web Worker 将密集计算移出主线程
const worker = new Worker("/workers/heavy-calc.js");
worker.postMessage({ data: largeArray });
worker.onmessage = (e) => console.log("计算结果:", e.data);
```

> 性能优化的黄金法则：先测量，再优化。不要凭直觉猜测瓶颈，使用 Lighthouse、Web Vitals 和 Chrome DevTools Performance 面板定位实际问题。
