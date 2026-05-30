/* TOC（目录大纲）构建工具 — 将 markdown headings 转为树形结构并渲染为 HTML */

export interface TocNode {
  depth: number;
  slug: string;
  text: string;
  children: TocNode[];
}

export interface HeadingItem {
  depth: number;
  slug: string;
  text: string;
}

/** 将扁平 headings 数组转为树形结构 */
export function buildTocTree(items: HeadingItem[]): TocNode[] {
  const root: TocNode[] = [];
  const stack: TocNode[] = [];
  for (const h of items) {
    const node: TocNode = { depth: h.depth, slug: h.slug, text: h.text, children: [] };
    while (stack.length > 0 && stack[stack.length - 1].depth >= h.depth) {
      stack.pop();
    }
    if (stack.length === 0) {
      root.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }
    stack.push(node);
  }
  return root;
}

function getIndentStyle(depth: number): string {
  return `padding-left: ${12 + (depth - 2) * 16}px`;
}

function getSizeClass(depth: number): string {
  if (depth <= 2) return "text-base";
  if (depth <= 4) return "text-sm";
  return "text-xs";
}

/** 将 TOC 树渲染为 HTML 字符串（递归扁平 + inline style） */
export function renderToc(nodes: TocNode[]): string {
  if (!nodes.length) return "";

  function flatten(list: TocNode[], result: TocNode[] = []): TocNode[] {
    for (const n of list) {
      result.push(n);
      if (n.children.length > 0) flatten(n.children, result);
    }
    return result;
  }
  const flat = flatten(nodes);

  let h = '<div class="flex flex-col">';
  for (const node of flat) {
    h += '<div class="flex items-center gap-1.5 min-h-[clamp(1.5rem,2vw,2rem)]">';
    h += `<span class="toc-progress block shrink-0 self-stretch my-[0.2rem] w-0.5 rounded-full" style="min-height:0.55rem">`;
    h += `<span class="toc-progress-fill block rounded-full bg-accent" data-progress-for="${node.slug}" style="height:0%"></span>`;
    h += `</span>`;
    h +=
      `<a href="#${node.slug}" data-toc-link="${node.slug}" style="${getIndentStyle(node.depth)}" class="${getSizeClass(node.depth)} block transition-colors no-underline hover:text-accent text-black dark:text-ghost break-words whitespace-normal">${node.text}</a>`;
    h += "</div>";
  }
  h += "</div>";
  return h;
}
