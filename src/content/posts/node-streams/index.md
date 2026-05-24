---
title: "Node.js Stream 深入理解"
published: 2025-11-08
tags: ["TypeScript", "后端"]
belongToSet: "Node.js 探秘"
description: "从 Readable、Writable、Transform 三大核心出发，结合背压机制与管道模式，掌握 Node.js Stream 的实际用法与常见陷阱。"
---

## 为什么需要 Stream

传统的文件读取方式是将整个文件读入内存再处理。对于大文件（如几百 MB 的日志），这种方式会导致内存耗尽。Stream 将数据切分成小块（chunk），逐个处理后再释放，内存占用恒定。

```
传统方式：文件 → 全部读入内存 → 处理 → 输出
Stream：  文件 → chunk1 → 处理 → chunk1输出
                → chunk2 → 处理 → chunk2输出
                → ...
```

## 三种核心 Stream

```ts
import { Readable, Writable, Transform, pipeline } from "node:stream";

// Readable — 数据来源
const source = Readable.from(["hello", "world", "from", "stream"]);

// Transform — 数据处理（可读可写）
const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  },
});

// Writable — 数据终点
const sink = new Writable({
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  },
});

// pipeline 自动处理背压和错误传播
pipeline(source, upperCase, sink, (err) => {
  if (err) console.error("Pipeline failed:", err);
  else console.log("Pipeline succeeded");
});
```

## 背压机制

当 Writable 的消费速度慢于 Readable 的生产速度时，Stream 会自动暂停读取，等待消费者赶上。`pipeline()` 自动处理背压信号，而手动 `.pipe()` 则需要自行监听 `drain` 事件。
