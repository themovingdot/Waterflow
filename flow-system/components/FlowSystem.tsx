'use client';

import { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  NodeMouseHandler,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import FlowNode from './FlowNode';
import FlowEdge from './FlowEdge';
import { mockNodes, getNodeById } from '@/lib/mockData';
import { convertToReactFlow } from '@/lib/flowUtils';

const nodeTypes = {
  flowNode: FlowNode,
};

const edgeTypes = {
  flowEdge: FlowEdge,
};

export default function FlowSystem() {
  const { nodes: initialNodes, edges: initialEdges } = convertToReactFlow(mockNodes);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [navigationPath, setNavigationPath] = useState<string[]>(['source_01']);

  const { fitView, setCenter } = useReactFlow();

  // 导航到指定节点
  const navigateToNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    // 展开目标节点
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isExpanded: n.id === nodeId,
        },
      }))
    );

    // 居中显示节点
    setCenter(node.position.x, node.position.y, {
      zoom: 1,
      duration: 800,
    });

    // 更新选中状态
    setSelectedNode(nodeId);

    // 更新导航路径
    setNavigationPath(prev => [...prev, nodeId]);
  }, [nodes, setNodes, setCenter]);

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
              onNavigate: navigateToNode,
            },
          };
        }
        return n;
      })
    );
    setSelectedNode(node.id);
  }, [setNodes, navigateToNode]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedNode) return;

      const currentNode = getNodeById(selectedNode);
      if (!currentNode) return;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          if (currentNode.connections.upstream[0]) {
            navigateToNode(currentNode.connections.upstream[0]);
          }
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (currentNode.connections.downstream[0]) {
            navigateToNode(currentNode.connections.downstream[0]);
          }
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          event.preventDefault();
          if (currentNode.connections.crossflow[0]) {
            navigateToNode(currentNode.connections.crossflow[0]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          navigateToNode('source_01');
          break;
        case ' ':
          event.preventDefault();
          setNodes((nds) =>
            nds.map((n) => ({
              ...n,
              data: {
                ...n.data,
                isExpanded: n.id === selectedNode ? !n.data.isExpanded : n.data.isExpanded,
              },
            }))
          );
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, navigateToNode, setNodes]);

  // 初始化节点数据（添加 onNavigate 回调）
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          onNavigate: navigateToNode,
        },
      }))
    );
  }, [navigateToNode, setNodes]);

  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
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

      {/* 标题和面包屑导航 */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md border border-flow-accent">
        <h1 className="text-xl font-bold text-flow-primary mb-2">流水系统</h1>
        {selectedNode && (
          <div className="text-xs text-flow-text">
            <span className="opacity-50">当前: </span>
            <span className="font-semibold">
              {getNodeById(selectedNode)?.content.primary}
            </span>
            <span className="opacity-50 ml-2">
              (Layer {getNodeById(selectedNode)?.layer})
            </span>
          </div>
        )}
      </div>

      {/* 键盘快捷键帮助 */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md border border-flow-accent text-xs text-flow-text">
        <div className="font-semibold mb-2">快捷键</div>
        <div className="space-y-1 opacity-70">
          <div>↑ 上游溯源</div>
          <div>↓ 下游深入</div>
          <div>← → 横流切换</div>
          <div>Space 展开/收起</div>
          <div>Esc 回到源头</div>
        </div>
      </div>

      {/* 导航路径（面包屑）*/}
      {navigationPath.length > 1 && (
        <div className="absolute top-20 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md border border-flow-accent max-w-md">
          <div className="text-xs text-flow-text">
            <span className="opacity-50">路径: </span>
            {navigationPath.slice(-5).map((nodeId, idx, arr) => (
              <span key={nodeId}>
                <button
                  onClick={() => navigateToNode(nodeId)}
                  className="text-flow-secondary hover:underline"
                >
                  {getNodeById(nodeId)?.content.primary}
                </button>
                {idx < arr.length - 1 && <span className="mx-1 opacity-30">→</span>}
              </span>
            ))}
            {navigationPath.length > 5 && (
              <span className="opacity-50 ml-1">(+{navigationPath.length - 5})</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
