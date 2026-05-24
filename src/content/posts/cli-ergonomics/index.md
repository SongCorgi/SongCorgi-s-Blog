---
title: "CLI 工具的人机工程学"
published: 2025-06-22
tags: ["工具", "效率", "前端"]
belongToSet: "工具链深度剖析"
description: "如何设计一个符合人机工程学的命令行工具，从参数设计、输出格式、错误信息到交互式体验的实用原则与反模式分析。"
---

## 人机工程学为什么重要

CLI 工具的用户是开发者，而开发者每天面对大量命令行交互。一个符合人机工程学的 CLI 工具能显著降低认知负荷、减少输入错误、提升开发效率。反之，一个反直觉的 CLI 会让人每次使用都感到摩擦。

## 参数设计原则

```bash
# 好的设计：长选项可读，短选项快捷
mycli deploy --env production --region us-east-1
mycli deploy -e production -r us-east-1

# 坏的设计：只有长选项，没有短选项
mycli deploy --production true --us-east-1
```

## 输出格式

遵循 UNIX 哲学：**静默即成功**。操作成功时不输出冗余信息，仅在出错时输出明确原因。

```bash
# 好的输出：简洁
$ mycli deploy --env staging
Deploying to staging...
Done ✓

# 坏的输出：噪音
$ mycli deploy --env staging
[INFO] Initializing deployment pipeline...
[INFO] Resolving environment variables...
[INFO] Checking network connectivity...
[INFO] Network is reachable
...
Operation completed with status code 0 (success).
```

## 错误信息

好的错误信息应包含三要素：**出错了什么 + 为什么出错 + 如何修复**。

```bash
$ mycli deploy --env productoin
Error: Unknown environment "productoin"
Did you mean "production"?
```

> 不要只告诉用户"出错了"，给出可执行的下一步建议。节省用户一次 Google 搜索的时间。
