/**
 * 构建时图片压缩工具 — 将本地图片转为 WebP，超过 1200px 自动缩放
 * 输出到 public/optimized/<slug>/ 目录，返回公共访问路径
 */
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const MAX_WIDTH = 1200;
const WEBP_QUALITY = 85;

export async function compressImage(
  srcDir: string,
  filename: string,
  slug: string
): Promise<string | null> {
  const srcPath = path.resolve(srcDir, filename);
  if (!fs.existsSync(srcPath)) return null;

  const ext = path.extname(filename);
  const baseName = path.basename(filename, ext);
  const outDir = path.join(process.cwd(), "public", "optimized", slug);
  const outPath = path.join(outDir, `${baseName}.webp`);

  if (fs.existsSync(outPath)) return `/optimized/${slug}/${baseName}.webp`;

  fs.mkdirSync(outDir, { recursive: true });

  const metadata = await sharp(srcPath).metadata();
  let pipeline = sharp(srcPath);
  if (metadata.width && metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH);
  }

  await pipeline.webp({ quality: WEBP_QUALITY }).toFile(outPath);
  return `/optimized/${slug}/${baseName}.webp`;
}
