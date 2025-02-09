'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Rose, Hydrangea, Lavender } from '../components/models/Flowers';

const ModelsShowcase = () => {
  return (
    <div className="w-full h-screen bg-gray-900">
      {/* Title */}
      <h1 className="absolute top-4 left-4 text-white text-2xl font-bold z-10">
        3D Flower Models
      </h1>

      {/* Model Display */}
      <Canvas 
        shadows 
        camera={{ position: [5, 5, 5], fov: 50 }}
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
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-20 text-white">
        <span>Rose</span>
        <span>Hydrangea</span>
        <span>Lavender</span>
      </div>
    </div>
  );
};

export default ModelsShowcase;