'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Rose = ({ position }) => {
  const group = useRef();

  useFrame((state) => {
    if (group.current) {
      // Subtle movement
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={group} position={position}>
      {/* Stem */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </mesh>

      {/* Flower head - multiple layers of petals */}
      <group position={[0, 0.6, 0]}>
        {/* Inner petals */}
        {[...Array(3)].map((_, layer) => (
          <group key={layer} position={[0, layer * 0.05, 0]}>
            {[...Array(8)].map((_, i) => (
              <mesh
                key={i}
                position={[
                  Math.cos((i / 8) * Math.PI * 2) * (0.15 + layer * 0.03),
                  Math.sin((i / 8) * Math.PI * 2) * 0.05,
                  Math.sin((i / 8) * Math.PI * 2) * (0.15 + layer * 0.03)
                ]}
                rotation={[
                  Math.PI * 0.3,
                  (i / 8) * Math.PI * 2,
                  Math.PI * 0.2
                ]}
                castShadow
              >
                <coneGeometry args={[0.08, 0.15, 8]} />
                <meshStandardMaterial 
                  color="#ff0033" 
                  side={THREE.DoubleSide}
                  roughness={0.6}
                  metalness={0.1}
                />
              </mesh>
            ))}
          </group>
        ))}
        {/* Center of the rose */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#8b0000" roughness={0.7} />
        </mesh>
      </group>

      {/* Leaves */}
      {[...Array(2)].map((_, i) => (
        <group key={i} position={[0, 0.2 + i * 0.2, 0]} rotation={[0, (i * Math.PI) / 2, 0]}>
          <mesh castShadow>
            <coneGeometry args={[0.1, 0.2, 4]} />
            <meshStandardMaterial 
              color="#228B22" 
              side={THREE.DoubleSide}
              roughness={0.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const Hydrangea = ({ position }) => {
  const group = useRef();

  useFrame((state) => {
    if (group.current) {
      // Gentle swaying motion
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      group.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group ref={group} position={position}>
      {/* Main stem */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </mesh>

      {/* Flower clusters */}
      <group position={[0, 0.6, 0]}>
        {[...Array(5)].map((_, cluster) => (
          <group 
            key={cluster} 
            position={[
              Math.cos(cluster * Math.PI * 0.4) * 0.15,
              Math.random() * 0.1,
              Math.sin(cluster * Math.PI * 0.4) * 0.15
            ]}
          >
            {[...Array(10)].map((_, i) => (
              <mesh
                key={i}
                position={[
                  Math.cos(i * Math.PI * 0.2) * 0.08,
                  Math.sin(i * Math.PI * 0.2) * 0.08,
                  Math.cos((i + 2) * Math.PI * 0.2) * 0.08
                ]}
                castShadow
              >
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial 
                  color="#4169E1"
                  roughness={0.5}
                  metalness={0.1}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Leaves */}
      {[...Array(3)].map((_, i) => (
        <group key={i} position={[0, 0.15 + i * 0.15, 0]} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
          <mesh castShadow>
            <coneGeometry args={[0.12, 0.25, 4]} />
            <meshStandardMaterial 
              color="#228B22" 
              side={THREE.DoubleSide}
              roughness={0.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const Lavender = ({ position }) => {
  const group = useRef();

  useFrame((state) => {
    if (group.current) {
      // Gentle swaying
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    }
  });

  return (
    <group ref={group} position={position}>
      {/* Main stem */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </mesh>

      {/* Flower spikes */}
      <group position={[0, 0.6, 0]}>
        {[...Array(6)].map((_, layer) => (
          <group key={layer} position={[0, layer * 0.08, 0]} rotation={[0, layer * 0.2, 0]}>
            {[...Array(8)].map((_, i) => (
              <mesh
                key={i}
                position={[
                  Math.cos((i / 8) * Math.PI * 2) * 0.06,
                  0,
                  Math.sin((i / 8) * Math.PI * 2) * 0.06
                ]}
                castShadow
              >
                <sphereGeometry args={[0.025, 6, 6]} />
                <meshStandardMaterial 
                  color="#8A2BE2"
                  roughness={0.6}
                  metalness={0.1}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Small leaves */}
      {[...Array(4)].map((_, i) => (
        <group key={i} position={[0, 0.1 + i * 0.15, 0]} rotation={[0, (i * Math.PI) / 2, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.2, 4]} />
            <meshStandardMaterial 
              color="#228B22"
              roughness={0.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};
