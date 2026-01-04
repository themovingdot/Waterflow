'use client';

import { ReactFlowProvider } from 'reactflow';
import FlowSystem from '@/components/FlowSystem';

export default function Home() {
  return (
    <main className="w-full h-screen">
      <ReactFlowProvider>
        <FlowSystem />
      </ReactFlowProvider>
    </main>
  );
}
