/* 文章相关工具函数 — 字数统计、标签聚合、日期格式化 */

/**
 * 统计混合中英文文本的字数
 * CJK 字符按单字计数，非 CJK 部分按空格分词计数
 */
export function getWordCount(body: string): number {
  if (!body) return 0;

  /* 匹配 CJK 字符（中文、日文、韩文），每个计为 1 字 */
  const cjkChars = body.match(/[一-鿿㐀-䶿]/g);
  const cjkCount = cjkChars ? cjkChars.length : 0;

  /* 移除 CJK 字符后，剩余部分按空白分词计英文单词数 */
  const nonCJK = body.replace(/[一-鿿㐀-䶿]/g, " ");
  const englishWords = nonCJK.split(/\s+/).filter(Boolean);

  return cjkCount + englishWords.length;
}

/**
 * 从文章集合中聚合标签及其计数
 * 返回按 count 降序、name 字母序排列的数组
 */
export function getAllTags(posts: Array<{ data: { tags?: string[] } }>): { name: string; count: number }[] {
  const tagMap = new Map<string, number>();

  for (const post of posts) {
    const tags = post.data.tags;
    if (!tags) continue;
    for (const tag of tags) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(tagMap, ([name, count]) => ({ name, count })).sort((a, b) => {
    /* 优先按数量降序，数量相同按名称字母序升序 */
    if (b.count !== a.count) return b.count - a.count;
    return a.name.localeCompare(b.name);
  });
}

/** 日期格式化为 YYYY-MM-DD */
export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
