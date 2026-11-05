import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "zh-CN",
  title: "Pi 学习笔记",
  description: "从运行、理解到逐步复刻 Pi 的学习记录",
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "学习文章", link: "/articles/01-run-pi-from-source" },
      { text: "学习指南", link: "/guide/background" },
    ],
    sidebar: [
      {
        text: "学习文章",
        items: [
          { text: "01. 在 Windows 上运行 Pi", link: "/articles/01-run-pi-from-source" },
        ],
      },
      {
        text: "学习指南",
        items: [
          { text: "项目背景", link: "/guide/background" },
          { text: "分支工作流", link: "/guide/workflow" },
          { text: "学习方法", link: "/guide/learning-method" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/3277318102/pi-study" },
    ],
    search: {
      provider: "local",
    },
    outline: {
      label: "本页目录",
      level: [2, 3],
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    lastUpdated: {
      text: "最后更新于",
    },
  },
});

