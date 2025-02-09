'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Rose, Hydrangea, Lavender } from '../components/models/Flowers';

const ModelShowcase = () => {
  return (
    <div className="w-full h-[500px] relative bg-zinc-900/50 rounded-lg border border-green-500/20 overflow-hidden hover-scale">
      <h2 className="absolute top-4 left-4 text-2xl font-bold text-green-400 z-10">
        3D Plant Preview
      </h2>
      
      <Canvas 
        shadows 
        camera={{ position: [5, 5, 5], fov: 50 }}
        className="bg-zinc-900"
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          castShadow
        />

        {/* Display models in a row */}
        <Rose position={[-2, 0, 0]} />
        <Hydrangea position={[0, 0, 0]} />
        <Lavender position={[2, 0, 0]} />

        {/* Ground plane */}
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -0.5, 0]}
          receiveShadow
        >
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>

        <OrbitControls />
      </Canvas>

      {/* Labels */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-20 text-zinc-400">
        <span className="bg-zinc-900/80 px-3 py-1 rounded">Rose</span>
        <span className="bg-zinc-900/80 px-3 py-1 rounded">Hydrangea</span>
        <span className="bg-zinc-900/80 px-3 py-1 rounded">Lavender</span>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ModelShowcase), {
  ssr: false
});