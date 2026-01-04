// 节点类型定义
export type NodeLayer = 0 | 1 | 2 | 3 | 4;

export type NodeType = 'source' | 'main' | 'mantra' | 'principle' | 'theory' | 'scene' | 'moment';

export interface FlowNode {
  id: string;
  layer: NodeLayer;
  type: NodeType;
  content: {
    primary: string;           // 主要文字（3-5个字）
    secondary?: string;        // 简要阐释（一句话）
    elaboration?: string;      // 详细说明
    concrete?: string;         // 具体化、可操作的理解
  };
  connections: {
    upstream: string[];        // 上游节点（父节点）
    downstream: string[];      // 下游节点（子节点）
    crossflow: string[];       // 横流节点（相关节点）
  };
  metadata: {
    visits: number;            // 访问次数
    lastVisit: string | null;  // 最后访问时间
    vitality: 'high' | 'medium' | 'low';  // 活力值
  };
}

// 用于 React Flow 的节点类型
export interface ReactFlowNodeData {
  flowNode: FlowNode;
  isExpanded: boolean;
}
