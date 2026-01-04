'use client';

import { FC } from 'react';
import { EdgeProps, getBezierPath, BaseEdge } from 'reactflow';
import { motion } from 'framer-motion';

const FlowEdge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isAnimated = data?.animated !== false;
  const vitality = data?.vitality || 'medium';

  // 根据活力值确定粒子数量
  const particleCount = vitality === 'high' ? 3 : vitality === 'medium' ? 2 : 1;

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          filter: 'blur(0.5px)',  // 水道模糊效果
        }}
      />

      {/* 流动粒子 */}
      {isAnimated && (
        <>
          {[...Array(particleCount)].map((_, i) => (
            <motion.circle
              key={`${id}-particle-${i}`}
              r="3"
              fill={style.stroke as string || '#4a90e2'}
              filter="blur(1px) drop-shadow(0 0 4px rgba(74, 144, 226, 0.6))"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                offsetDistance: ['0%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.7,
                ease: 'linear',
              }}
              style={{
                offsetPath: `path('${edgePath}')`,
                offsetRotate: '0deg',
              }}
            >
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                begin={`${i * 0.7}s`}
              >
                <mpath href={`#${id}`} />
              </animateMotion>
            </motion.circle>
          ))}
        </>
      )}

      {/* 隐藏路径，用于 animateMotion */}
      <path
        id={id}
        d={edgePath}
        style={{ display: 'none' }}
      />
    </>
  );
};

export default FlowEdge;
