# 流水系统 - 视觉改造计划

## 🎯 目标：从"知识图谱"到"活的水系"

---

## 改造清单

### 1. 节点形状：从方框到水滴

**当前：**
```css
border-radius: 8px; /* 圆角方框 */
```

**改为：**
```css
/* 水滴形/圆形 */
border-radius: 50%; /* 或者自定义水滴SVG */
box-shadow: 0 4px 12px rgba(74, 144, 226, 0.15); /* 水的倒影 */
```

**视觉效果：**
- 源头：大水池（半径150px）
- 主流：中水池（半径100px）
- 支流：小水池（半径60px）
- 细流：水滴（半径40px）

---

### 2. 节点呼吸动画

**所有节点都在"呼吸"：**
```javascript
animate: {
  scale: [1, 1.03, 1],
  boxShadow: [
    '0 4px 12px rgba(74, 144, 226, 0.15)',
    '0 6px 20px rgba(74, 144, 226, 0.3)',
    '0 4px 12px rgba(74, 144, 226, 0.15)'
  ]
},
transition: {
  duration: 4,
  repeat: Infinity,
  ease: 'easeInOut'
}
```

**效果：** 即使不交互，系统也"活着"

---

### 3. 边的动态宽度

**当前：** 所有边都是2px

**改为：**
```javascript
strokeWidth: vitality === 'high' ? 4 : vitality === 'medium' ? 2.5 : 1.5
opacity: vitality === 'high' ? 1 : vitality === 'medium' ? 0.7 : 0.4
```

**视觉：** 活跃的路径像"大河"，不活跃的像"小溪"

---

### 4. Hover 涟漪效果

**交互：**
```
hover节点 → 涟漪从节点中心扩散 → 相邻节点轻微波动
```

**实现：**
```javascript
// 节点Hover时
<motion.circle
  initial={{ scale: 1, opacity: 0.5 }}
  animate={{ scale: 2, opacity: 0 }}
  transition={{ duration: 1.5 }}
/>
```

---

### 5. 背景：水波纹理

**当前：** 纯色网格背景

**改为：**
```javascript
<defs>
  <pattern id="waterTexture">
    <!-- SVG水波纹理 -->
    <path d="..." stroke="#e5e3dc" opacity="0.3" />
  </pattern>
</defs>
<Background pattern="waterTexture" />
```

**或使用CSS：**
```css
background:
  radial-gradient(circle at 20% 50%, rgba(74,144,226,0.03) 0%, transparent 50%),
  radial-gradient(circle at 80% 50%, rgba(74,144,226,0.02) 0%, transparent 50%),
  #f8f6f1;
```

---

### 6. 流动路径可视化

**新功能：显示"当前主要水流"**

**实现：**
- 基于最近访问历史，高亮一条"主流路径"
- 用粗线 + 高饱和度颜色表示
- 像河流中的"主航道"

```javascript
// 计算主流路径
const mainFlowPath = calculateMainFlow(navigationHistory)
// 渲染时加粗这条路径
style: {
  strokeWidth: isMainFlow ? 6 : 2,
  stroke: isMainFlow ? '#4a90e2' : getEdgeColor(vitality)
}
```

---

## 实施优先级

### P0 - 立即改（最大视觉冲击）
1. ✅ 节点改圆形
2. ✅ 添加呼吸动画
3. ✅ 边的动态宽度

### P1 - 很快改（增强流动感）
4. ✅ Hover涟漪
5. ✅ 主流路径高亮

### P2 - 可以缓（润色）
6. ⏸️ 背景水波纹理
7. ⏸️ 更复杂的水滴形状

---

## 技术实现

### 节点组件改造

```typescript
// FlowNode.tsx
const getNodeSize = (layer: number, vitality: string) => {
  const baseSize = {
    0: 150,  // 源头
    1: 100,  // 主流
    2: 60,   // 支流
    3: 40,   // 细流
  }[layer] || 40;

  const vitalityMultiplier = {
    high: 1.2,
    medium: 1,
    low: 0.8,
  }[vitality];

  return baseSize * vitalityMultiplier;
};

// 圆形节点样式
const nodeStyle = {
  width: size,
  height: size,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  ...
};
```

### 呼吸动画

```typescript
<motion.div
  style={nodeStyle}
  animate={{
    scale: [1, 1.03, 1],
    boxShadow: [
      '0 4px 12px rgba(74, 144, 226, 0.15)',
      '0 6px 20px rgba(74, 144, 226, 0.3)',
      '0 4px 12px rgba(74, 144, 226, 0.15)'
    ]
  }}
  transition={{
    duration: 3 + layer * 0.5, // 不同层级呼吸速度不同
    repeat: Infinity,
    ease: 'easeInOut'
  }}
>
```

---

## 预期效果

**改造前：**
> 静态的知识图谱，像工程图纸

**改造后：**
> 活的水系，像真实的都江堰俯瞰图
> - 能看到水在流动
> - 能感受到哪里水流更旺
> - 整个系统在"呼吸"

---

开始实施？
