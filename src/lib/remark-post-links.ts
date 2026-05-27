/**
 * remark-post-links — 将 markdown 中同级文章的相对引用转为 /posts/<slug> 绝对路径
 *
 * 处理规则：
 *   ../ts-design-patterns/index.md     →  /posts/ts-design-patterns
 *   ../cli-ergonomics/                →  /posts/cli-ergonomics
 *   ../cli-ergonomics                 →  /posts/cli-ergonomics
 *   ../cli-ergonomics#标题            →  /posts/cli-ergonomics#标题
 *   ../ts-utility-types/index.md#某节 →  /posts/ts-utility-types#某节
 *
 * 不处理：
 *   ./image.jpg   — 图片等资源，保持原样
 *   http(s)://... — 外部链接，保持原样
 *   /absolute     — 已是绝对路径，保持原样
 */
import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkPostLinks() {
  return (tree: Root) => {
    visit(tree, "link", (node) => {
      const url = node.url;

      // 只处理 ../ 开头的相对链接
      if (!url.startsWith("../")) return;

      // 分离 hash fragment
      const hashIndex = url.indexOf("#");
      const pathPart = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
      const fragment = hashIndex >= 0 ? url.slice(hashIndex) : "";

      // 取最后一个非空路径段
      const segments = pathPart.replace(/\/$/, "").split("/");
      const last = segments[segments.length - 1];

      // 如果是 index.md，取前一段作为 slug
      const slug = last === "index.md" ? segments[segments.length - 2] : last;

      if (slug) {
        node.url = `/posts/${slug}${fragment}`;
      }
    });
  };
}
