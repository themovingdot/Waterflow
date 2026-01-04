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

  // 创建 nodes
  flowNodes.forEach((flowNode) => {
    const layer = flowNode.layer;
    const index = layerIndices[layer];
    const totalInLayer = layerCounts[layer];

    // 垂直布局：layer 决定 y，index 决定 x
    const x = (index - totalInLayer / 2) * 300 + 500;
    const y = layer * 200 + 100;

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
          strokeWidth: 2,
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

// 获取节点的样式（基于类型和活力）
export const getNodeStyle = (flowNode: FlowNode) => {
  const baseStyle = {
    padding: '12px 20px',
    borderRadius: '8px',
    border: '2px solid',
    background: '#ffffff',
    minWidth: '150px',
    textAlign: 'center' as const,
  };

  // 根据类型调整样式
  switch (flowNode.type) {
    case 'source':
      return {
        ...baseStyle,
        borderColor: '#1e3a5f',
        background: '#f0f4f8',
        fontSize: '18px',
        fontWeight: 600,
        minWidth: '200px',
      };
    case 'main':
      return {
        ...baseStyle,
        borderColor: '#4a90e2',
        fontSize: '16px',
        fontWeight: 500,
      };
    case 'mantra':
    case 'principle':
      return {
        ...baseStyle,
        borderColor: '#6ba3d8',
        fontSize: '14px',
      };
    default:
      return {
        ...baseStyle,
        borderColor: '#a0c4e8',
        fontSize: '13px',
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
