# 流水系统 (Flow System)

> 意识的灌溉系统 - Irrigation of Consciousness

## 简介

这是一个基于都江堰哲学的意识流动可视化系统，用于组织和导航个人的智慧与洞见。

## 核心概念

- **源头**：本性清明，刚刚好
- **主流**：核心原则、理论探索、生活场景
- **支流**：具体的咒语、理论、场景应用
- **细流**：日常moment级的实践

## 特性

### 已实现 ✓

- [x] 14个mock节点的完整数据结构
- [x] React Flow 可视化图谱
- [x] 自动布局（按层级）
- [x] 点击节点展开/收起详情
- [x] 节点活力指示器（●●●/●●○/●○○）
- [x] 边的动画效果（高活力节点）
- [x] 工程图纸美学风格
- [x] MiniMap导航
- [x] Zoom & Pan 控制

### 待实现

- [ ] 流动粒子动画
- [ ] 键盘快捷键导航
- [ ] 面包屑路径显示
- [ ] 节点间的智能推荐
- [ ] 搜索功能
- [ ] 活力值的自动更新
- [ ] 实时编辑内容
- [ ] 数据持久化

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 在浏览器中打开
# http://localhost:3000
```

## 技术栈

- **框架**: Next.js 16 + React 19
- **可视化**: React Flow 11
- **样式**: Tailwind CSS 4
- **动画**: Framer Motion 12
- **语言**: TypeScript

## 项目结构

```
flow-system/
├── app/                  # Next.js App Router
│   ├── globals.css      # 全局样式
│   ├── layout.tsx       # 根布局
│   └── page.tsx         # 首页
├── components/          # React 组件
│   ├── FlowNode.tsx     # 自定义节点组件
│   └── FlowSystem.tsx   # 主可视化组件
├── lib/                 # 工具库
│   ├── types.ts         # TypeScript 类型定义
│   ├── mockData.ts      # Mock 数据
│   └── flowUtils.ts     # Flow 工具函数
└── public/              # 静态资源
```

## 数据结构

每个节点包含：

```typescript
{
  id: string           // 唯一标识
  layer: 0-4          // 层级（0=源头, 1=主流, ...）
  type: NodeType      // 节点类型
  content: {
    primary: string     // 主要文字
    secondary?: string  // 简要阐释
    elaboration?: string // 详细说明
    concrete?: string   // 具体化
  }
  connections: {
    upstream: string[]   // 上游节点
    downstream: string[] // 下游节点
    crossflow: string[]  // 横流节点
  }
  metadata: {
    visits: number      // 访问次数
    lastVisit: string   // 最后访问
    vitality: string    // 活力值
  }
}
```

## 视觉设计

### 颜色方案

- **背景**: `#f8f6f1` (米白)
- **主色**: `#1e3a5f` (深蓝)
- **次色**: `#4a90e2` (亮蓝)
- **强调**: `#6ba3d8` (淡蓝)
- **文字**: `#2c3e50` (深灰)

### 节点样式

- **源头**: 大字体, 深蓝边框, 浅蓝背景
- **主流**: 中字体, 蓝色边框
- **支流**: 标准字体, 淡蓝边框
- **细流**: 小字体, 浅蓝边框

### 边样式

- **下游连接**: 蓝色实线, 高活力时动画
- **横流连接**: 灰色虚线

## 交互说明

- **点击节点**: 展开/收起详细内容
- **拖拽画布**: 平移视图
- **滚轮**: 缩放
- **MiniMap**: 快速导航

## 哲学基础

这个系统受都江堰水利工程启发：

- **分流**: 不同场景需要不同智慧
- **无坝**: 不阻挡，顺应自然
- **自然势**: 让意识自己流向需要的地方

不是在"管理知识"，而是在"疏导意识"。

---

**开发者**: Claude
**灵感来源**: 都江堰 + Dukkha的哲学思考
**许可**: MIT
