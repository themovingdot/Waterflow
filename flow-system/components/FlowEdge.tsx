'use client';

import { FC } from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
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
  const strokeColor = (style.stroke as string) || '#4a90e2';

  // 根据活力值确定粒子数量和水流强度
  const particleCount = vitality === 'high' ? 4 : vitality === 'medium' ? 3 : 2;
  const strokeWidth = vitality === 'high' ? 3 : vitality === 'medium' ? 2 : 1.5;

  return (
    <g>
      {/* SVG滤镜定义 - 水流模糊和波纹效果 */}
      <defs>
        <filter id={`water-flow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02"
            numOctaves="3"
            result="turbulence"
          >
            <animate
              attributeName="baseFrequency"
              dur="8s"
              values="0.02;0.025;0.02"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
      </defs>

      {/* 底层水流 - 最淡的扩散 */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 3}
        strokeOpacity={0.08}
        filter={`url(#water-flow-${id})`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* 中层水流 - 中等扩散 */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 1.8}
        strokeOpacity={0.15}
        filter="blur(1.5px)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.1 }}
      />

      {/* 主水流路径 - 带动画虚线 */}
      {isAnimated && (
        <motion.path
          d={edgePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeOpacity={0.4}
          strokeDasharray="8 4"
          filter="blur(0.8px)"
          initial={{ pathLength: 0, strokeDashoffset: 0 }}
          animate={{
            pathLength: 1,
            strokeDashoffset: [0, -12],
          }}
          transition={{
            pathLength: { duration: 1.5, ease: 'easeInOut' },
            strokeDashoffset: { duration: 2, repeat: Infinity, ease: 'linear' },
          }}
        />
      )}

      {/* 核心水流 - 最清晰的路径 */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.8}
        strokeOpacity={0.6}
        filter="blur(0.4px)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.2 }}
      />

      {/* 流动的水滴粒子 - 更大更模糊 */}
      {isAnimated && (
        <>
          {[...Array(particleCount)].map((_, i) => (
            <g key={`${id}-particle-${i}`}>
              {/* 外圈光晕 */}
              <motion.circle
                r="8"
                fill={strokeColor}
                opacity={0}
                filter="blur(3px)"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.15, 0.15, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: 'easeInOut',
                }}
              >
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${i * 0.8}s`}
                  path={edgePath}
                />
              </motion.circle>

              {/* 中圈水滴 */}
              <motion.circle
                r="4"
                fill={strokeColor}
                opacity={0}
                filter="blur(1.5px)"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.35, 0.35, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: 'easeInOut',
                }}
              >
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${i * 0.8}s`}
                  path={edgePath}
                />
              </motion.circle>

              {/* 核心亮点 */}
              <motion.circle
                r="2"
                fill="rgba(255, 255, 255, 0.9)"
                opacity={0}
                filter="blur(0.5px)"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.8, 0.8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: 'easeInOut',
                }}
              >
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${i * 0.8}s`}
                  path={edgePath}
                />
              </motion.circle>
            </g>
          ))}
        </>
      )}

      {/* 隐藏的路径用于标记 */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke="transparent"
        markerEnd={markerEnd}
      />
    </g>
  );
};

export default FlowEdge;
