---
title: 第 1 篇：在 Windows 上运行 Pi 原始仓库
description: 从环境检查、安装依赖到登录模型，手动运行 Pi 源码仓库。
---

# 第 1 篇：在 Windows 上运行 Pi 原始仓库

这篇文章带你在 Windows 上手动运行本地 `pi/` 源码仓库。我们不会全局安装 Pi，也不会修改源码；目标是先看见 Pi 的交互界面，并理解每条命令做了什么。

## 本篇完成标准

完成后，你应该能够：

- 确认 Node.js、npm 和 Git 是否满足要求；
- 在正确的目录安装源码仓库依赖；
- 生成源码运行所需的本地模型目录数据；
- 使用仓库自带的 Windows 脚本启动 Pi；
- 登录模型提供商并选择模型；
- 给 Pi 发送一条只读学习任务；
- 正常退出并再次启动 Pi。

## 先理解我们要运行什么

当前工作区中有两个容易混淆的目录：

```text
C:\develop\pi-study
├─ pi\       Pi 原始源码仓库
└─ c-pi\     我们自己的学习项目和文档
```

这次需要进入的是：

```text
C:\develop\pi-study\pi
```

不要在 `c-pi/` 中执行本文的源码启动命令。`c-pi/` 目前只承载学习文档和以后逐步复刻的代码。

Pi 源码仓库提供了以下 Windows 启动链路：

```text
pi-test.bat
  └─ pi-test.ps1
       └─ node --import source-resolver.ts packages/coding-agent/src/cli.ts
```

它直接加载源码入口，因此第一次体验交互模式时不需要先运行完整的 `npm run build`。不过，源码入口会读取本地生成的模型目录 JSON，所以启动前还需要单独执行一次模型数据生成命令。

## 第 1 步：打开合适的终端

推荐使用 **Windows Terminal**，然后打开“命令提示符”或 PowerShell 标签页。Pi 官方文档将 Windows Terminal 列为原生 Windows 环境的推荐终端，因为旧版控制台可能存在输入和界面刷新问题。

本文主要给出“命令提示符”命令。你也可以使用 PowerShell，但 npm 命令建议始终写成 `npm.cmd`，这样可以避开本机对 `npm.ps1` 的执行策略限制。

## 第 2 步：进入 Pi 源码仓库

在命令提示符中执行：

```bat
cd /d C:\develop\pi-study\pi
```

如果使用 PowerShell，则执行：

```powershell
Set-Location C:\develop\pi-study\pi
```

确认当前位置：

```bat
cd
```

预期看到：

```text
C:\develop\pi-study\pi
```

后面的依赖安装和启动命令都要在这个目录执行。

## 第 3 步：检查基础环境

依次执行：

```bat
node --version
npm.cmd --version
git --version
```

Pi 当前源码要求：

```text
Node.js >= 22.19.0
```

例如 `v22.19.0`、`v24.x` 或更高版本都满足版本条件。如果 Node.js 低于 `22.19.0`，先升级 Node.js，再继续安装依赖。

`git --version` 能正常显示版本，通常也表示已经安装 Git for Windows。Pi 在原生 Windows 上默认使用 Git Bash 执行 Bash 命令，所以后面仍会用到它。

## 第 4 步：确认 Git 状态

先了解自己正在操作哪个分支：

```bat
git branch --show-current
git status --short --branch
git remote -v
```

这些命令都是只读操作：

- `git branch --show-current`：显示当前分支；
- `git status --short --branch`：显示分支和未提交修改；
- `git remote -v`：显示远程仓库地址。

当前分支可能是 `main`，也可能是你的学习分支，例如 `pi-1105-2026`。运行 Pi 本身不要求切换分支。本篇不要执行清理、重置、合并或推送操作。

如果状态中出现你不认识的修改，先停止操作并弄清来源，不要使用命令强行清理。

::: tip 当前远程仓库不影响本地启动
本地仓库的远程地址指向原仓库还是 Fork，不会影响本文的源码启动。远程仓库配置属于后续 Git 工作流内容，本篇不修改它。
:::

## 第 5 步：安装源码依赖

在 `C:\develop\pi-study\pi` 中执行：

```bat
npm.cmd install --ignore-scripts
```

这条命令的含义是：

- `npm.cmd install`：根据根目录 `package.json` 和 `package-lock.json` 安装整个 monorepo 的依赖；
- `--ignore-scripts`：安装期间不运行依赖或项目定义的生命周期脚本，降低意外执行安装脚本的风险。

安装可能需要几分钟。完成后，仓库根目录会出现 `node_modules/`。

安装结束后再次检查 Git 状态：

```bat
git status --short --branch
```

正常情况下，安装依赖不应该要求你修改源码。如果 `package-lock.json` 或其他已跟踪文件发生变化，先不要提交，保留终端输出并截图确认原因。

::: warning 为什么不用 `npm install`
在你的 PowerShell 环境中，直接输入 `npm` 可能会调用 `npm.ps1`，随后被执行策略拦截。使用 `npm.cmd` 可以直接调用 Windows 命令文件，不需要修改系统执行策略。
:::

## 第 6 步：生成本地模型目录数据

Pi 的模型定义分为两部分：

- 提交在 Git 中的 TypeScript 包装文件；
- 根据上游模型目录生成、但被 Git 忽略的 `packages/ai/src/providers/data/*.json`。

刚克隆的仓库不包含第二部分。执行下面的命令联网获取模型目录，并只生成运行需要的 JSON 数据：

```bat
npm.cmd run hydrate:model-data
```

这个根目录脚本实际调用：

```text
npm --prefix packages/ai run hydrate-model-data
```

生成成功后，终端应出现类似提示：

```text
Hydrated JSON model values under src/providers/data/
```

你也可以检查报错中缺失的文件是否已经生成：

```bat
dir packages\ai\src\providers\data\amazon-bedrock.json
```

该目录已被原仓库的 `.gitignore` 忽略，因此这些 JSON 不需要提交。这个步骤需要访问上游模型目录；如果下载失败，请保留完整错误信息再排查网络或代理。

当前这台电脑的 Windows 用户代理地址是 `127.0.0.1:7897`。Node.js 默认不会自动读取 Windows 系统代理；如果直连 `models.dev` 超时，可以在当前命令提示符窗口临时启用 Node 的环境代理支持：

```bat
set NODE_USE_ENV_PROXY=1
set HTTP_PROXY=http://127.0.0.1:7897
set HTTPS_PROXY=http://127.0.0.1:7897
npm.cmd run hydrate:model-data
```

这些 `set` 命令只影响当前命令提示符窗口，关闭窗口后失效。如果代理软件以后更换了 HTTP 代理端口，需要把 `7897` 换成新的端口。

::: tip 为什么不直接运行完整构建
`npm.cmd run build` 也会刷新模型数据，但随后还会编译整个 monorepo。第一次只想从源码启动 Pi 时，执行 `hydrate:model-data` 更直接，也更容易理解当前缺少的是什么。
:::

## 第 7 步：从源码启动 Pi

依赖安装并生成模型目录数据后执行：

```bat
pi-test.bat
```

在 PowerShell 中也可以明确写成：

```powershell
.\pi-test.bat
```

`pi-test.bat` 会完成两件事：

1. 使用 `-ExecutionPolicy Bypass` 调用仓库内的 `pi-test.ps1`；
2. 通过 Node.js 直接加载 `packages/coding-agent/src/cli.ts`。

这里的 `Bypass` 只应用于这个子 PowerShell 进程，不会永久修改你的系统执行策略。

成功后，终端会进入 Pi 的交互界面。界面通常包含：

- 当前会话内容；
- 用于输入提示词和命令的编辑区；
- 当前目录、模型、上下文和用量等状态信息。

如果首次启动询问是否信任当前项目，请先确认路径确实是：

```text
C:\develop\pi-study\pi
```

这是你主动下载并准备学习的仓库时，才选择信任。

## 第 8 步：登录模型提供商

Pi 的交互界面启动后，输入：

```text
/login
```

然后：

1. 选择你已经拥有账号、订阅或 API Key 的提供商；
2. 按界面提示完成登录或粘贴 API Key；
3. 登录完成后输入 `/model`；
4. 选择一个可用模型。

Pi 会把通过 `/login` 保存的凭据放在用户级 Agent 目录的 `auth.json` 中，而不是当前项目中。不要把该文件内容、API Key 或包含凭据的截图发到公开位置。

如果你暂时没有任何支持的模型账号或 API Key，Pi 的界面仍可能启动，但无法正常请求模型响应。

## 第 9 步：发送第一条只读任务

第一次体验建议只让 Pi 阅读，不让它修改文件。可以输入：

```text
请只阅读当前仓库，不要修改任何文件。告诉我这个 monorepo 的主要目录分别负责什么，并指出交互式 CLI 的源码入口。
```

观察 Pi 的工作过程：

- 它读取了哪些文件；
- 它是否发现根目录 `AGENTS.md`；
- 它如何定位 `packages/coding-agent/src/cli.ts`；
- 它是否执行了命令；
- 最终解释是否能和源码对应起来。

Pi 默认不会在每次工具调用前都请求确认。即使提示词要求“只读”，仍应观察它展示的工具调用。重要仓库应始终使用版本控制或备份保护。

## 第 10 步：验证 Windows 命令环境

Pi 在原生 Windows 中默认通过 Git Bash 执行 Bash 命令。在 Pi 输入区执行：

```text
!printf 'Bash is working\n'
```

预期输出：

```text
Bash is working
```

如果提示找不到 Bash，请确认已经安装 Git for Windows。Pi 默认会查找：

```text
%ProgramFiles%\Git\bin\bash.exe
%ProgramFiles(x86)%\Git\bin\bash.exe
```

## 第 11 步：退出和再次进入

退出 Pi 可以使用以下任一种方式：

```text
/quit
```

或者在输入框为空时按 `Ctrl+D`。

以后重新启动仍然执行：

```bat
cd /d C:\develop\pi-study\pi
pi-test.bat
```

如需继续当前目录最近一次保存的会话，可以执行：

```bat
pi-test.bat --continue
```

## 常见问题

### 1. 缺少 `packages/ai/src/providers/data/*.json`

典型错误包含：

```text
ERR_MODULE_NOT_FOUND
packages/ai/src/providers/data/amazon-bedrock.json
```

这表示依赖已经能够加载，但本地模型目录数据还没有生成。执行：

```bat
npm.cmd run hydrate:model-data
```

完成后重新运行：

```bat
pi-test.bat
```

这个错误与截图中的 Node.js `v26.4.0` 无关；该版本高于仓库要求的 `22.19.0`。

### 2. 获取 `models.dev` 时连接超时

典型错误包含：

```text
Failed to fetch models.dev catalog
UND_ERR_CONNECT_TIMEOUT
Connect Timeout Error
```

这表示 Node.js 尝试直连 `https://models.dev/experimental/v2.0/api.json`，但在超时时间内无法建立 HTTPS 连接。

当前电脑启用了本地代理 `127.0.0.1:7897`。在同一个命令提示符窗口执行：

```bat
set NODE_USE_ENV_PROXY=1
set HTTP_PROXY=http://127.0.0.1:7897
set HTTPS_PROXY=http://127.0.0.1:7897
npm.cmd run hydrate:model-data
```

`NODE_USE_ENV_PROXY=1` 会让当前 Node.js 读取 `HTTP_PROXY`、`HTTPS_PROXY` 和 `NO_PROXY` 环境变量。经过实际连通性检查，该代理访问 `models.dev` 返回 HTTP 200。

不要通过下面的方式绕过 TLS 验证：

```text
NODE_TLS_REJECT_UNAUTHORIZED=0
```

这会降低 HTTPS 安全性，而且当前错误是连接超时，不是证书验证错误。

### 3. `npm.ps1` 被禁止运行

典型错误包含：

```text
PSSecurityException
UnauthorizedAccess
```

不要急着修改整个系统的执行策略，改用：

```bat
npm.cmd install --ignore-scripts
```

### 4. Node.js 版本不满足要求

如果安装时看到 `Unsupported engine` 或版本提示，先执行：

```bat
node --version
```

确认版本至少为 `22.19.0`。

### 5. 启动时提示找不到包或模块

先确认当前路径和依赖目录：

```bat
cd
dir node_modules
```

如果当前路径不是 `C:\develop\pi-study\pi`，重新进入仓库根目录。如果 `node_modules` 不存在，重新执行依赖安装步骤。

### 6. Pi 启动了，但没有可用模型

在 Pi 中依次执行：

```text
/login
/model
```

确认所选提供商已经完成登录，并且账号或 API Key 有权访问对应模型。

### 7. Pi 找不到 Bash

安装 Git for Windows，然后重新打开 Windows Terminal。安装完成后可以在普通终端检查：

```bat
where git
where bash
```

### 8. 终端界面错位或快捷键异常

优先使用最新版 Windows Terminal，不要使用 Git Bash 自带的 mintty 窗口运行 Pi。Pi 官方文档指出旧版控制台和 mintty 存在已知显示或输入问题。

## 完成检查清单

完成本篇后，逐项确认：

- [ ] 当前路径是 `C:\develop\pi-study\pi`；
- [ ] Node.js 版本不低于 `22.19.0`；
- [ ] `npm.cmd install --ignore-scripts` 成功完成；
- [ ] `npm.cmd run hydrate:model-data` 成功生成模型目录 JSON；
- [ ] `git status` 中没有无法解释的修改；
- [ ] `pi-test.bat` 成功进入交互界面；
- [ ] `/login` 和 `/model` 已完成；
- [ ] 第一条只读任务得到了模型响应；
- [ ] Git Bash 验证命令正常输出；
- [ ] 能够使用 `/quit` 或 `Ctrl+D` 正常退出。

## 本篇涉及的原仓库文件

- [`package.json`](https://github.com/earendil-works/pi/blob/main/package.json)：Node.js 版本、workspaces 和开发命令；
- [`README.md`](https://github.com/earendil-works/pi/blob/main/README.md)：源码仓库开发启动说明；
- [`pi-test.bat`](https://github.com/earendil-works/pi/blob/main/pi-test.bat)：Windows 批处理入口；
- [`pi-test.ps1`](https://github.com/earendil-works/pi/blob/main/pi-test.ps1)：Windows 源码启动逻辑；
- [`packages/ai/catalog/README.md`](https://github.com/earendil-works/pi/blob/main/packages/ai/catalog/README.md)：模型目录的生成方式和数据布局；
- [`packages/coding-agent/docs/windows.md`](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/windows.md)：Windows 终端与命令环境说明；
- [`packages/coding-agent/docs/quickstart.md`](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/quickstart.md)：首次登录、选择模型和开始会话。

## 下一篇建议

下一步可以先不写代码，而是阅读 `package.json` 和 `packages/` 目录，建立 Pi monorepo 的整体结构地图。等你按照本文手动运行并确认成功后，再决定第二篇文章的具体主题。

