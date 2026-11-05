---
layout: home

hero:
  name: "Pi 学习笔记"
  text: "从理解到逐步复刻"
  tagline: "先运行和读懂原项目，再把功能拆成最小步骤逐一实现。"
  actions:
    - theme: brand
      text: 阅读第 1 篇文章
      link: /articles/01-run-pi-from-source
    - theme: alt
      text: 了解项目背景
      link: /guide/background

features:
  - title: 先理解
    details: 先确认原项目的功能、运行方式、入口和调用链，再开始实现。
  - title: 小步复刻
    details: 将功能拆成可独立理解和验证的最小步骤，每一步都形成完整闭环。
  - title: 持续记录
    details: 记录源码分析、实现过程、验证结果和分支差异，让后续对话可以直接继续。
---

## 本地运行

在 `c-pi` 目录执行：

```powershell
npm.cmd install --ignore-scripts
npm.cmd run docs:dev
```

构建静态文档：

```powershell
npm.cmd run docs:build
```

