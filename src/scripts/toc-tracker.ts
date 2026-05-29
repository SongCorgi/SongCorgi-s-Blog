/* TOC 区段式滚动高亮 + 进度条跟踪
   通过 is:inline 注入，函数定义不随 ClientRouter 导航重载
   每次导航后由 PostToolbar 的主脚本调用 initTocTracker() 重新初始化 */

type WinListener = (type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean) => void;

interface Section {
  id: string;
  start: Element;
  end: Element | null;
}

export function initTocTracker(addWinListener: WinListener): () => void {
  const visibleArticle = Array.from(document.querySelectorAll('[data-pagefind-body]')).find(
    (el) => el.checkVisibility(),
  );
  const headingEls = visibleArticle
    ? visibleArticle.querySelectorAll("h2[id], h3[id], h4[id], h5[id], h6[id]")
    : [];

  if (headingEls.length === 0) return () => {};

  const sections: Section[] = [];
  for (let i = 0; i < headingEls.length; i++) {
    sections.push({
      id: headingEls[i].id,
      start: headingEls[i],
      end: headingEls[i + 1] ?? null,
    });
  }

  const tocContentEl = document.getElementById("toc-content");
  const highlightFrame = document.getElementById("toc-highlight-frame");

  function updateSectionHighlights() {
    const viewportBottom = window.innerHeight;
    const activeIds = new Set<string>();
    for (const sec of sections) {
      const sectionTop = sec.start.getBoundingClientRect().top;
      const sectionBottom = sec.end
        ? sec.end.getBoundingClientRect().top
        : (visibleArticle?.getBoundingClientRect().bottom ?? document.documentElement.scrollHeight - window.scrollY);
      if (sectionTop < viewportBottom && sectionBottom > 0) {
        activeIds.add(sec.id);
      }
    }

    document.querySelectorAll("[data-toc-link]").forEach((el) => {
      const id = el.getAttribute("data-toc-link");
      if (id && activeIds.has(id)) {
        el.classList.add("toc-link-active");
      } else {
        el.classList.remove("toc-link-active");
      }
    });

    if (highlightFrame && tocContentEl) {
      const activeLinks = tocContentEl.querySelectorAll(".toc-link-active");
      if (activeLinks.length > 0) {
        const containerRect = tocContentEl.getBoundingClientRect();
        let minTop = Infinity;
        let maxBottom = -Infinity;
        for (const link of activeLinks) {
          const r = link.getBoundingClientRect();
          const top = r.top - containerRect.top + tocContentEl.scrollTop;
          const bottom = r.bottom - containerRect.top + tocContentEl.scrollTop;
          if (top < minTop) minTop = top;
          if (bottom > maxBottom) maxBottom = bottom;
        }
        highlightFrame.style.top = (minTop - 8) + "px";
        highlightFrame.style.height = (maxBottom - minTop + 16) + "px";
        highlightFrame.style.opacity = "1";

        const viewTop = tocContentEl.scrollTop;
        const viewBottom = viewTop + tocContentEl.clientHeight;
        const pad = 8;
        let targetTop: number | null = null;
        if (minTop < viewTop + pad) {
          targetTop = minTop - pad;
        } else if (maxBottom > viewBottom - pad) {
          targetTop = maxBottom - tocContentEl.clientHeight + pad;
        }
        if (targetTop !== null) {
          const start = tocContentEl.scrollTop;
          const distance = targetTop - start;
          const duration = 180;
          const startTime = performance.now();
          function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }
          function animateScroll(now: number) {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            tocContentEl!.scrollTop = start + distance * easeOutCubic(t);
            if (t < 1) requestAnimationFrame(animateScroll);
          }
          requestAnimationFrame(animateScroll);
        }
      } else {
        highlightFrame.style.opacity = "0";
      }
    }

    /* 进度条 */
    let firstActiveIdx = -1;
    let lastActiveIdx = -1;
    for (let i = 0; i < sections.length; i++) {
      if (activeIds.has(sections[i].id)) {
        if (firstActiveIdx === -1) firstActiveIdx = i;
        lastActiveIdx = i;
      }
    }

    const progressBars = document.querySelectorAll(".toc-progress");
    for (const bar of progressBars) {
      const fill = bar.querySelector(".toc-progress-fill") as HTMLElement | null;
      if (!fill) continue;
      const slug = fill.getAttribute("data-progress-for");
      const secIdx = sections.findIndex((s) => s.id === slug);
      if (secIdx === -1) continue;
      const sec = sections[secIdx];

      if (firstActiveIdx === -1) {
        const top = sec.start.getBoundingClientRect().top;
        (bar as HTMLElement).style.visibility = top >= window.innerHeight ? "hidden" : "visible";
        if ((bar as HTMLElement).style.visibility === "visible") { fill.style.height = "100%"; fill.style.background = "var(--color-accent)"; }
        continue;
      }

      if (secIdx > lastActiveIdx) {
        (bar as HTMLElement).style.visibility = "hidden";
        continue;
      }
      (bar as HTMLElement).style.visibility = "visible";

      if (secIdx < firstActiveIdx) {
        fill.style.height = "100%";
        fill.style.background = "var(--color-accent)";
      } else if (secIdx <= lastActiveIdx) {
        const atBottom = (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 5);
        if (atBottom) {
          fill.style.height = "100%";
          fill.style.background = "var(--color-accent)";
          continue;
        }
        const sectionStart = sec.start.getBoundingClientRect().top + window.scrollY;
        const sectionEnd = sec.end
          ? sec.end.getBoundingClientRect().top + window.scrollY
          : (visibleArticle?.getBoundingClientRect().bottom ?? 0) + window.scrollY;
        const progress = (sectionEnd - sectionStart) > 0
          ? Math.max(0, Math.min(1, (window.scrollY - sectionStart) / (sectionEnd - sectionStart)))
          : 0;
        fill.style.height = (progress * 100) + "%";
        fill.style.background = "var(--color-accent)";
      } else {
        fill.style.height = "0%";
      }
    }
  }

  let sectionRaf = false;
  addWinListener("scroll", () => {
    if (sectionRaf) return;
    sectionRaf = true;
    requestAnimationFrame(() => {
      sectionRaf = false;
      updateSectionHighlights();
    });
  }, { passive: true });

  requestAnimationFrame(() => updateSectionHighlights());
  addWinListener("resize", () => updateSectionHighlights());

  return updateSectionHighlights;
}
