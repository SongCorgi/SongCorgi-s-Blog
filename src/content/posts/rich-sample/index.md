---
title: "Markdown 元素全量样板文章"
published: 2026-05-23
updated: 2026-05-24
tags: ["Markdown", "样板", "Astro"]
description: "这是一篇穷尽常见 Markdown 元素的样板文章，涵盖各级标题、数学公式、代码块、列表、引用、表格、图片等，用于测试博客的排版与渲染效果。"
belongToSet: "技术写作指南"
---

## 二级标题（h2）

段落正文。这是一个包含 **加粗**、*斜体*、~~删除线~~、`行内代码` 的段落。再放一个[超链接](https://astro.build)测试。

### 三级标题（h3）

#### 四级标题（h4）

##### 五级标题（h5）

###### 六级标题（h6）

---

## 数学公式

行内公式：质能方程 $E = mc^2$，勾股定理 $a^2 + b^2 = c^2$。

块级公式：

$$
\int_{0}^{\infty} e^{-x^2} \, dx = \frac{\sqrt{\pi}}{2}
$$

$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}} \exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)
$$

任意 $n \times n$ 矩阵的行列式：

$$
\det(A) = \sum_{\sigma \in S_n} \operatorname{sgn}(\sigma) \prod_{i=1}^{n} a_{i, \sigma(i)}
$$

---

## 代码块

### TypeScript

```ts
/**
 * 计算斐波那契数列第 n 项（记忆化递归）
 */
function fibonacci(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;

  const result = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  memo.set(n, result);
  return result;
}

console.log(fibonacci(50)); // 12586269025
```

### Python

```python
import asyncio
from typing import List


async def fetch_posts(tag: str) -> List[dict]:
    """从 API 拉取指定标签的文章列表"""
    url = f"https://api.example.com/posts?tag={tag}"
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            data = await response.json()
            return data.get("posts", [])


# 并发拉取多标签文章
results = asyncio.run(asyncio.gather(
    fetch_posts("Astro"),
    fetch_posts("Tailwind"),
))
```

### Bash

```bash
#!/bin/bash
# 批量压缩图片并上传到 R2

for file in images/*.{jpg,png,webp}; do
  [ -e "$file" ] || continue
  output="optimized/${file##*/}"
  sharp compress "$file" --quality 85 --output "$output"
  wrangler r2 object put "my-blog-assets/$output" --file "$output"
  echo "Uploaded: $output"
done
```

---

## 图片

### 引用图片

图片与 `index.md` 放在同一文件夹下，通过相对路径引用，如 `![示意图](./diagram.png)`。

构建时自动压缩并转换为 WebP 格式。

---

## 列表

### 无序列表

- Astro — 静态站点生成器
- Tailwind CSS — 原子化 CSS 框架
  - 响应式布局 `sm:` `md:` `lg:`
  - 暗色模式 `dark:`
  - 自定义主题 `@theme`
- TypeScript — JavaScript 超集

### 有序列表

1. 创建 `src/content.config.ts`
2. 定义 posts collection schema
3. 编写 markdown 文章
4. 在 `.astro` 组件中通过 `getCollection('posts')` 读取

### 任务列表

- [x] 搭建 Astro 项目
- [x] 配置 Tailwind CSS v4
- [x] 设计 BaseLayout
- [x] 实现暗色模式切换
- [ ] 博客文章列表页
- [ ] 标签聚合页

---

## 引用块（Blockquote）

> 优秀的代码本身就是最好的文档。当你觉得需要添加注释时，先尝试重构代码使其更清晰。
>
> > — Steve McConnell, *Code Complete*

> **注意**
>
> 在部署到 Cloudflare R2 之前，请确保已在 `.env` 中配置 `R2_PUBLIC_URL` 为你的 bucket 自定义域名。

---

## 表格

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| Astro | 零 JS 运行时、多框架 | 动态交互受限 | 内容型站点 |
| Next.js | 生态成熟、全栈能力 | 客户端 JS 体积大 | 复杂 Web 应用 |
| Hugo | 构建极快 | 模板语法学习曲线 | 文档 / 博客 |

---

## 水平分割线

下面是一条水平分割线：

---

以上覆盖了博客文章的常见 Markdown 元素，后续新增文章直接复制此文件夹结构即可。
