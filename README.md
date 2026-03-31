# Cesium MCP Demo

一个本地可运行的 Cesium + MCP-style demo，用来演示：

- 预置按钮或自然语言输入
- 进入本地 bridge server
- 解析为结构化命令
- 调用 MCP-style tool
- 让 Cesium 地图产生相应动作
- 同时在右侧执行日志里展示完整链路

## 目录

```text
cesium-mcp-demo/
  frontend/   # Vite + React + Cesium
  server/     # Node.js + Express + command parser + MCP-style tools
  docs/       # 设计文档与实现计划
```

## 环境要求

- Node.js 18+
- npm 9+
- Windows / macOS / Linux 均可，本项目当前已在 Windows 上验证

## 安装依赖

在项目根目录执行：

```bash
npm install
```

## 本地启动

### 方式 1：分别启动（推荐调试）

终端 1：

```bash
npm --workspace server run dev
```

终端 2：

```bash
npm --workspace frontend run dev -- --host 127.0.0.1
```

打开：

```text
http://127.0.0.1:5173/
```

### 方式 2：一起启动

```bash
npm run dev
```

## 构建

```bash
npm run build
```

## 测试

```bash
npm test
```

## 已实现功能

### 预置按钮

- 飞到北京
- 飞到上海
- 飞到广州
- 飞到深圳
- 添加天安门标记
- 绘制北京 → 上海连线
- 切换到底图
- 清空实体

### 自然语言命令

支持示例：

- `飞到北京`
- `飞到 121.473,31.230`
- `添加天安门标记在北京`
- `画一条从北京到上海的线`
- `切换到 osm`
- `清空标记`

## API

### `GET /health`

健康检查。

### `POST /api/command`

发送命令。

#### 预置动作

```json
{ "preset": "flyToBeijing" }
```

#### 文本命令

```json
{ "text": "画一条从北京到上海的线" }
```

### `GET /api/events`

SSE 事件流，用于把执行日志推送到前端。

## 技术说明

- 前端：React + Vite + Cesium
- 后端：Express + TypeScript
- 自然语言：规则式解析，不依赖外部 LLM
- 地图动作：通过 MCP-style tool 结果返回 `sceneAction`，再由前端应用到 Cesium Viewer

## 已知说明

- 当前版本目标是“稳定演示”，不是生产系统
- 底图切换策略目前偏保守，优先保证 demo 稳定可运行
- 中文命令请求建议通过浏览器页面或 Node fetch 发送；PowerShell 某些调用方式在中文 body 上可能出现编码问题
- 前端打包体积较大，这是 Cesium demo 常见现象，当前未做额外 code split 优化

## 文档

- 设计文档：`docs/superpowers/specs/2026-03-31-cesium-mcp-demo-design.md`
- 实现计划：`docs/superpowers/plans/2026-03-31-cesium-mcp-demo.md`

## 下一步可扩展方向

- 更强的自然语言解析
- 更多城市和命令模板
- 更好的底图和图层切换
- GeoJSON / 路线数据导入
- 真正对接外部 MCP client / agent
