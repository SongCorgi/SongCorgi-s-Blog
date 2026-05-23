---
title: "TypeScript 中的设计模式实践"
published: 2024-09-10
tags: ["TypeScript", "教程"]
description: "用 TypeScript 实现工厂模式、观察者模式、策略模式等常见设计模式，重点讨论类型安全约束如何改变传统模式的实现方式。"
---

## 类型系统对设计模式的影响

传统设计模式（GoF 23 种）诞生于强类型语言（C++/Java）。TypeScript 的结构类型系统、联合类型、 discriminated unions 等特性让某些模式的实现更为简洁甚至不再必要。

## 工厂模式

```ts
// 用 discriminated union 替代传统继承工厂
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
  }
}
```

`Shape` 的联合类型 + `kind` 判别字段，自动获得 exhaustiveness check：遗漏任何类型，TS 编译报错。

## 观察者模式

```ts
type Listener<T> = (data: T) => void;

class EventEmitter<T> {
  private listeners = new Set<Listener<T>>();

  subscribe(fn: Listener<T>): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  emit(data: T): void {
    this.listeners.forEach(fn => fn(data));
  }
}
```

返回 `unsubscribe` 函数的模式让订阅管理更安全：无需记住原始函数引用，直接调用闭包即可退订。

## 策略模式

```ts
type DiscountStrategy = (price: number) => number;

const strategies: Record<string, DiscountStrategy> = {
  none: (p) => p,
  percent10: (p) => p * 0.9,
  fixed20: (p) => Math.max(0, p - 20),
};

function calculatePrice(price: number, strategy: string): number {
  return (strategies[strategy] ?? strategies.none)(price);
}
```

策略是纯函数，不需封装成类。`Record<string, DiscountStrategy>` 提供类型安全的策略注册表。
