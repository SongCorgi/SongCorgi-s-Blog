---
title: "我的开发工具链 2026"
published: 2026-02-28
tags: ["工具", "效率"]
belongToSet: "工具链深度剖析"
description: "盘点 2026 年日常开发中不可或缺的命令行工具、VS Code 插件与效率工作流，涵盖终端复用器、模糊搜索、Git 增强与 AI 辅助编程。"
---

## 终端工具

### Starship — 跨 Shell 提示符

```bash
# 安装
curl -sS https://starship.rs/install.sh | sh

# 在 ~/.zshrc 中启用
eval "$(starship init zsh)"
```

支持 Git 状态、Node/Python 版本、命令执行时间等信息直接在提示符中显示，且速度极快（Rust 编写）。

### Zoxide — 智能 cd

```bash
zoxide init zsh >> ~/.zshrc
```

记住访问过的目录，通过模糊匹配快速跳转：

```bash
z blog    # 跳转到 ~/coding_life/astro/CleanBlog
z dot     # 跳转到 ~/.config
```

### bat — 带语法高亮的 cat

```bash
bat src/content.config.ts
```

内置 200+ 语言的语法高亮，自动分页，显示行号和 Git 变更标记。

## VS Code 插件精选

| 插件 | 用途 |
|------|------|
| Astro | `.astro` 文件语法高亮、自动补全、格式诊断 |
| Tailwind CSS IntelliSense | class 名自动补全、hover 预览实际 CSS |
| Error Lens | 行内显示错误/警告信息，无需鼠标悬停 |
| GitLens | 行级 Git blame、文件历史、commit 对比 |

## Git 增强：lazygit

```bash
# 在任意 Git 仓库中启动
lazygit
```

终端内的交互式 Git 客户端，支持暂存/提交/分支切换/patch 操作，全部通过键盘快捷键完成，比手敲 git 命令快很多。

## AI 辅助编程

2026 年的 AI 编程工具已经从补全代码演进到**理解整个代码库**。日常使用 Claude Code 处理重构、代码审查、测试生成等任务。关键不在于让 AI 替你写代码，而在于将重复性工作交给它，把精力集中在架构决策和业务逻辑上。

> 工具链的核心原则：每个工具只做好一件事；工具之间通过标准输入输出组合；键盘优先，减少鼠标切换的上下文切换成本。
