<p align="center">
  <img src="./assets/screenshots/welcome.png" alt="omp 中文欢迎页" width="720">
</p>

# oh-my-pi-zh · Oh My Pi 中文汉化版

**本仓库是 [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)(omp)的中文界面汉化 fork，由 木乙创设 MYC丨AIGC 维护。** 这里只做一件事：把 omp 的界面完整汉化成中文，并跟随上游每个官方版本发布对应的 `-zh` 构建。引擎、工具与模型提供商全部保持上游实现——不加功能，不改行为。

Language: [English](README.md) | **简体中文**

- **当前对齐**：上游官方 **v19.0.1**（commit `f40f335845f`），发布为 tag `v19.0.1-zh`
- **发布历史与质量校验**：[CHANGELOG.zh.md](CHANGELOG.zh.md)
- **语言切换**：`OMP_LANG=zh` 优先，其次 `~/.omp/agent/config.yml` 的 `i18n.language`；设为 `en` 即回到上游英文

## 安装（仅 Windows x64）

Releases 只发布**一个产物：`omp-windows-x64.exe`**——**没有 Linux / macOS 构建**。

1. 从 [Releases](../../releases) 下载 `omp-windows-x64.exe`（每个 Release 附 SHA-256）；
2. 放入 PATH 目录（可改名为 `omp.exe`）；
3. 运行 `omp`，按欢迎页提示配置模型。

> [!WARNING]
> 上游官方的安装方式 —— `curl -fsSL https://omp.sh/install`、`brew install can1357/tap/omp`、npm 包 `@oh-my-pi/pi-coding-agent` —— 安装的都是**上游英文版 omp**，与本仓库无关。中文版只能从本仓库 [Releases](../../releases) 获取，或按[从源码构建](#从源码构建)自行编译。

## 中文界面实拍

以下截图实拍于 `v18.16.0-zh`（2026-11）：用 ConPTY 驱动真实 omp 进程，抓取 110×34 终端字节流后逐单元格重建——不是设计稿，也不是贴图改字。

### 欢迎页

![中文欢迎页](./assets/screenshots/welcome.png)

### 设置页

![外观设置](./assets/screenshots/settings-appearance.png)

![模型设置](./assets/screenshots/settings-model.png)

![交互设置](./assets/screenshots/settings-interaction.png)

![工具设置](./assets/screenshots/settings-tools.png)

## 汉化范围

| 范围 | 内容 |
| --- | --- |
| 已汉化 | TUI 界面（欢迎页与提示、聊天/工具渲染器、覆盖层、设置界面、斜杠命令反馈）、`omp --help` 与各子命令帮助、`omp stats` 全部仪表盘页面 |
| 保持英文 | 引擎与工具行为、品牌名与模型 id、`true`/`false` 等字面量；CLI 纯数据输出刻意保持上游原文 |

翻译以英文原文为 source of truth，在 UI 边界（`interceptUIString` / `i18n.t` / tui seam `tuiT`）生效；源码字符串保持英文，不出现中文字面量。

## 与上游的关系

- 上游项目：[can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) · 官网 [omp.sh](https://omp.sh)——功能介绍、安装方式与文档均以官方仓库为准
- 本 fork **只做界面汉化**：不修上游 bug、不新增功能；每轮对齐官方 `vX.Y.Z` tag，发布为 `vX.Y.Z-zh`
- 镜像：GitHub `feigo313/oh-my-pi-zh` · Gitee `atrix313/oh-my-pi-zh`（默认分支均为 `master`）

### 会话控制

斜杠命令会改变整个会话的运行方式：

- `/vibe` — 进入 [Vibe 模式](docs/vibe-mode.md)：以导演身份驱动持久化的 `fast`/`good` worker 会话，自身仅使用 `read` 工具集。
- `/fresh` — 重置提供商的流状态（过期的提示缓存、卡住的流），不改变本地对话记录。参见 [Session operations](docs/session-operations-export-share-fork-resume.md#fresh)。

## 六十多个提供商、上千个模型，_只需一次 /model_。

九种角色按用途分配模型。`default` 用于常规对话；`smol` 用于低成本地批量派发子智能体；`slow` 用于深度推理；`plan` 用于计划模式；`commit` 用于生成变更日志；此外还有 `vision`、`task`、`advisor` 和 `tiny`，各司其职。启动时可用 `--smol`、`--slow` 或 `--plan` 覆盖；用 `Ctrl+P` 在当前角色已配置的模型间循环切换。会话中可用 `/model` 斜杠命令切换当前模型。

下文的认证标签：`oauth` 表示用你在该提供商的账号登录，`plan` 表示通过编程套餐订阅使用，`local` 表示连接本地服务器，密钥可选。

### 前沿 API

直连 API 和网关。可按角色混用不同提供商。

Anthropic `oauth` · OpenAI · OpenAI Codex `oauth` · Google Gemini · Google Vertex · Google Antigravity `oauth` · xAI · SuperGrok `oauth` · DeepSeek · Mistral · Groq · Cerebras · SambaNova · Fireworks · Together · Modular · Baseten · DeepInfra · Hugging Face · NVIDIA · Meta · Inception · Amazon Bedrock · Azure OpenAI · SiliconFlow · GMI Cloud · CoreWeave · Sakana AI · Command Code · Charm Hyper · StepFun · Helmcode · OpenRouter · Synthetic · Vercel AI Gateway · Cloudflare AI Gateway · Wafer Serverless · Scaleway · Otari

### 编程套餐

走订阅额度。用 `/login` 登录后即可在会话中使用。

Cursor `oauth` · GitHub Copilot `oauth` · GitLab Duo · Devin `oauth` · Kimi Code `plan` · Moonshot · MiniMax Coding Plan `plan` · MiniMax Coding Plan CN `plan` · Alibaba Coding Plan `plan` · Qwen Portal `oauth` · Z.AI / GLM Coding Plan `plan` · Zhipu Coding Plan `plan` · Xiaomi MiMo · Qianfan · Umans `plan` · NanoGPT · Novita · Venice · Kilo · ZenMux · OpenCode Go · OpenCode Zen

### 本地部署

兼容 OpenAI 的 `/v1/models`。本地实例无需密钥。

Ollama `local` · Ollama Cloud · LM Studio `local` · llama.cpp `local` · vLLM `local` · LiteLLM

### 自定义 OpenAI 兼容提供商

在 `~/.omp/agent/models.yml` 中定义自定义提供商：

```yaml
providers:
   spark:
      baseUrl: http://192.168.10.223:8000/v1
      api: openai-completions
      apiKey: dummy
      models:
         - id: minimax-m3
           name: MiniMax M3
           contextWindow: 100000
           maxTokens: 32000
```

运行 `omp models spark` 确认能发现该提供商的模型。然后运行 `omp setup` 并在选择默认模型的步骤中选中它，或在会话中打开 `/model` 将其分配给 `default` 角色。

如果不想通过选择器，也可以直接在 `~/.omp/agent/config.yml` 中预先配置默认模型：

```yaml
modelRoles:
   default: spark/minimax-m3
```

### 让路由真正好用的四个开关

- **自定义提供商** — 在 `~/.omp/agent/models.yml` 中声明任何支持以下协议的服务：`openai-completions`、`openai-responses`、`openai-codex-responses`、`azure-openai-responses`、`anthropic-messages`、`bedrock-converse-stream`、`google-generative-ai`、`google-gemini-cli`、`google-vertex`、`typesafe`、`openrouter-decisions`、`openai-decisions` 或 `workers-ai-systemone`（后几个为评判类 API）。
- **回退链** — 在 `retry.fallbackChains` 下按角色或按模型配置回退链。当主模型返回 429 或触及配额上限时，链中下一项接管本轮剩余部分——冷却后自动恢复。
- **按路径限定模型** — 给 `enabledModels` 和 `disabledProviders` 条目加上 `path:` 前缀，即可在某个仓库固定一组不同的模型，而无需改动全局配置。限定条目覆盖该路径及其下所有内容。
- **轮换凭据** — 为每个提供商叠加多个 API 密钥，运行时会按会话亲和性轮换，并对每个凭据单独退避。适合一个密钥中午前就会把配额烧光的情况。

完整的提供商与路由参考见 [omp.sh/docs/providers](https://omp.sh/docs/providers)。

## 二十五个后端。_智能体早已用惯的一个工具_。

`web_search` 是内置的，而不是外挂的。`auto` 会依次尝试二十五个提供商；如果你已经付费订阅了某一个，也可以按名称固定使用。每个搜索结果背后，站点感知的提取器会把 GitHub、包注册表、arXiv、Stack Overflow 和文档站点转换为结构化 Markdown——锚点和链接目标都会保留。

### 搜索提供商

二十五个后端。固定使用其中之一，或让 `auto` 按顺序依次尝试。

| 提供商       | 认证方式                                  |
| ------------ | ----------------------------------------- |
| `auto`       | 按顺序依次尝试                            |
| `perplexity` | `PERPLEXITY_API_KEY`（可匿名回退）        |
| `gemini`     | oauth                                     |
| `anthropic`  | oauth                                     |
| `codex`      | oauth                                     |
| `xai`        | oauth 或 `XAI_API_KEY`                    |
| `zai`        | `ZAI_API_KEY`                             |
| `exa`        | `EXA_API_KEY`（或 mcp）                   |
| `tinyfish`   | `TINYFISH_API_KEY`                        |
| `keenable`   | `KEENABLE_API_KEY`（可无密钥回退）        |
| `sofya`      | `SOFYA_API_KEY`                           |
| `jina`       | `JINA_API_KEY`                            |
| `kagi`       | `KAGI_API_KEY`                            |
| `tavily`     | `TAVILY_API_KEY`                          |
| `firecrawl`  | `FIRECRAWL_API_KEY`（可无密钥回退）       |
| `brave`      | `BRAVE_API_KEY`                           |
| `kimi`       | `/login kimi-code` 或搜索密钥             |
| `parallel`   | `PARALLEL_API_KEY`                        |
| `synthetic`  | `SYNTHETIC_API_KEY`                       |
| `searxng`    | 自托管                                    |
| `duckduckgo` | 无需密钥                                  |
| `startpage`  | 无需密钥                                  |
| `google`     | 无需密钥（浏览器）                        |
| `ecosia`     | 无需密钥（浏览器）                        |
| `mojeek`     | 无需密钥（浏览器）                        |
| `public`     | 无需密钥（整合以上所有）                  |

Exa 也可以通过 `/login exa` 存储 API 密钥；显式选择无密钥模式时使用公共 MCP 回退。

### 专用处理器

智能体拿到的是结构化内容，而不是剥掉标签后的一堆 HTML 文本。

- **代码托管** — github、gitlab
- **包注册表** — npm、PyPI、crates.io、Hex、Hackage、NuGet、Maven、RubyGems、Packagist、pub.dev、Go packages
- **学术来源** — arxiv、semantic scholar
- **论坛** — stack overflow、reddit、hn
- **文档** — mdn、readthedocs、docs.rs

页面会被转换为保留链接结构的 Markdown。智能体可以引用、跟进和摘录，而不会丢失锚点。

### 安全数据库

漏洞查询返回的是官方数据，而不是博客摘要。

- **NVD** — 美国国家漏洞数据库
- **OSV** — 开源漏洞数据源
- **CISA KEV** — 已知被利用漏洞目录

[`web_search` 参考 ↗](https://omp.sh/docs/tools#web_search)

## 约 **80,000** 行 Rust，干的是其他智能体框架要调用外部程序才能做的活。

六个 crate，一个按平台打包的 N-API 插件。搜索、shell、AST、语法高亮、PTY、桌面控制、图像解码、BPE 计数——全部在 libuv 线程池中进程内完成。热路径上没有 fork/exec。shell 是我们自己的 bash 5.3 引擎，58 个命令行工具——coreutils、findutils、sed、jq、基于 ripgrep 的 grep、fd、diff、moreutils——被移植进 builtins crate，直接编译进 shell。

- Crate：`omp-natives`、`omp-shell`、`omp-ast`、`omp-iso`、`omp-voice`、`omp-xfs`
- 平台：`linux-x64`、`linux-arm64`、`darwin-x64`、`darwin-arm64`、`win32-x64`、`win32-arm64`——x64 同时提供 AVX2 和基线两种二进制

按 crate 统计（仅代码行）：

| Crate      | 功能                                                                         | ~代码行 |
| ---------- | ---------------------------------------------------------------------------- | ------: |
| omp-shell   | 内嵌 bash 引擎 · 持久会话 · 进程内 coreutils 调度 · 输出精简器               |  38,000 |
| omp-natives | N-API 接口层——下表中的所有模块                                               |  25,000 |
| omp-xfs  | 并行遍历器 · 目录列表缓存 · glob · 为 natives 和 shell 的 rg/grep/fd 提供正则搜索 | 11,400 |
| omp-iso     | 工作区隔离 · apfs · btrfs · zfs · reflink · overlayfs · projfs · rcopy        |   3,300 |
| omp-ast     | tree-sitter + ast-grep 匹配、代码块解析、结构化摘要                          |   2,900 |
| omp-voice   | 音频采集/播放 · Opus · 实时 WebRTC                                           |   1,000 |

`omp-natives` 内部的模块明细（省略胶水代码和测试）：

| 模块          | 功能                                                                  | 基于                                      | ~代码行 |
| ------------- | --------------------------------------------------------------------- | ----------------------------------------- | ------: |
| desktop       | 为 `computer` 提供窗口/显示器枚举 · 截图 · 原生输入 · AX 树           | xcap · enigo · OS AX FFI                  |  10,600 |
| grep          | 正则搜索 · 并行/串行 · glob 与类型过滤 · 模糊查找                     | grep-regex · grep-searcher                |   3,280 |
| text          | ANSI 感知的宽度计算 · 截断 · 按列切片 · 保留 SGR 的换行               | unicode-width · segmentation              |   2,070 |
| snapcompact   | 用于上下文压缩的位图帧光栅化 + PNG 编码                               | image · png                               |   1,760 |
| keys          | Kitty 键盘协议，带 xterm 回退 · PHF 完美哈希查找                      | phf                                       |   1,740 |
| ast           | ast-grep 模式匹配与结构化重写                                         | ast-grep-core                             |   1,510 |
| diff          | 为工具和预览提供结构化文件 diff                                       | 自研                                      |   1,030 |
| pty           | 为 sudo · ssh 交互式提示分配原生 PTY                                  | portable-pty                              |     630 |
| crash_handler | 原生崩溃捕获与上报                                                    | 自研                                      |     610 |
| highlight     | 语法高亮 · 11 种语义类别 · 30+ 个别名                                 | syntect                                   |     550 |
| appearance    | Mode 2031 + 通过 CoreFoundation FFI 实现 macOS 原生深色/浅色检测      | core-foundation                           |     450 |
| task          | 在 libuv 线程池上执行阻塞任务 · 取消 · 超时 · 性能分析                | tokio · napi                              |     440 |
| glob          | 基于 glob 的发现 · 类型过滤 · 按 mtime 排序 · 遵循 gitignore          | ignore · globset                          |     430 |
| fd            | 用于替代 find 工具的文件系统遍历器                                    | ignore                                    |     385 |
| clipboard     | 系统剪贴板的文本复制与图片读取 · 无需 xclip/pbcopy                    | arboard                                   |     370 |
| workspace     | 一次遍历完成 gitignore 处理和 AGENTS.md 发现的工作区遍历器            | ignore                                    |     275 |
| power         | 用于阻止空闲/系统/显示器休眠的 macOS 电源断言 API                     | IOKit FFI                                 |     270 |
| prof          | 环形缓冲区性能分析器，输出折叠栈和 SVG 火焰图                         | inferno                                   |     240 |
| file_lock     | 跨进程建议性文件锁                                                    | 自研                                      |     210 |
| ps            | 跨平台进程树终止与子孙进程列举                                        | libc · libproc · CreateToolhelp32Snapshot |     195 |
| tokens        | O200k / Cl100k BPE token 计数 · 两张表均已内嵌                        | tiktoken-rs                               |      70 |
| html          | HTML 转 Markdown，可选内容清理                                        | html-to-markdown-rs                       |      60 |
| sixel         | 终端图像渲染 · 解码 PNG · JPEG · WebP · GIF · 缩放 · SIXEL 编码       | icy_sixel · image                         |      55 |

## 四种入口：_交互式_、_单次执行_、RPC 和 ACP。

同一个引擎，四种封装。`omp` 运行 TUI。`omp -p` 回答单个提示后退出。Node SDK 把会话嵌入你的进程。`omp --mode rpc` 和 `omp acp` 通过 stdio 把控制权交给另一个程序。

### 交互式——拿不准时，智能体会问你

TUI 是默认界面。工具调用渲染为卡片，编辑在写入磁盘前可预览，遇到歧义时则通过 `ask` 工具处理——这是智能体可以在回合中途弹出的表单，并预先选中它推荐的选项。其余操作都可以用键盘完成。

同样的表单也会以 elicitation 的形式通过 ACP 呈现，编辑器无需自己编写对话框。

![omp TUI 显示 ask 表单中的一个多选字段。](assets/ask.webp)

### SDK——嵌入 Node

`@oh-my-pi/pi-coding-agent`

Node 和 TypeScript 宿主可以直接引入引擎。该包导出 `ModelRegistry`、`SessionManager`、`createAgentSession` 和 `discoverAuthStorage`；会话会发出带类型的事件供你订阅。

```ts
import { ModelRegistry, SessionManager, createAgentSession, discoverAuthStorage } from "@oh-my-pi/pi-coding-agent";

const auth = await discoverAuthStorage();
const models = new ModelRegistry(auth);
await models.refresh();

const { session } = await createAgentSession({
	sessionManager: SessionManager.inMemory(),
	authStorage: auth,
	modelRegistry: models,
});
await session.prompt("list .ts files");
```

### RPC——通过 stdio 驱动

`omp --mode rpc`

适用于非 Node 的嵌入方，或需要进程隔离的场景。输入 NDJSON 命令，输出响应帧和事件帧；每个提示以各自的 `prompt_result` 结束。`--mode rpc-ui` 会额外以 `extension_ui_request` 帧的形式发送工具卡片、选择器和对话框，宿主必须应答；`--no-ui` 则连扩展对话框也不会发送，适用于没有 UI 的宿主。

```
$ omp --mode rpc --no-session
> {"id":"r1","type":"prompt","message":"list .ts files"}
< {"id":"r1","type":"response", ...}
> {"id":"r2","type":"set_model","provider":"anthropic","modelId":"sonnet-4.5"}
> {"id":"r3","type":"abort"}
```

### ACP——与编辑器对话

`omp acp`

基于 JSON-RPC 的 [Agent Client Protocol](https://github.com/zed-industries/agent-client-protocol)。当编辑器声明了相应能力时，工具 I/O 会经由编辑器路由，写入操作需通过 `session/request_permission` 授权。

| omp 工具     | ACP 路由                            |
| ------------ | ----------------------------------- |
| `bash`       | `terminal/create + terminal/output` |
| `read`       | `fs/read_text_file`                 |
| `write`      | `fs/write_text_file`                |
| `edit, bash` | `session/request_permission`        |

完整参考：[omp.sh/docs/sdk](https://omp.sh/docs/sdk)。

## 值得长期使用的智能体框架，是你 _永远_ 不会嫌它不够用的那一个。

前往 **[omp.sh](https://omp.sh)** 获取。

omp 派生自 [Mario Zechner](https://github.com/mariozechner) 的 [Pi](https://github.com/badlogic/pi-mono)，并被重写为专注编程的智能体：会话、子智能体、斜杠命令、扩展——全部用 TypeScript 编写，全部采用 MIT 许可，全部开源在 [GitHub](https://github.com/can1357/oh-my-pi) 上。你可以通过配置定制它，从外部用钩子接入它，必要时直接阅读源码。

### 基本构件

扩展就是一个 TypeScript 模块。它与内置功能使用相同的工具 API、相同的斜杠命令注册表、相同的快捷键表和相同的 TUI 构件。没有哪项能力是内置功能独享的。

### 自动发现

首次运行时，omp 会继承磁盘上已有的一切：来自 `.claude`、`.cursor`、`.windsurf`、`.gemini`、`.codex`、`.cline`、`.github/copilot` 和 `.vscode` 的规则、技能和 MCP 服务器。无需迁移脚本。

### 可扩展性

让 omp 写出你缺少的那部分，然后执行 `/reload-plugins`。可以只留在本地，也可以放进 `marketplace` 分发，或发布到 npm。

## 理念

omp 派生自 [Mario Zechner](https://github.com/mariozechner) 的 [pi-mono](https://github.com/badlogic/pi-mono)，并扩展为功能齐全的编程工作流。

核心理念：

- 为真实的编程工作保留以终端为先的交互体验
- 内置实用功能（工具、会话、分支、子智能体、可扩展性）
- 让高级行为可配置，而不是隐藏起来

### 项目输入与信任

打开一个仓库时，omp 会按设计加载该项目自带的输入：设置、扩展、钩子、工具、命令、技能、规则以及项目级 MCP 配置。若只想在某次运行中排除项目的 `.mcp.json`，可传入 `--config <file>`，指向一个使用嵌套键的 YAML 覆盖文件（扁平写法 `mcp.enableProjectConfig: false` 会被忽略）：

```yaml
mcp:
   enableProjectConfig: false
```

使用 `--no-extensions` 跳过自动的扩展发现；或使用 `--trusted-extension /absolute/path/to/file.ts` 指定精确的扩展白名单。`--no-tools` 会禁用内置工具，但项目工具模块属于另一个独立的发现来源。这些参数只会收窄输入范围，不会改变仓库信任模型。

---

## 开发

### 从源码开始

全新克隆的仓库需要先安装工作区依赖并构建本地 Rust/N-API 插件，源码版 CLI 才能启动。

```sh
bun setup     # 安装依赖并构建 Rust 原生模块
bun run dev   # 从源码启动 omp
```

`bun setup` 会安装 Bun 工作区依赖并构建 `@oh-my-pi/pi-natives`。修改 Rust crate 或 `packages/natives` 后，请重新运行 `bun run build:native`。

本仓库发布的是中文版 omp：设置 `OMP_LANG=zh`（或在 `~/.omp/agent/config.yml` 里写 `i18n.language: zh`）即可使用中文界面。仓库结构、开发与贡献规范以上游文档为准（`CONTRIBUTING.md`、`packages/coding-agent/DEVELOPMENT.md`）。

Nix 用户可以获得固定版本的 Bun 和 Rust 工具链以及所有原生构建依赖：

```sh
nix develop
bun setup
bun dev
```

使用 `nix build .#omp` 构建并冒烟测试可分发的 Nix 包。Wayland 屏幕录制支持默认关闭（将 libpipewire 加入插件的库搜索路径会增加约 750 MB 的运行时闭包）；可通过 `omp.override { withWaylandScreencast = true; }` 开启。发布构建使用 fat LTO 链接 `omp-natives`；`omp.override { withFatLto = false; }` 改用 thin LTO，本地重新构建会快得多。Rust 依赖和原生插件在不同的 derivation 中构建，因此修改 Rust 代码会复用已编译的依赖，修改 TypeScript 会复用已构建的插件。`nix/bun.nix` 只在 `bun.lock` 变化时生成；发布时会自动重新生成。依赖变更后，请运行：

```sh
bun run gen:nix
```

该命令会优先使用 `nix develop` 中的 `bun2nix`；若不可用，则通过 Nix 进入开发 shell，最后回退到固定版本的 `bunx bun2nix@2.1.2`。请勿手动编辑 `nix/bun.nix`。

非交互式冒烟检查：

```sh
bun dev -- --version
```

#### Apple Silicon 上的 Nix 构建

在 Apple Silicon 上，`nix build .#omp` 会使用 nixpkgs 的 Swift 编译器和 `apple-sdk_27` 编译 Apple Foundation Models bridge。构建过程不会使用宿主机的 Xcode 或 Command Line Tools。如果无法编译该 bridge，构建会直接失败，而不是发布一个缺少 bridge 的版本。这两者都只是构建期依赖。要使用这些模型，仍需要 macOS 27+、受支持的设备，并开启 Apple Intelligence。如需在不包含该 bridge 的情况下构建，请使用 `omp.override { withAppleFm = false; }`。

### 调试命令

`/debug` 会打开用于调试、上报和性能分析的工具。

架构说明和贡献指南见 [packages/coding-agent/DEVELOPMENT.md](packages/coding-agent/DEVELOPMENT.md)。

---

## Monorepo 包

| 包                                                                            | 说明                                                       |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **[@oh-my-pi/collab-web](packages/collab-web)**                               | 协作实时会话的浏览器访客客户端、模拟宿主和本地中继         |
| **[@oh-my-pi/pi-ai](packages/ai)**                                            | 支持流式输出和模型/提供商集成的多提供商 LLM 客户端         |
| **[@oh-my-pi/pi-catalog](packages/catalog)**                                  | 模型目录：内置模型数据库、提供商描述符和模型身份识别       |
| **[@oh-my-pi/pi-agent-core](packages/agent)**                                 | 支持工具调用和状态管理的智能体运行时                       |
| **[@oh-my-pi/pi-coding-agent](packages/coding-agent)**                        | 交互式编程智能体 CLI 和 SDK                                |
| **[@oh-my-pi/pi-tui](packages/tui)**                                          | 支持差分渲染的终端 UI 库                                   |
| **[@oh-my-pi/pi-natives](packages/natives)**                                  | 用于 grep、shell、图像、文本、语法高亮等功能的 N-API 绑定  |
| **[@oh-my-pi/omp-stats](packages/stats)**                                     | AI 使用统计的本地可观测性面板                              |
| **[@oh-my-pi/omptype](packages/omptype)**                                     | 兼容 ArkType、带惰性 JIT 编译的 schema 校验库              |
| **[@oh-my-pi/pi-utils](packages/utils)**                                      | 共享工具库（日志、流、目录/环境/进程辅助函数）             |
| **[@oh-my-pi/pi-wire](packages/wire)**                                        | 协作实时会话共享的协议类型和中继常量                       |
| **[@oh-my-pi/pi-mnemopi](packages/mnemopi)**                                  | 面向 omp 智能体的本地 SQLite 记忆引擎                      |
| **[@oh-my-pi/snapcompact](packages/snapcompact)**                             | 位图帧上下文压缩包及 SQuAD 评测套件                        |
| **[@oh-my-pi/browser-relay](packages/browser-relay)**                         | 让 Eval 浏览器 API 驱动你现有标签页的 Chrome 扩展          |
| **[@oh-my-pi/pi-metaharness](packages/metaharness)**                          | 统一的基准测试运行器、Harbor 运行存储、REST/SSE API、实时面板 |
| **[@oh-my-pi/typescript-edit-benchmark](packages/typescript-edit-benchmark)** | 基于 TypeScript 源码变异构建的编辑基准测试套件             |

### Rust Crate

| Crate                                      | 说明                                                                                     |
| ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| **[omp-natives](crates/natives)**        | `@oh-my-pi/pi-natives` 使用的核心 Rust 原生插件（N-API `cdylib`）；聚合下列各 crate      |
| **[omp-shell](crates/shell)**            | 内嵌的 bash 5.3 引擎（解析器、虚拟机、进程创建、会话）、PTY 和进程管理                   |
| **[omp-ast](crates/ast)**                | 基于 tree-sitter 的代码摘要器和 AST 工具（50+ 种语言语法）                               |
| **[omp-iso](crates/iso)**                | 任务隔离后端解析器：APFS 克隆、btrfs/zfs reflink、overlayfs、projfs、rcopy               |
| **[omp-voice](crates/voice)**            | 音频采集/播放、Opus 编解码和实时 WebRTC 流式传输基础组件                                 |
| **[omp-xfs](crates/xfs)**          | 为 natives 和 shell 提供并行的 ignore 感知遍历器、目录列表缓存、glob 和内容搜索          |
| **[omp-edit](crates/edit)**              | `edit` 工具背后的编辑引擎：基于行锚点的 patch/hashline 模式、流式预览、原子化应用        |
| **[omp-builtins](crates/builtins)**      | 67 个进程内命令行工具以及进程内建命令（ps、top、pgrep、pkill 等）                        |

## 参与贡献

Issue 和 Pull Request 向所有人开放。开放 PR 目前处于**试行**阶段——在评估效果期间暂时取消了此前的担保（vouch）要求，之后可能会恢复。贡献指南请参阅 **[CONTRIBUTING.md](CONTRIBUTING.md)**。

---

## 许可证

OMP 基于 [MIT 许可证](LICENSE) 发布。

第三方代码和内置（vendored）的上游代码，包括 `crates/builtins/LICENSE` 中标明的第三方部分，仍遵循各自上游的许可证。每个发布的组件都附带自己的 `THIRD-PARTY-NOTICES.txt`：CLI（`packages/coding-agent`）、原生插件（`packages/natives`）和 robomp（`python/robomp`）。`omp --license` 会打印 CLI 和原生插件的许可声明。

© 2025 Mario Zechner  
© 2025-2026 Can Bölük  
© 2026 [Stencil Labs, Inc.](https://stencil.so)

## License

上游 omp 采用 [MIT 协议](https://github.com/can1357/oh-my-pi/blob/main/LICENSE)；本仓库新增的翻译文件同样以 MIT 释出。
