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
      {/* SVG滤镜定义 - 真实水流波纹效果 */}
      <defs>
        <filter id={`water-flow-${id}`} x="-100%" y="-100%" width="300%" height="300%">
          {/* 第一层湍流 - 主要波纹 */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.025"
            numOctaves="4"
            seed="1"
            result="turbulence1"
          >
            <animate
              attributeName="baseFrequency"
              dur="6s"
              values="0.015 0.025;0.022 0.032;0.015 0.025"
              repeatCount="indefinite"
            />
          </feTurbulence>
          {/* 第二层湍流 - 细节涟漪 */}
          <feTurbulence
            type="turbulence"
            baseFrequency="0.05 0.03"
            numOctaves="2"
            seed="2"
            result="turbulence2"
          >
            <animate
              attributeName="baseFrequency"
              dur="4s"
              values="0.05 0.03;0.06 0.04;0.05 0.03"
              repeatCount="indefinite"
            />
          </feTurbulence>
          {/* 合并两层湍流 */}
          <feBlend in="turbulence1" in2="turbulence2" mode="multiply" result="combined" />
          {/* 位移映射产生波动 */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="combined"
            scale="3.5"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          {/* 模糊产生水的柔和感 */}
          <feGaussianBlur in="displaced" stdDeviation="1.2" result="blurred" />
          {/* 增加亮度变化模拟水面反光 */}
          <feComponentTransfer in="blurred">
            <feFuncA type="linear" slope="1.1" />
          </feComponentTransfer>
        </filter>

        {/* 水滴光晕滤镜 */}
        <filter id={`droplet-glow-${id}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 底层水流 - 最淡的扩散，模拟水渗入纸张 */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 3.5}
        strokeOpacity={0}
        filter={`url(#water-flow-${id})`}
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        animate={{
          pathLength: 1,
          strokeOpacity: [0, 0.1, 0.12, 0.1],
          strokeWidth: [strokeWidth * 3.5, strokeWidth * 4, strokeWidth * 3.5],
        }}
        transition={{
          pathLength: { duration: 1.5, ease: 'easeInOut' },
          strokeOpacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          strokeWidth: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* 中层水流 - 中等扩散，流动的水迹 */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 2}
        strokeOpacity={0}
        filter="blur(1.5px)"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        animate={{
          pathLength: 1,
          strokeOpacity: [0, 0.18, 0.22, 0.18],
          strokeWidth: [strokeWidth * 2, strokeWidth * 2.3, strokeWidth * 2],
        }}
        transition={{
          pathLength: { duration: 1.5, ease: 'easeInOut', delay: 0.1 },
          strokeOpacity: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
          strokeWidth: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
        }}
      />

      {/* 主水流路径 - 带动画虚线，模拟水流波纹 */}
      {isAnimated && (
        <motion.path
          d={edgePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth * 1.2}
          strokeOpacity={0}
          strokeDasharray="10 6"
          strokeLinecap="round"
          filter="blur(0.8px)"
          initial={{ pathLength: 0, strokeDashoffset: 0, strokeOpacity: 0 }}
          animate={{
            pathLength: 1,
            strokeDashoffset: [0, -16],
            strokeOpacity: [0, 0.35, 0.45, 0.35],
          }}
          transition={{
            pathLength: { duration: 1.5, ease: 'easeInOut' },
            strokeDashoffset: { duration: 2.5, repeat: Infinity, ease: 'linear' },
            strokeOpacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      )}

      {/* 核心水流 - 最清晰的路径，水的主体 */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeOpacity={0}
        strokeLinecap="round"
        filter="blur(0.4px)"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        animate={{
          pathLength: 1,
          strokeOpacity: [0, 0.5, 0.65, 0.5],
        }}
        transition={{
          pathLength: { duration: 1.5, ease: 'easeInOut', delay: 0.2 },
          strokeOpacity: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1 },
        }}
      />

      {/* 流动的水滴粒子 - 真实水滴效果 */}
      {isAnimated && (
        <>
          {[...Array(particleCount)].map((_, i) => {
            // 为每个粒子添加自然变化
            const duration = 2.5 + (i * 0.3) + (Math.sin(i) * 0.4); // 2.5-3.5s 不等
            const delay = i * 0.7;
            const sizeVariation = 1 + (Math.cos(i) * 0.2); // 0.8-1.2倍大小变化

            return (
              <g key={`${id}-particle-${i}`}>
                {/* 最外层扩散 - 模拟水滴周围的水汽 */}
                <motion.ellipse
                  rx={10 * sizeVariation}
                  ry={8 * sizeVariation}
                  fill={strokeColor}
                  opacity={0}
                  filter={`url(#droplet-glow-${id})`}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.12, 0.18, 0.12, 0],
                    rx: [10 * sizeVariation, 11 * sizeVariation, 10 * sizeVariation],
                    ry: [8 * sizeVariation, 7 * sizeVariation, 8 * sizeVariation],
                  }}
                  transition={{
                    duration,
                    repeat: Infinity,
                    delay,
                    ease: 'easeInOut',
                  }}
                >
                  <animateMotion
                    dur={`${duration}s`}
                    repeatCount="indefinite"
                    begin={`${delay}s`}
                    path={edgePath}
                  />
                </motion.ellipse>

                {/* 中层水滴本体 */}
                <motion.ellipse
                  rx={5 * sizeVariation}
                  ry={6 * sizeVariation}
                  fill={strokeColor}
                  opacity={0}
                  filter="blur(1.5px)"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.4, 0.5, 0.4, 0],
                    ry: [6 * sizeVariation, 6.5 * sizeVariation, 6 * sizeVariation],
                  }}
                  transition={{
                    duration,
                    repeat: Infinity,
                    delay,
                    ease: 'easeInOut',
                  }}
                >
                  <animateMotion
                    dur={`${duration}s`}
                    repeatCount="indefinite"
                    begin={`${delay}s`}
                    path={edgePath}
                  />
                </motion.ellipse>

                {/* 内层高光 - 模拟水滴中心 */}
                <motion.circle
                  r={2.5 * sizeVariation}
                  fill={strokeColor}
                  opacity={0}
                  filter="blur(0.8px)"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.6, 0.7, 0.6, 0],
                  }}
                  transition={{
                    duration,
                    repeat: Infinity,
                    delay,
                    ease: 'easeInOut',
                  }}
                >
                  <animateMotion
                    dur={`${duration}s`}
                    repeatCount="indefinite"
                    begin={`${delay}s`}
                    path={edgePath}
                  />
                </motion.circle>

                {/* 核心亮点 - 光的反射 */}
                <motion.circle
                  r={1.2 * sizeVariation}
                  fill="rgba(255, 255, 255, 0.95)"
                  opacity={0}
                  filter="blur(0.3px)"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.7, 0.9, 0.7, 0],
                  }}
                  transition={{
                    duration,
                    repeat: Infinity,
                    delay,
                    ease: 'easeInOut',
                  }}
                >
                  <animateMotion
                    dur={`${duration}s`}
                    repeatCount="indefinite"
                    begin={`${delay}s`}
                    path={edgePath}
                  />
                </motion.circle>
              </g>
            );
          })}
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
