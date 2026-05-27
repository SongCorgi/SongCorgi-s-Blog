/**
 * remark-optimize-images — 构建时自动压缩 markdown 内嵌的本地图片
 *
 * 处理规则：
 *   ./photo.png  →  压缩 + 转 WebP → /optimized/<slug>/photo.webp
 *
 * 不处理：
 *   http(s)://... — 外部图片
 *   .gif         — 保留动画
 *   ../...       — 文章间引用（非图片）
 */
import type { Root } from "mdast";
import type { VFile } from "vfile";
import { visit } from "unist-util-visit";
import path from "node:path";
import { compressImage } from "../utils/compress-image";

export default function remarkOptimizeImages() {
  return async (tree: Root, file: VFile) => {
    const mdPath = file.path;
    if (!mdPath) return;

    const mdDir = path.dirname(mdPath);
    const slug = path.basename(mdDir);

    const images: { node: any; imgPath: string }[] = [];

    visit(tree, "image", (node) => {
      if (node.url.startsWith("./") && !node.url.endsWith(".gif")) {
        images.push({ node, imgPath: node.url });
      }
    });

    if (images.length === 0) return;

    await Promise.all(
      images.map(async ({ node, imgPath }) => {
        const result = await compressImage(mdDir, imgPath, slug);
        if (result) node.url = result;
      })
    );
  };
}
