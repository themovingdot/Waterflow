import { FlowNode } from './types';

// Mock 数据：流水系统的节点
export const mockNodes: FlowNode[] = [
  // Layer 0: 源头
  {
    id: 'source_01',
    layer: 0,
    type: 'source',
    content: {
      primary: '本性清明',
      secondary: '刚刚好',
      elaboration: '从一开始，我就刚刚好。\n完整不是 achievement，是 recognition。',
    },
    connections: {
      upstream: [],
      downstream: ['main_principle', 'main_theory', 'main_scene'],
      crossflow: [],
    },
    metadata: {
      visits: 156,
      lastVisit: '2025-01-03T10:00:00Z',
      vitality: 'high',
    },
  },

  // Layer 1: 主流（三大分支）
  {
    id: 'main_principle',
    layer: 1,
    type: 'main',
    content: {
      primary: '核心原则',
      secondary: '五大咒语 + 三大原则',
      elaboration: '指导日常的核心智慧',
    },
    connections: {
      upstream: ['source_01'],
      downstream: ['mantra_non_identification', 'mantra_distance', 'mantra_compassion'],
      crossflow: ['main_theory', 'main_scene'],
    },
    metadata: {
      visits: 89,
      lastVisit: '2025-01-02T15:30:00Z',
      vitality: 'high',
    },
  },
  {
    id: 'main_theory',
    layer: 1,
    type: 'main',
    content: {
      primary: '理论探索',
      secondary: '深入理解意识本质',
      elaboration: '关于 desire, limitation, consciousness 的思考',
    },
    connections: {
      upstream: ['source_01'],
      downstream: ['theory_desire', 'theory_limitation'],
      crossflow: ['main_principle', 'main_scene'],
    },
    metadata: {
      visits: 45,
      lastVisit: '2025-01-01T09:00:00Z',
      vitality: 'medium',
    },
  },
  {
    id: 'main_scene',
    layer: 1,
    type: 'main',
    content: {
      primary: '生活场景',
      secondary: '智慧在日常中的应用',
      elaboration: 'Parenting, 与父母, 工作等具体场景',
    },
    connections: {
      upstream: ['source_01'],
      downstream: ['scene_parenting', 'scene_parents'],
      crossflow: ['main_principle', 'main_theory'],
    },
    metadata: {
      visits: 123,
      lastVisit: '2025-01-03T19:45:00Z',
      vitality: 'high',
    },
  },

  // Layer 2: 支流 - 五大咒语
  {
    id: 'mantra_non_identification',
    layer: 2,
    type: 'mantra',
    content: {
      primary: '不认同',
      secondary: '观察它，但不成为它',
      concrete: '我是容器，不是内容',
      elaboration: '当我认同情绪/想法/角色时，我就忘记了本性清明。\n不认同，是回到"我本来就刚刚好"的路径。',
    },
    connections: {
      upstream: ['main_principle'],
      downstream: ['scene_parenting_anxiety'],
      crossflow: ['mantra_distance'],
    },
    metadata: {
      visits: 67,
      lastVisit: '2025-01-03T08:20:00Z',
      vitality: 'high',
    },
  },
  {
    id: 'mantra_distance',
    layer: 2,
    type: 'mantra',
    content: {
      primary: '保持距离',
      secondary: '看到，但不抓取',
      concrete: '一步之遥的观察',
      elaboration: '距离让我看清全貌。\n不是冷漠，是清明。',
    },
    connections: {
      upstream: ['main_principle'],
      downstream: ['scene_parents_expectation'],
      crossflow: ['mantra_non_identification', 'mantra_compassion'],
    },
    metadata: {
      visits: 52,
      lastVisit: '2025-01-02T14:10:00Z',
      vitality: 'medium',
    },
  },
  {
    id: 'mantra_compassion',
    layer: 2,
    type: 'mantra',
    content: {
      primary: '慈悲地回应',
      secondary: '温柔但坚定',
      concrete: '他需要什么，不是我需要他怎样',
      elaboration: '慈悲不是软弱，是力量。\n来自清明的回应，而非反应。',
    },
    connections: {
      upstream: ['main_principle'],
      downstream: ['scene_parenting_anxiety'],
      crossflow: ['mantra_distance'],
    },
    metadata: {
      visits: 78,
      lastVisit: '2025-01-03T17:30:00Z',
      vitality: 'high',
    },
  },

  // Layer 2: 支流 - 理论
  {
    id: 'theory_desire',
    layer: 2,
    type: 'theory',
    content: {
      primary: '关于 Desire',
      secondary: 'Desire 不是问题，认同 desire 才是',
      elaboration: 'Desire 是 energy，是生命的流动。\n问题不在于"我想要X"，而在于"我一定要X才能刚刚好"。',
    },
    connections: {
      upstream: ['main_theory'],
      downstream: ['scene_parenting'],
      crossflow: ['theory_limitation'],
    },
    metadata: {
      visits: 34,
      lastVisit: '2024-12-28T11:00:00Z',
      vitality: 'medium',
    },
  },
  {
    id: 'theory_limitation',
    layer: 2,
    type: 'theory',
    content: {
      primary: '关于 Limitation',
      secondary: 'Limitation 不是缺陷，是边界',
      elaboration: '接纳限制，才有真正的自由。\n不是resignation，是recognition。',
    },
    connections: {
      upstream: ['main_theory'],
      downstream: ['scene_parents'],
      crossflow: ['theory_desire'],
    },
    metadata: {
      visits: 28,
      lastVisit: '2024-12-20T16:30:00Z',
      vitality: 'low',
    },
  },

  // Layer 3: 细流 - 具体场景
  {
    id: 'scene_parenting',
    layer: 3,
    type: 'scene',
    content: {
      primary: 'Parenting',
      secondary: '与威威的相处',
      elaboration: '所有原则的 test ground',
    },
    connections: {
      upstream: ['main_scene', 'theory_desire'],
      downstream: ['scene_parenting_anxiety'],
      crossflow: ['scene_parents'],
    },
    metadata: {
      visits: 95,
      lastVisit: '2025-01-03T20:00:00Z',
      vitality: 'high',
    },
  },
  {
    id: 'scene_parents',
    layer: 3,
    type: 'scene',
    content: {
      primary: '与父母',
      secondary: '特别是母亲的期待',
      elaboration: 'Old patterns 的重现',
    },
    connections: {
      upstream: ['main_scene', 'theory_limitation'],
      downstream: ['scene_parents_expectation'],
      crossflow: ['scene_parenting'],
    },
    metadata: {
      visits: 56,
      lastVisit: '2025-01-01T12:00:00Z',
      vitality: 'medium',
    },
  },
  {
    id: 'scene_parenting_anxiety',
    layer: 3,
    type: 'scene',
    content: {
      primary: '威威焦虑时',
      secondary: '他说"我做不到"',
      elaboration: '触发：钢琴、数学、任何困难任务\n我的自动反应：胸口紧，想要fix',
      concrete: '1. 深呼吸（感受胸口的紧）\n2. 命名：这是焦虑\n3. 停顿：不立即说话\n4. 问：他需要什么？\n5. 回应：陪伴，而非解决',
    },
    connections: {
      upstream: ['scene_parenting', 'mantra_non_identification', 'mantra_compassion'],
      downstream: [],
      crossflow: ['scene_parents_expectation'],
    },
    metadata: {
      visits: 47,
      lastVisit: '2025-01-02T19:34:00Z',
      vitality: 'high',
    },
  },
  {
    id: 'scene_parents_expectation',
    layer: 3,
    type: 'scene',
    content: {
      primary: '母亲的期待',
      secondary: '"你应该..."',
      elaboration: '她的期待 = 她的不安\n我的防御 = 我的认同',
      concrete: '看到期待，不接住。\n看到不安，给予慈悲（但不是顺从）。',
    },
    connections: {
      upstream: ['scene_parents', 'mantra_distance'],
      downstream: [],
      crossflow: ['scene_parenting_anxiety'],
    },
    metadata: {
      visits: 38,
      lastVisit: '2025-01-01T14:20:00Z',
      vitality: 'medium',
    },
  },
];

// 辅助函数：根据 ID 获取节点
export const getNodeById = (id: string): FlowNode | undefined => {
  return mockNodes.find(node => node.id === id);
};

// 辅助函数：获取某个节点的所有下游节点
export const getDownstreamNodes = (nodeId: string): FlowNode[] => {
  const node = getNodeById(nodeId);
  if (!node) return [];

  return node.connections.downstream
    .map(id => getNodeById(id))
    .filter(n => n !== undefined) as FlowNode[];
};

// 辅助函数：获取某个节点的所有上游节点
export const getUpstreamNodes = (nodeId: string): FlowNode[] => {
  const node = getNodeById(nodeId);
  if (!node) return [];

  return node.connections.upstream
    .map(id => getNodeById(id))
    .filter(n => n !== undefined) as FlowNode[];
};
