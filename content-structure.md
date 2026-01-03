# 流水系统 - 内容结构

## 整理原则

```
深度优于广度
简洁优于详尽
能用的优于完美的
一句话能说清的不用两句
```

---

## Layer 0: 源头

```yaml
node_id: source_01
type: source
content:
  primary: "本性清明"
  alt: "刚刚好"
  elaboration: |
    从一开始，我就刚刚好。
    完整不是 achievement，是 recognition。

  core_insight: |
    [ 等待填充：源头的核心洞见 ]
    - 为什么是"清明"？
    - 为什么是"刚刚好"？
    - 这个认知如何改变一切？

connections:
  downstream: [main_theory, main_principle, main_scene]
```

**需要回答的问题：**
1. 源头用"本性清明"还是"刚刚好"？还是两者都保留？
2. 一句话总结源头的本质是什么？
3. 这是你想要每次最终回溯到的终点吗？

---

## Layer 1: 主流（3-5个）

### 选项A: 按认知类型分

```
主流1: 理论探索（understanding）
主流2: 核心原则（principles）
主流3: 生活场景（application）
```

### 选项B: 按五大咒语分

```
主流1: 不认同
主流2: 保持距离
主流3: 慈悲地回应
主流4: 清明地体验
主流5: 感恩地接收
```

### 选项C: 混合

```
主流1: 核心洞见（5大咒语 + 3大原则）
主流2: 理论深化（关于desire, limitation, consciousness）
主流3: 生活实践（parenting, parents, daily）
```

**你的选择：** [ 待定 ]

**理由：** [ 待填 ]

---

## Layer 2: 支流（10-15个）

### 如果选择 A/C，支流结构如下：

#### 支流组1: 核心洞见的展开

```yaml
支流: 五大咒语
├─ 不认同
├─ 保持距离
├─ 慈悲地回应
├─ 清明地体验
└─ 感恩地接收

支流: 三大原则
├─ 清明
├─ 慈悲
└─ 自由
```

#### 支流组2: 理论深化

```yaml
支流: 关于 desire
├─ [ 核心论述 ]
└─ [ 常见误区 ]

支流: 关于 limitation
├─ [ 核心论述 ]
└─ [ 常见误区 ]

支流: 关于 consciousness/awareness
├─ [ 核心论述 ]
└─ [ 常见误区 ]

支流: 关于 paradox
├─ [ 列举核心悖论 ]
└─ [ 如何与悖论共处 ]
```

#### 支流组3: 生活场景

```yaml
支流: parenting
├─ 威威焦虑时
├─ 教育 moment
├─ 日常冲突
└─ [ 更多场景 ]

支流: 与父母
├─ 母亲的期待
├─ 父亲的沉默
├─ 家族模式
└─ [ 更多场景 ]

支流: daily moments
├─ 工作压力
├─ 社交场景
├─ 独处时刻
└─ [ 更多场景 ]
```

---

## 内容填充模板

### 对于"咒语"类节点

```yaml
node_id: mantra_non_identification
layer: 2
type: mantra

content:
  # 核心文字（3-5个字）
  primary: "不认同"

  # 简要阐释（一句话）
  secondary: "观察它，但不成为它"

  # 具体化（可操作的理解）
  concrete: "我是容器，不是内容"

  # 为什么重要（连接到源头）
  why: |
    因为当我认同情绪/想法/角色时，
    我就忘记了本性清明。
    不认同，是回到"我本来就刚刚好"的路径。

  # 如何实践（连接到下游）
  how: |
    1. 命名：这是焦虑（不是"我焦虑"）
    2. 定位：在胸口（观察身体）
    3. 距离：看着它（不推不拉）

  # 常见误区
  pitfalls:
    - "不认同 ≠ 压抑"
    - "不认同 ≠ 不care"
    - "容器本身也不是'我'"

connections:
  upstream: [source_01]
  downstream: [scene_parenting_anxiety, theory_desire_identity]
  crossflow: [mantra_distance, principle_clarity]
```

### 对于"场景"类节点

```yaml
node_id: scene_parenting_anxiety
layer: 3
type: scene

content:
  # 场景描述
  situation: "威威说'我做不到'，开始焦虑"

  # 我的自动反应
  auto_reaction: |
    - 胸口收紧
    - 想要立即 fix
    - 说教："你可以的，试试看"
    - 内在："我是不是没教好？"

  # 应用哪些原则
  apply_principles:
    - 不认同："这紧张是 body 的反应，不是我"
    - 保持距离："看到想 fix 的冲动，但不立即行动"
    - 慈悲回应："他需要的是陪伴，不是解决方案"

  # 具体实践
  practice: |
    1. 深呼吸（感受胸口的紧）
    2. 命名：这是焦虑，这是想 control 的冲动
    3. 停顿：不立即说话
    4. 问：他需要什么？（不是我需要他怎样）
    5. 回应：可能就是坐在旁边，或者说"嗯，这个确实难"

  # 实际案例
  examples:
    - date: 2025-01-02
      what_happened: "钢琴，威威崩溃"
      what_i_did: "坐在旁边5分钟，什么都没说"
      outcome: "他自己平静下来，later 说'我再试试'"

    - date: 2024-12-15
      what_happened: "数学作业，威威发脾气"
      what_i_did: "还是忍不住说教"
      outcome: "更糟。reminder: 说教 = 我在认同'我需要他成功'"

connections:
  upstream: [mantra_non_identification, mantra_compassion]
  downstream: [moment_20250102_piano, moment_20241215_math]
  crossflow: [scene_parents_expectation, scene_work_urgency]
```

### 对于"理论"类节点

```yaml
node_id: theory_desire_nature
layer: 2
type: theory

content:
  # 核心论述
  thesis: "Desire 不是问题，认同 desire 才是"

  # 展开
  elaboration: |
    Desire 是 energy，是生命的流动。
    问题不在于"我想要X"，
    而在于"我一定要X才能刚刚好"。

    前者是 flow，后者是 clinging。

  # 常见误解
  misconceptions:
    - "放下 desire = 变得无欲无求？"
      answer: "不是放下 desire，是放下'我必须满足它'的认同"

    - "那我还要不要努力？"
      answer: "努力来自 desire，但不需要来自'我不够好'"

  # 实际应用
  applications:
    - "想要威威成功 → OK"
    - "我必须让威威成功才证明我是好父亲 → 认同了"
    - "威威成功很好，不成功我也刚刚好 → 自由"

  # 更深层次
  deeper_layers:
    - "Desire 的 desire：我为什么想要这个 desire？"
    - "观察 desire 升起和消失"
    - "Desire 本身也是内容，不是我"

connections:
  upstream: [source_01, mantra_non_identification]
  downstream: [scene_parenting_ambition, scene_parents_approval]
  crossflow: [theory_limitation, theory_consciousness]
```

---

## 下一步：内容填充检查清单

### 第一优先级：建立骨架

- [ ] 确定 Layer 1 的结构（选A/B/C）
- [ ] 列出所有 Layer 2 的支流名称
- [ ] 确定五大咒语的完整内容
- [ ] 确定三大原则的完整内容

### 第二优先级：核心节点

- [ ] 填充源头节点的完整内容
- [ ] 填充5大咒语节点（每个）
- [ ] 填充3大原则节点（每个）
- [ ] 至少3个场景节点（parenting为主）

### 第三优先级：深度连接

- [ ] 定义所有 upstream 连接
- [ ] 定义主要 downstream 连接
- [ ] 定义关键 crossflow 连接
- [ ] 确保每个节点至少有1个上游连接

### 第四优先级：实例充实

- [ ] 每个场景至少2个真实案例
- [ ] 每个理论至少1个应用场景
- [ ] 标记高频访问的节点（vitality初始值）

---

## 语言风格指南

### 基调

```
✓ 简洁但不冷漠
✓ 直接但不生硬
✓ 深刻但不玄虚
✓ 实用但不庸俗

✗ 避免心灵鸡汤语气
✗ 避免学术论文语气
✗ 避免说教语气
```

### 句式

```
✓ 短句为主
✓ 必要时用"："展开
✓ 用"→"表示推导
✓ 用"≠"表示区分

示例：
"不认同情绪。
 不是压抑它，是看着它。
 我是容器，不是内容。
 容器本身也不是'我'。"
```

### 关键词

```
保持中文为主，适度使用英文：
✓ desire (欲望总觉得不够准确)
✓ moment (时刻、当下的那个点)
✓ pattern (模式、套路)
✓ awareness (觉察、意识)

完全用中文：
✓ 认同、距离、慈悲、清明
✓ 刚刚好、本性、容器
```

---

## 现在开始

**请回答：**

1. **Layer 1 主流结构** - 你选 A/B/C，还是有新的想法？

2. **五大咒语** - 完整列出（我看到：不认同、保持距离、慈悲地回应、清明地体验、感恩地接收）

3. **三大原则** - 完整列出（清明、慈悲、自由）

4. **优先场景** - parenting 中最想先做的3个具体场景是什么？

5. **源头文字** - 你最想要的源头表述是什么？

回答这5个问题，我们就可以开始填充完整的内容结构了。
