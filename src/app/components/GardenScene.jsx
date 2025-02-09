'use client';

import React, { useState } from 'react';
import { OrbitControls, Html } from '@react-three/drei';
import { X } from 'lucide-react';
import ClientCanvas from './ClientCanvas';
import { Rose, Hydrangea, Lavender } from './models/Flowers';

// Flower types
const FLOWER_TYPES = {
  ROSE: 'rose',
  HYDRANGEA: 'hydrangea',
  LAVENDER: 'lavender',
};

// Grid cell component
const GridCell = ({ position, flowerType, onClick, onRemove }) => {
  return (
    <group position={position}>
      {/* Remove button */}
      {flowerType && (
        <Html position={[0.3, 0.8, 0.3]} style={{ pointerEvents: 'auto' }}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </Html>
      )}

      {/* Cell base */}
      <mesh onClick={onClick} receiveShadow>
        <boxGeometry args={[0.9, 0.1, 0.9]} />
        <meshStandardMaterial color="#3c2317" />
      </mesh>

      {/* Flower model based on type */}
      {flowerType && (
        <>
          {flowerType === FLOWER_TYPES.ROSE && <Rose position={[0, 0.1, 0]} />}
          {flowerType === FLOWER_TYPES.HYDRANGEA && <Hydrangea position={[0, 0.1, 0]} />}
          {flowerType === FLOWER_TYPES.LAVENDER && <Lavender position={[0, 0.1, 0]} />}
        </>
      )}
    </group>
  );
};

const GardenScene = ({ selectedFlower }) => {
  const [grid, setGrid] = useState(Array(8).fill().map(() => Array(8).fill(null)));

  const handleCellClick = (row, col) => {
    if (!grid[row][col]) {
      const newGrid = [...grid];
      newGrid[row][col] = selectedFlower;
      setGrid(newGrid);
    }
  };

  const handleRemoveFlower = (row, col) => {
    const newGrid = [...grid];
    newGrid[row][col] = null;
    setGrid(newGrid);
  };

  return (
    <div className="w-full h-full">
      <ClientCanvas>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Ground */}
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -0.2, 0]}
          receiveShadow
        >
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#2d5a27" />
        </mesh>

        {/* Grid */}
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <GridCell
              key={`${rowIndex}-${colIndex}`}
              position={[rowIndex - 3.5, 0, colIndex - 3.5]}
              flowerType={cell}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onRemove={() => handleRemoveFlower(rowIndex, colIndex)}
            />
          ))
        )}

        <OrbitControls />
      </ClientCanvas>
    </div>
  );
};

export default GardenScene;