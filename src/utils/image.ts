/* ============================================================
 * 图片路径解析工具（用于站点级公共图片，如 logo、favicon）
 * — 开发环境：直接返回本地路径（如 /images/logo.svg）
 * — 生产环境：拼接 R2_PUBLIC_URL 环境变量前缀
 *
 * 注意：文章配图已改为与 index.md 同目录的相对路径引用，
 * 由 Astro 构建时自动处理优化，不需要此工具。
 *
 * 使用示例：
 *   import { getImageUrl } from "../utils/image";
 *   <img src={getImageUrl("/images/logo.svg")} />
 * ============================================================ */

/** Cloudflare R2 公开访问域名，从环境变量读取 */
const R2_PUBLIC_URL = import.meta.env.R2_PUBLIC_URL as string;

/**
 * 获取图片完整 URL
 * @param path - 图片路径，以 / 开头，如 "/images/logo.svg"
 * @returns 开发环境返回原始路径，生产环境返回 R2 CDN 完整 URL
 */
export function getImageUrl(path: string): string {
  /* 开发环境：直接返回本地路径，由 Vite 静态资源服务提供 */
  if (import.meta.env.DEV) {
    return path;
  }

  /* 生产环境：拼接 R2 公开域名 + 路径
   * 例如 "https://cdn.example.com" + "/images/cover.jpg" = "https://cdn.example.com/images/cover.jpg" */
  return `${R2_PUBLIC_URL}${path}`;
}
