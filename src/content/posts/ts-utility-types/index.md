---
title: "TypeScript 实用工具类型详解"
published: 2026-04-20
tags: ["TypeScript", "前端"]
description: "深入剖析 TypeScript 内置的 Partial、Required、Pick、Omit、Exclude、Extract 等工具类型，结合源码级实现理解其工作原理与实际应用场景。"
---

## 工具类型的本质

TypeScript 的工具类型（Utility Types）本质上是**基于泛型 + 映射类型 + 条件类型的类型级函数**。它们接收一个或多个类型参数，返回一个新类型。

## Partial<T> — 全部变为可选

源码实现：

```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

`keyof T` 获取 `T` 的所有键，`[P in keyof T]` 遍历每个键，`?` 将属性标记为可选。常用于更新接口的局部字段：

```ts
interface User {
  name: string;
  age: number;
  email: string;
}

function updateUser(id: string, patch: Partial<User>) {
  // patch 的每个字段都是可选的
}

updateUser("42", { age: 31 }); // 只更新 age，合法
```

## Required<T> — 全部变为必填

```ts
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

`-?` 是映射类型中的修饰符，表示**移除可选性**。与 `Partial` 互为逆操作。

## Pick<T, K> 与 Omit<T, K>

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type Omit<T, K extends keyof any> = {
  [P in Exclude<keyof T, K>]: T[P];
};
```

`Pick` 从 `T` 中选取指定键集合构建新类型，`Omit` 从 `T` 中排除指定键。两者配合使用可以实现精确的类型裁剪：

```ts
type PublicProfile = Omit<User, "email">;    // 移除 email
type UserPreview = Pick<User, "name" | "age">; // 仅保留 name 和 age
```

> 实际开发中优先使用 `Pick` 而非 `Omit` — 显式列出需要的字段比隐式排除更安全，新增字段不会意外泄露。

## Exclude<T, U> 与 Extract<T, U>

这两个操作的是联合类型（Union），而非对象类型：

```ts
type Exclude<T, U> = T extends U ? never : T;
type Extract<T, U> = T extends U ? T : never;
```

关键在于 `T extends U` 对联合类型会**逐项分发**（distributive conditional type）：

```ts
type A = "a" | "b" | "c";
type B = Exclude<A, "a" | "b">; // "c" — 从 A 中排除 "a" 和 "b"
type C = Extract<A, "a" | "c">; // "a" | "c" — 从 A 中提取匹配项
```

分发逻辑：`("a" extends "a"|"b" ? never : "a") | ("b" extends ...) | ("c" extends ...)`，最终得到 `"c"`。
