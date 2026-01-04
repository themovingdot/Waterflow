'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { FlowNode as FlowNodeType } from '@/lib/types';
import { getNodeStyle, getVitalityIndicator } from '@/lib/flowUtils';

interface FlowNodeProps {
  data: {
    flowNode: FlowNodeType;
    isExpanded: boolean;
  };
}

const FlowNode = memo(({ data }: FlowNodeProps) => {
  const { flowNode, isExpanded } = data;
  const style = getNodeStyle(flowNode);

  return (
    <div style={style} className="flow-node">
      {/* 上游连接点 */}
      {flowNode.connections.upstream.length > 0 && (
        <Handle type="target" position={Position.Top} />
      )}

      {/* 节点内容 */}
      <div className="flow-node-content">
        {/* 主要文字 */}
        <div className="font-semibold text-flow-primary">
          {flowNode.content.primary}
        </div>

        {/* 次要文字（如果存在） */}
        {flowNode.content.secondary && (
          <div className="text-xs text-flow-text opacity-70 mt-1">
            {flowNode.content.secondary}
          </div>
        )}

        {/* 活力指示器 */}
        <div className="text-xs text-flow-accent mt-2">
          {getVitalityIndicator(flowNode.metadata.vitality)}
        </div>

        {/* 展开状态下显示更多内容 */}
        {isExpanded && flowNode.content.elaboration && (
          <div className="text-xs text-flow-text mt-3 pt-3 border-t border-gray-200 text-left whitespace-pre-wrap">
            {flowNode.content.elaboration}
          </div>
        )}

        {/* 具体化内容 */}
        {isExpanded && flowNode.content.concrete && (
          <div className="text-xs text-flow-secondary mt-2 italic">
            {flowNode.content.concrete}
          </div>
        )}
      </div>

      {/* 下游连接点 */}
      {flowNode.connections.downstream.length > 0 && (
        <Handle type="source" position={Position.Bottom} />
      )}
    </div>
  );
});

FlowNode.displayName = 'FlowNode';

export default FlowNode;
