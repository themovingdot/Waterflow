'use client';

import { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';

import FlowNode from './FlowNode';
import { mockNodes } from '@/lib/mockData';
import { convertToReactFlow } from '@/lib/flowUtils';

const nodeTypes = {
  flowNode: FlowNode,
};

export default function FlowSystem() {
  const { nodes: initialNodes, edges: initialEdges } = convertToReactFlow(mockNodes);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // 节点点击处理 - 展开/收起
  const onNodeClick: NodeMouseHandler = useCallback((event, node: Node) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          return {
            ...n,
            data: {
              ...n.data,
              isExpanded: !n.data.isExpanded,
            },
          };
        }
        return n;
      })
    );
    setSelectedNode(node.id);
  }, [setNodes]);

  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background color="#e5e3dc" gap={20} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const flowNode = node.data.flowNode;
            switch (flowNode?.type) {
              case 'source':
                return '#1e3a5f';
              case 'main':
                return '#4a90e2';
              case 'mantra':
              case 'principle':
                return '#6ba3d8';
              default:
                return '#a0c4e8';
            }
          }}
          maskColor="rgba(248, 246, 241, 0.8)"
        />
      </ReactFlow>

      {/* 信息面板 */}
      {selectedNode && (
        <div className="absolute top-4 right-4 bg-white p-6 rounded-lg shadow-lg max-w-md border-2 border-flow-primary">
          <h3 className="text-lg font-semibold text-flow-primary mb-2">
            当前节点
          </h3>
          <p className="text-sm text-flow-text">
            {nodes.find(n => n.id === selectedNode)?.data.flowNode.content.primary}
          </p>
          <button
            onClick={() => setSelectedNode(null)}
            className="mt-4 px-4 py-2 bg-flow-secondary text-white rounded hover:bg-flow-primary transition-colors"
          >
            关闭
          </button>
        </div>
      )}
    </div>
  );
}
