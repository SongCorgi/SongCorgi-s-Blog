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

/**
 * 从文章集合中按 belongToSet 分组合集
 * 返回按文章数量降序排列的合集数组
 */
export function getSets(
  posts: Array<{
    data: { belongToSet?: string; title: string; description: string; published: Date; updated?: Date; tags?: string[] };
    body?: string;
    id: string;
  }>,
): { name: string; count: number; posts: TimelinePost[] }[] {
  const setMap = new Map<string, TimelinePost[]>();

  for (const post of posts) {
    const name = post.data.belongToSet;
    if (!name) continue;
    if (!setMap.has(name)) setMap.set(name, []);
    setMap.get(name)!.push({
      title: post.data.title,
      description: post.data.description,
      published: post.data.published,
      updated: post.data.updated,
      tags: post.data.tags,
      slug: post.id,
      body: post.body ?? "",
    });
  }

  return Array.from(setMap, ([name, posts]) => ({ name, count: posts.length, posts })).sort(
    (a, b) => b.count - a.count,
  );
}

/** 日期格式化为 YYYY-MM-DD */
export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/* ————————————————————————————————————————————
 * 归档页相关类型与函数
 * ———————————————————————————————————————————— */

/** 归档时间轴中的单篇文章（含 ArticleCard 所需全部字段） */
export interface TimelinePost {
  title: string;
  description: string;
  published: Date;
  updated?: Date;
  tags?: string[];
  slug: string;
  body: string; /* 原始 markdown，用于 getWordCount 统计字数 */
}

/** 某年下的一个月份及其文章 */
export interface MonthGroup {
  month: number;          /* 1-indexed 月份，如 5 表示 5 月 */
  posts: TimelinePost[];
}

/** 一个年份及其下各月份的文章分组 */
export interface YearGroup {
  year: number;
  months: MonthGroup[];
}

/**
 * 将文章按 年份 → 月份 两层分组，用于归档时间轴
 * 年份降序、月份降序、文章按 published 降序
 */
export function groupPostsByYearMonth(
  posts: Array<{
    data: { title: string; description: string; published: Date; updated?: Date; tags?: string[] };
    body?: string;
    id: string;
  }>,
): YearGroup[] {
  /* 两层 Map：year → month → posts[] */
  const yearMap = new Map<number, Map<number, TimelinePost[]>>();

  for (const post of posts) {
    const d = post.data.published;
    const year = d.getFullYear();
    const month = d.getMonth() + 1; /* getMonth() 是 0-indexed，+1 转为 1-indexed */

    /* 惰性初始化：年份不存在则创建 */
    if (!yearMap.has(year)) yearMap.set(year, new Map());
    const monthMap = yearMap.get(year)!;

    /* 惰性初始化：月份不存在则创建 */
    if (!monthMap.has(month)) monthMap.set(month, []);
    monthMap.get(month)!.push({
      title: post.data.title,
      description: post.data.description,
      published: d,
      updated: post.data.updated,
      tags: post.data.tags,
      slug: post.id,
      body: post.body ?? "",
    });
  }

  /* 转换为数组并三层降序排序 */
  const result: YearGroup[] = [];
  for (const [year, monthMap] of [...yearMap].sort((a, b) => b[0] - a[0])) {
    const months: MonthGroup[] = [];
    for (const [month, posts] of [...monthMap].sort((a, b) => b[0] - a[0])) {
      posts.sort((a, b) => b.published.getTime() - a.published.getTime());
      months.push({ month, posts });
    }
    result.push({ year, months });
  }
  return result;
}
