/* 引入 Astro v6 content collections 的类型、schema 工具和文件加载器 */
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

/* ============================================================
 * posts collection — 博客文章
 * 每篇文章是 src/content/posts/ 下的一个文件夹，含 index.md 及图片
 * glob loader 的 "**\/*.md" 会匹配所有层级的 index.md
 * ============================================================ */
const posts = defineCollection({
  /* glob loader：加载指定目录下的所有 markdown 文件 */
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),

  schema: z.object({
    /* 文章标题（必填） */
    title: z.string(),

    /* 发布时间（必填）— 格式：YYYY-MM-DD */
    published: z.date(),

    /* 最后修改时间（可选）— 未修改时可省略 */
    updated: z.date().optional(),

    /* 标签列表（可选）— 用于分类与标签页聚合，如 ["Astro", "Tailwind", "前端"] */
    tags: z.array(z.string()).optional(),

    /* 文章简介（必填）— 用于文章卡片、SEO description、列表摘要 */
    description: z.string(),

    /* 所属合集（可选）— 将文章归入某个系列/合集，如 "Astro 实战" */
    belongToSet: z.string().optional(),
  }),
});

/* 导出 collections 注册表 — Astro 自动扫描并生成 TypeScript 类型 */
export const collections = { posts };
