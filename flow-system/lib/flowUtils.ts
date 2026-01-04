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

// 获取节点的样式（水滴晕开效果）
export const getNodeStyle = (flowNode: FlowNode) => {
  const size = getNodeSize(flowNode.layer, flowNode.metadata.vitality);

  // 基础样式 - 去掉硬边界
  const baseStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    border: 'none',  // 去掉硬边界！
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    padding: '0',
    position: 'relative' as const,
    // 水滴晕开效果 - 多层阴影模拟墨滴扩散
    filter: 'blur(0.8px)',  // 增加模糊度，更像墨滴晕开
  };

  // 根据类型调整
  switch (flowNode.type) {
    case 'source':
      return {
        ...baseStyle,
        background: `
          radial-gradient(circle at 40% 40%,
            rgba(240, 244, 248, 1) 0%,
            rgba(232, 239, 245, 0.95) 40%,
            rgba(200, 220, 240, 0.6) 70%,
            rgba(160, 196, 232, 0.3) 85%,
            rgba(74, 144, 226, 0.1) 100%
          )
        `,
        fontSize: '16px',
        fontWeight: 600,
        boxShadow: `
          0 0 30px rgba(30, 58, 95, 0.25),
          0 0 60px rgba(74, 144, 226, 0.15),
          inset 0 0 40px rgba(255, 255, 255, 0.4)
        `,
      };
    case 'main':
      return {
        ...baseStyle,
        background: `
          radial-gradient(circle at 40% 40%,
            rgba(255, 255, 255, 1) 0%,
            rgba(245, 249, 252, 0.95) 50%,
            rgba(220, 235, 245, 0.7) 75%,
            rgba(74, 144, 226, 0.2) 95%,
            rgba(74, 144, 226, 0.05) 100%
          )
        `,
        fontSize: '14px',
        fontWeight: 500,
        boxShadow: `
          0 0 25px rgba(74, 144, 226, 0.2),
          0 0 50px rgba(74, 144, 226, 0.1),
          inset 0 0 30px rgba(255, 255, 255, 0.5)
        `,
      };
    case 'mantra':
    case 'principle':
      return {
        ...baseStyle,
        background: `
          radial-gradient(circle at 40% 40%,
            rgba(255, 255, 255, 1) 0%,
            rgba(248, 251, 253, 0.9) 60%,
            rgba(230, 240, 250, 0.6) 85%,
            rgba(107, 163, 216, 0.15) 100%
          )
        `,
        fontSize: '13px',
        boxShadow: `
          0 0 20px rgba(107, 163, 216, 0.18),
          0 0 40px rgba(107, 163, 216, 0.08),
          inset 0 0 25px rgba(255, 255, 255, 0.6)
        `,
      };
    default:
      return {
        ...baseStyle,
        background: `
          radial-gradient(circle at 40% 40%,
            rgba(255, 255, 255, 1) 0%,
            rgba(250, 252, 253, 0.85) 70%,
            rgba(240, 245, 250, 0.5) 90%,
            rgba(160, 196, 232, 0.1) 100%
          )
        `,
        fontSize: '12px',
        boxShadow: `
          0 0 15px rgba(160, 196, 232, 0.15),
          0 0 30px rgba(160, 196, 232, 0.06),
          inset 0 0 20px rgba(255, 255, 255, 0.7)
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
