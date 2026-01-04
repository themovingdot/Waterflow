'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { FlowNode as FlowNodeType } from '@/lib/types';
import { getNodeStyle, getVitalityIndicator } from '@/lib/flowUtils';

interface FlowNodeProps {
  data: {
    flowNode: FlowNodeType;
    isExpanded: boolean;
    onNavigate?: (targetId: string) => void;
  };
  selected?: boolean;
}

const FlowNode = memo(({ data, selected }: FlowNodeProps) => {
  const { flowNode, isExpanded, onNavigate } = data;
  const style = getNodeStyle(flowNode);

  const hasUpstream = flowNode.connections.upstream.length > 0;
  const hasDownstream = flowNode.connections.downstream.length > 0;
  const hasCrossflow = flowNode.connections.crossflow.length > 0;

  // 呼吸动画配置（基于层级）
  const breathingDuration = 3 + flowNode.layer * 0.5;

  return (
    <div className="relative">
      {/* Hover涟漪效果 */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-flow-secondary"
        initial={{ scale: 1, opacity: 0 }}
        whileHover={{
          scale: 1.5,
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
        }}
        style={{ pointerEvents: 'none' }}
      />

      {/* 节点本体 */}
      <motion.div
        style={style}
        className={`flow-node relative overflow-visible ${selected ? 'ring-2 ring-flow-secondary' : ''}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          boxShadow: [
            style.boxShadow,
            style.boxShadow?.replace(/0\.\d+/, (m) => String(parseFloat(m) * 1.5)),
            style.boxShadow,
          ],
        }}
        transition={{
          scale: { duration: 0.3 },
          opacity: { duration: 0.3 },
          boxShadow: {
            duration: breathingDuration,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
        whileHover={{
          scale: 1.08,
          transition: { duration: 0.2 },
        }}
      >
      {/* 上游连接点 */}
      {hasUpstream && (
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
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {flowNode.content.elaboration && (
                <div className="text-xs text-flow-text mt-3 pt-3 border-t border-gray-200 text-left whitespace-pre-wrap">
                  {flowNode.content.elaboration}
                </div>
              )}

              {flowNode.content.concrete && (
                <div className="text-xs text-flow-secondary mt-2 italic">
                  {flowNode.content.concrete}
                </div>
              )}

              {/* 导航按钮 */}
              {onNavigate && (
                <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
                  {hasUpstream && (
                    <div className="text-xs">
                      <span className="text-flow-text opacity-50">↑ 上游: </span>
                      {flowNode.connections.upstream.map((id, idx) => (
                        <button
                          key={id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate(id);
                          }}
                          className="text-flow-secondary hover:underline mx-1"
                        >
                          溯源{idx > 0 ? ` ${idx + 1}` : ''}
                        </button>
                      ))}
                    </div>
                  )}

                  {hasDownstream && (
                    <div className="text-xs">
                      <span className="text-flow-text opacity-50">↓ 下游: </span>
                      {flowNode.connections.downstream.slice(0, 3).map((id, idx) => (
                        <button
                          key={id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate(id);
                          }}
                          className="text-flow-secondary hover:underline mx-1"
                        >
                          深入{idx > 0 ? ` ${idx + 1}` : ''}
                        </button>
                      ))}
                      {flowNode.connections.downstream.length > 3 && (
                        <span className="text-flow-text opacity-50">
                          +{flowNode.connections.downstream.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {hasCrossflow && (
                    <div className="text-xs">
                      <span className="text-flow-text opacity-50">⟷ 横流: </span>
                      {flowNode.connections.crossflow.slice(0, 2).map((id, idx) => (
                        <button
                          key={id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate(id);
                          }}
                          className="text-flow-accent hover:underline mx-1"
                        >
                          相关{idx > 0 ? ` ${idx + 1}` : ''}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

        {/* 下游连接点 */}
        {hasDownstream && (
          <Handle type="source" position={Position.Bottom} />
        )}
      </motion.div>
    </div>
  );
});

FlowNode.displayName = 'FlowNode';

export default FlowNode;
