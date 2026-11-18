# dsh-current-time

为 Aurabot 提供实时北京时间查询工具的**用户模块**。
仅支持 Aurabot，不支持作为独立 DSH / Cordis 插件加载；包名和模块 ID 中的 `dsh` 仅为标识。

## 功能

- 注册无参数工具 `get_current_time`，由 AI 按需调用。
- 每次执行都读取宿主系统时钟，固定按北京时间 `Asia/Shanghai` 格式化，精确到秒。
- 输出格式：`YYYY-MM-DD HH:mm:ss 星期X`，星期日写作“星期日”。
- 不请求网络、不进行 NTP 校时；结果准确性取决于宿主系统时钟。

这是工具调用，不是聊天命令：不提供 `/time`、关键词自动回复、定时推送或时区参数。

## 环境要求

- Node.js >= 22.13.0
- Aurabot >= 1.2.1
- 零 npm 依赖，安装时无需运行 `npm install`。

## 安装

1. 下载本仓库源码，将完整插件文件夹命名为 `dsh-current-time`。
2. 把该文件夹放入 Aurabot 数据目录的 `modules/` 下，最终目录为 `modules/dsh-current-time/`。

| 配置 | 最终模块目录 |
| --- | --- |
| 默认 | `~/.dsh/plugins-data/aurabot/modules/dsh-current-time/` |
| 设置 `DSH_HOME` | `<DSH_HOME>/plugins-data/aurabot/modules/dsh-current-time/` |
| 设置 `AURABOT_DATA_DIR` | `<AURABOT_DATA_DIR>/modules/dsh-current-time/` |

`AURABOT_DATA_DIR` 优先于 `DSH_HOME`；`~` 表示用户主目录，Windows 下也应以当前用户主目录为准。

目录应如下，避免解压后多嵌套一层；`index.mjs` 是唯一的 Aurabot 入口，必须直接位于模块根目录：

```text
dsh-current-time/
├── index.mjs
├── lib/
│   └── time.mjs
├── module.json
├── package.json
├── README.md
├── LICENSE
└── test/              # 可选，仅用于本地开发验证
```

保留 `lib/time.mjs`、`module.json` 等完整运行文件，不要只复制入口文件。

3. 在 Aurabot 面板的“已安装”查看真实模块路径，可用“打开文件夹”定位、“重新检查”刷新检测。
4. 安全模式开启时不会加载用户模块；需关闭安全模式，并确保本模块处于启用状态。若之前显式关闭过模块，请先开启。
5. 正常情况下约每 3 秒检查变更并热加载，通常无需重启；必要时使用面板的“重新加载”。

## 使用

向支持工具调用的 AI 提出请求，例如：

> 请调用 get_current_time 获取现在的北京时间

工具不接受参数，调用参数为 `{}`。AI 是否调用由当前模型和宿主的工具策略决定，不保证每次自然语言提问都会自动触发。

返回示例：

```json
{
  "ok": true,
  "message": "2026-11-18 00:47:12 星期三"
}
```

示例仅展示格式；实际返回的是每次工具执行时的北京时间。

## 本地开发

在模块目录运行以下命令可执行已有测试，无需先安装依赖：

```sh
npm test
```

本仓库采用源码安装，不依赖 npm 发布或模块市场收录。

## 许可证

[MIT](./LICENSE)，Copyright (c) 2026 youkucola。
