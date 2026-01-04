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

// 获取节点的样式（基于类型和活力）
export const getNodeStyle = (flowNode: FlowNode) => {
  const size = getNodeSize(flowNode.layer, flowNode.metadata.vitality);

  const baseStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',  // 圆形！
    border: '2px solid',
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    padding: '0',
    boxShadow: '0 4px 12px rgba(74, 144, 226, 0.15)',
  };

  // 根据类型调整样式
  switch (flowNode.type) {
    case 'source':
      return {
        ...baseStyle,
        borderColor: '#1e3a5f',
        background: 'radial-gradient(circle, #f0f4f8 0%, #e8eff5 100%)',
        fontSize: '16px',
        fontWeight: 600,
        boxShadow: '0 6px 20px rgba(30, 58, 95, 0.2)',
      };
    case 'main':
      return {
        ...baseStyle,
        borderColor: '#4a90e2',
        background: 'radial-gradient(circle, #ffffff 0%, #f5f9fc 100%)',
        fontSize: '14px',
        fontWeight: 500,
        boxShadow: '0 5px 16px rgba(74, 144, 226, 0.18)',
      };
    case 'mantra':
    case 'principle':
      return {
        ...baseStyle,
        borderColor: '#6ba3d8',
        background: 'radial-gradient(circle, #ffffff 0%, #f8fbfd 100%)',
        fontSize: '13px',
        boxShadow: '0 4px 14px rgba(107, 163, 216, 0.15)',
      };
    default:
      return {
        ...baseStyle,
        borderColor: '#a0c4e8',
        background: 'radial-gradient(circle, #ffffff 0%, #fafcfd 100%)',
        fontSize: '12px',
        boxShadow: '0 3px 10px rgba(160, 196, 232, 0.12)',
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
