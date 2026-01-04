import { Node, Edge } from 'reactflow';
import { FlowNode } from './types';

// 将 FlowNode 转换为 React Flow 的 nodes 和 edges
export const convertToReactFlow = (flowNodes: FlowNode[]) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // 计算每层的节点数量，用于布局
  const layerCounts: { [key: number]: number } = {};
  const layerIndices: { [key: number]: number } = {};

  flowNodes.forEach(node => {
    layerCounts[node.layer] = (layerCounts[node.layer] || 0) + 1;
    layerIndices[node.layer] = 0;
  });

  // 创建 nodes - 更自然的布局
  flowNodes.forEach((flowNode) => {
    const layer = flowNode.layer;
    const index = layerIndices[layer];
    const totalInLayer = layerCounts[layer];

    // 基础位置
    const baseX = (index - totalInLayer / 2) * 300 + 500;
    const baseY = layer * 200 + 100;

    // 添加有机偏移（像真实水系，不是笔直的）
    const randomSeed = flowNode.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const xOffset = (Math.sin(randomSeed) * 40); // ±40px 横向偏移
    const yOffset = (Math.cos(randomSeed) * 20); // ±20px 纵向偏移

    // 源头居中，不偏移
    const x = layer === 0 ? baseX : baseX + xOffset;
    const y = layer === 0 ? baseY : baseY + yOffset;

    nodes.push({
      id: flowNode.id,
      type: 'flowNode',
      position: { x, y },
      data: {
        flowNode,
        isExpanded: false,
      },
    });

    layerIndices[layer]++;
  });

  // 创建 edges (downstream connections)
  flowNodes.forEach((flowNode) => {
    flowNode.connections.downstream.forEach((targetId) => {
      // 动态stroke宽度 - 像河流宽窄
      const strokeWidth = flowNode.metadata.vitality === 'high' ? 4 :
                         flowNode.metadata.vitality === 'medium' ? 2.5 : 1.5;
      const opacity = flowNode.metadata.vitality === 'high' ? 1 :
                     flowNode.metadata.vitality === 'medium' ? 0.75 : 0.5;

      edges.push({
        id: `${flowNode.id}-${targetId}`,
        source: flowNode.id,
        target: targetId,
        type: 'flowEdge',
        data: {
          animated: true,
          vitality: flowNode.metadata.vitality,
        },
        style: {
          stroke: getEdgeColor(flowNode.metadata.vitality),
          strokeWidth,
          opacity,
        },
      });
    });

    // 添加 crossflow connections（用不同样式）
    flowNode.connections.crossflow.forEach((targetId) => {
      edges.push({
        id: `${flowNode.id}-cross-${targetId}`,
        source: flowNode.id,
        target: targetId,
        type: 'flowEdge',
        data: {
          animated: false,
          vitality: 'low',
        },
        style: {
          stroke: '#d0d0d0',
          strokeWidth: 1,
          strokeDasharray: '5,5',
          opacity: 0.3,
        },
      });
    });
  });

  return { nodes, edges };
};

// 根据活力值获取边的颜色
const getEdgeColor = (vitality: 'high' | 'medium' | 'low'): string => {
  switch (vitality) {
    case 'high':
      return '#4a90e2';
    case 'medium':
      return '#6ba3d8';
    case 'low':
      return '#a0c4e8';
    default:
      return '#d0d0d0';
  }
};

// 获取节点大小（基于层级和活力）
export const getNodeSize = (layer: number, vitality: 'high' | 'medium' | 'low'): number => {
  const baseSizes: { [key: number]: number } = {
    0: 140,  // 源头 - 大水池
    1: 100,  // 主流 - 中水池
    2: 70,   // 支流 - 小水池
    3: 50,   // 细流 - 水滴
  };

  const vitalityMultiplier = {
    high: 1.15,
    medium: 1,
    low: 0.85,
  }[vitality];

  return (baseSizes[layer] || 50) * vitalityMultiplier;
};

// 获取节点的样式（水墨晕染效果）
export const getNodeStyle = (flowNode: FlowNode) => {
  const size = getNodeSize(flowNode.layer, flowNode.metadata.vitality);

  // 基础样式 - 水墨画风格
  const baseStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    padding: '0',
    position: 'relative' as const,
    // 水墨晕染效果 - 更强的模糊和纹理
    filter: 'blur(1.2px) contrast(0.95)',
    backdropFilter: 'blur(2px)',
  };

  // 根据类型调整
  switch (flowNode.type) {
    case 'source':
      return {
        ...baseStyle,
        background: `
          radial-gradient(ellipse at 35% 30%,
            rgba(245, 250, 255, 1) 0%,
            rgba(235, 242, 250, 0.98) 25%,
            rgba(220, 235, 248, 0.85) 45%,
            rgba(200, 225, 245, 0.6) 65%,
            rgba(160, 200, 235, 0.35) 80%,
            rgba(120, 170, 220, 0.15) 92%,
            rgba(74, 144, 226, 0.05) 100%
          ),
          radial-gradient(ellipse at 70% 65%,
            transparent 0%,
            rgba(74, 144, 226, 0.08) 50%,
            transparent 100%
          )
        `,
        fontSize: '16px',
        fontWeight: 600,
        boxShadow: `
          0 0 40px rgba(30, 58, 95, 0.3),
          0 0 80px rgba(74, 144, 226, 0.2),
          0 0 120px rgba(74, 144, 226, 0.1),
          inset -10px -10px 40px rgba(74, 144, 226, 0.15),
          inset 10px 10px 40px rgba(255, 255, 255, 0.5)
        `,
      };
    case 'main':
      return {
        ...baseStyle,
        background: `
          radial-gradient(ellipse at 38% 35%,
            rgba(255, 255, 255, 1) 0%,
            rgba(248, 251, 254, 0.96) 35%,
            rgba(235, 243, 250, 0.8) 60%,
            rgba(210, 230, 245, 0.5) 80%,
            rgba(74, 144, 226, 0.12) 95%,
            rgba(74, 144, 226, 0.03) 100%
          ),
          radial-gradient(circle at 65% 70%,
            transparent 0%,
            rgba(107, 163, 216, 0.06) 60%,
            transparent 100%
          )
        `,
        fontSize: '14px',
        fontWeight: 500,
        boxShadow: `
          0 0 35px rgba(74, 144, 226, 0.25),
          0 0 70px rgba(74, 144, 226, 0.12),
          inset -8px -8px 30px rgba(74, 144, 226, 0.12),
          inset 8px 8px 30px rgba(255, 255, 255, 0.6)
        `,
      };
    case 'mantra':
    case 'principle':
      return {
        ...baseStyle,
        background: `
          radial-gradient(ellipse at 42% 38%,
            rgba(255, 255, 255, 1) 0%,
            rgba(250, 252, 254, 0.92) 50%,
            rgba(238, 245, 252, 0.7) 75%,
            rgba(210, 230, 245, 0.4) 90%,
            rgba(107, 163, 216, 0.1) 100%
          ),
          radial-gradient(circle at 60% 68%,
            transparent 0%,
            rgba(160, 196, 232, 0.05) 70%,
            transparent 100%
          )
        `,
        fontSize: '13px',
        boxShadow: `
          0 0 28px rgba(107, 163, 216, 0.22),
          0 0 55px rgba(107, 163, 216, 0.1),
          inset -6px -6px 25px rgba(107, 163, 216, 0.1),
          inset 6px 6px 25px rgba(255, 255, 255, 0.65)
        `,
      };
    default:
      return {
        ...baseStyle,
        background: `
          radial-gradient(ellipse at 45% 40%,
            rgba(255, 255, 255, 1) 0%,
            rgba(252, 253, 254, 0.88) 60%,
            rgba(245, 248, 252, 0.6) 85%,
            rgba(220, 235, 248, 0.3) 95%,
            rgba(160, 196, 232, 0.08) 100%
          ),
          radial-gradient(circle at 58% 72%,
            transparent 0%,
            rgba(160, 196, 232, 0.04) 80%,
            transparent 100%
          )
        `,
        fontSize: '12px',
        boxShadow: `
          0 0 20px rgba(160, 196, 232, 0.18),
          0 0 45px rgba(160, 196, 232, 0.08),
          inset -5px -5px 20px rgba(160, 196, 232, 0.08),
          inset 5px 5px 20px rgba(255, 255, 255, 0.7)
        `,
      };
  }
};

// 获取活力指示器
export const getVitalityIndicator = (vitality: 'high' | 'medium' | 'low'): string => {
  switch (vitality) {
    case 'high':
      return '●●●';
    case 'medium':
      return '●●○';
    case 'low':
      return '●○○';
    default:
      return '○○○';
  }
};
