'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Card, CardContent } from "@/components/ui/card";
import { Info } from 'lucide-react';

function InteractiveGarden() {
  const mountRef = useRef(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x87CEEB); // Lighter sky blue background
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 5;
    controls.maxDistance = 20;

    // Enhanced Ground with gradient
    const groundGeometry = new THREE.PlaneGeometry(30, 30, 32, 32);
    const groundMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x4A7834,  // Richer grass green
      shininess: 10,
      flatShading: true
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    scene.add(ground);

    // Enhanced Plant Data
    const plantData = {
      wildflower: {
        name: "Wild Cornflower",
        description: "Delicate blue wildflowers that sway gently in the breeze",
        color: 0x4169E1,
        height: 1.2
      },
      rose: {
        name: "Garden Rose",
        description: "A luxuriant rose with vibrant red petals",
        color: 0xFF0000,
        height: 1.5
      },
      hydrangea: {
        name: "Blue Hydrangea",
        description: "A lush cluster of powder-blue hydrangea blooms",
        color: 0x1E90FF,
        height: 1.3
      },
      foliage: {
        name: "Decorative Foliage",
        description: "Ornamental leaves adding texture to the garden",
        color: 0x228B22,
        height: 1.0
      },
      sunflower: {
        name: "Sunflower",
        description: "Tall, cheerful sunflower reaching toward the sky",
        color: 0xFFD700,
        height: 2.0
      }
    };

    function createInteractivePlant(type, x, z) {
      const group = new THREE.Group();
      group.userData = { type, ...plantData[type] };
      group.position.set(x, 0, z);

      const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, plantData[type].height, 8);
      const stemMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x228B22,
        shininess: 30
      });
      const stem = new THREE.Mesh(stemGeometry, stemMaterial);
      stem.position.y = -2 + plantData[type].height/2;
      group.add(stem);

      const createFlower = () => {
        switch(type) {
          case 'sunflower':
    // Create center disk with seed pattern
    const centerRadius = 0.25;
    const centerGeo = new THREE.SphereGeometry(centerRadius, 32, 32);
    const centerMat = new THREE.MeshPhongMaterial({ 
        color: 0x4A2F1B,  // Darker brown for center
        shininess: 5,
        flatShading: true
    });
    const center = new THREE.Mesh(centerGeo, centerMat);
    
    // Create seed pattern on the center disk
    const seedCount = 100;
    const seedGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    const seedMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1A0F06,  // Very dark brown for seeds
        shininess: 2
    });

    // Create Fibonacci spiral pattern for seeds
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < seedCount; i++) {
        const seed = new THREE.Mesh(seedGeometry, seedMaterial);
        
        // Use golden ratio to calculate seed positions
        const theta = i * 2 * Math.PI / goldenRatio;
        const r = centerRadius * Math.sqrt(i / seedCount);
        
        // Position seeds on the sphere surface
        seed.position.x = r * Math.cos(theta);
        seed.position.z = r * Math.sin(theta);
        seed.position.y = Math.sqrt(Math.max(0, centerRadius * centerRadius - r * r)) * (Math.random() > 0.5 ? 1 : -1);
        
        // Rotate seeds to face outward
        seed.lookAt(seed.position.clone().multiplyScalar(2));
        center.add(seed);
    }

    // Position center
    center.position.y = 0;
    group.add(center);

    // Create more natural looking petals
    const petalRows = 2;  // Two rows of petals for fullness
    const petalsPerRow = 34;  // More petals for fuller appearance
    
    for (let row = 0; row < petalRows; row++) {
        for (let i = 0; i < petalsPerRow; i++) {
            // Create petal geometry with more natural shape
            const petalLength = 0.5 + Math.random() * 0.1;  // Varying petal lengths
            const petalWidth = 0.12 + Math.random() * 0.04;  // Varying petal widths
            
            // Custom petal shape using custom geometry
            const petalShape = new THREE.Shape();
            petalShape.moveTo(0, 0);
            petalShape.quadraticCurveTo(petalWidth/2, petalLength/2, 0, petalLength);
            petalShape.quadraticCurveTo(-petalWidth/2, petalLength/2, 0, 0);
            
            const petalGeometry = new THREE.ExtrudeGeometry(petalShape, {
                steps: 1,
                depth: 0.02,
                bevelEnabled: false
            });

            // Create gradient-like effect for petals
            const petalMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xFFD700,  // Base yellow
                emissive: 0x331900,  // Slight orange glow
                shininess: 20,
                specular: 0x111111
            });
            
            const petal = new THREE.Mesh(petalGeometry, petalMaterial);
            
            // Position and rotate petal
            const angle = (i / petalsPerRow) * Math.PI * 2;
            const rowRadius = 0.3 + row * 0.1;  // Offset each row slightly
            
            petal.position.set(
                Math.cos(angle) * rowRadius,
                -0.3,  // Match center disk height
                Math.sin(angle) * rowRadius
            );
            
            // Rotate petal to face outward
            petal.rotation.y = -angle;
            petal.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.2;  // Slight random variation
            petal.rotation.z = (Math.random() - 0.5) * 0.1;  // Slight twist
            
            group.add(petal);
        }
    }
    
    // Add small leaves near the center
    const leafCount = 3;
    for (let i = 0; i < leafCount; i++) {
        const leafGeometry = new THREE.Shape();
        leafGeometry.moveTo(0, 0);
        leafGeometry.quadraticCurveTo(0.1, 0.1, 0.2, 0);
        leafGeometry.quadraticCurveTo(0.1, -0.1, 0, 0);
        
        const leafExtrudeSettings = {
            steps: 1,
            depth: 0.02,
            bevelEnabled: false
        };
        
        const leafMesh = new THREE.ExtrudeGeometry(leafGeometry, leafExtrudeSettings);
        const leafMaterial = new THREE.MeshPhongMaterial({
            color: 0x228B22,
            shininess: 10
        });
        
        const leaf = new THREE.Mesh(leafMesh, leafMaterial);
        
        // Position leaves around stem
        const leafAngle = (i / leafCount) * Math.PI * 2;
        leaf.position.set(
            Math.cos(leafAngle) * 0.1,
            -1.9 + i * 0.1,
            Math.sin(leafAngle) * 0.1
        );
        
        leaf.rotation.y = -leafAngle;
        leaf.rotation.x = Math.PI / 4;
        
        group.add(leaf);
    }
    

            for (let i = 0; i < 24; i++) {
              const petalGeo = new THREE.ConeGeometry(0.15, 0.4, 4);
              const petalMat = new THREE.MeshPhongMaterial({ 
                color: plantData[type].color,
                shininess: 50
              });
              const petal = new THREE.Mesh(petalGeo, petalMat);
              petal.position.y = 0;
              petal.rotation.z = Math.PI / 2;
              petal.rotation.y = (i / 24) * Math.PI * 2;
              petal.position.x = Math.cos((i / 24) * Math.PI * 2) * 0.4;
              petal.position.z = Math.sin((i / 24) * Math.PI * 2) * 0.4;
              group.add(petal);
            }
            break;

          default:
            // Enhanced original flower logic
            const petalCount = type === 'hydrangea' ? 12 : 
                             type === 'rose' ? 15 : 
                             type === 'wildflower' ? 8 : 6;
            
            for (let i = 0; i < petalCount; i++) {
              const petalGeometry = new THREE.SphereGeometry(
                type === 'rose' ? 0.15 : 0.1,
                8, 8
              );
              const petalMaterial = new THREE.MeshPhongMaterial({ 
                color: plantData[type].color,
                emissive: 0x000000,
                shininess: 50
              });
              const petals = new THREE.Mesh(petalGeometry, petalMaterial);
              
              const radius = type === 'hydrangea' ? 0.4 : 0.3;
              const heightVar = type === 'hydrangea' ? 0.4 : 0.3;
              
              petals.position.set(
                (Math.random() - 0.5) * radius,
                -1 + Math.random() * heightVar,
                (Math.random() - 0.5) * radius
              );
              group.add(petals);
            }
        }
      };

      createFlower();
      scene.add(group);
      return group;
    }

    // Create denser grid of plants
    const gridSize = 6;  // Increased from 4 to 6
    const spacing = 1.2; // Reduced spacing further
    const plants = [];
    const plantTypes = [...Object.keys(plantData)];
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = (i - gridSize/2) * spacing;
        const z = (j - gridSize/2) * spacing;
        
        // More natural randomization
        const offsetX = (Math.random() - 0.5) * 0.4;
        const offsetZ = (Math.random() - 0.5) * 0.4;
        
        const plantType = plantTypes[Math.floor(Math.random() * plantTypes.length)];
        plants.push(createInteractivePlant(plantType, x + offsetX, z + offsetZ));
      }
    }

    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 8, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    camera.position.set(0, 8, 10);
    camera.lookAt(0, 0, 0);

    // Interaction logic
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseMove(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(plants, true);

      renderer.domElement.style.cursor = intersects.length > 0 ? 'pointer' : 'default';

      // Hover effect
      plants.forEach(plant => {
        if (!plant.userData.selected) {
          plant.children.forEach(child => {
            if (child.material) {
              child.material.emissive.setHex(0x000000);
            }
          });
        }
      });

      if (intersects.length > 0) {
        const hovered = intersects[0].object.parent;
        if (!hovered.userData.selected) {
          hovered.children.forEach(child => {
            if (child.material) {
              child.material.emissive.setHex(0x111111);
            }
          });
        }
      }
    }

    function onClick(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(plants, true);

      if (intersects.length > 0) {
        const selectedObject = intersects[0].object.parent;
        
        plants.forEach(plant => {
          plant.userData.selected = false;
          plant.children.forEach(child => {
            if (child.material) {
              child.material.emissive.setHex(0x000000);
            }
          });
        });

        selectedObject.userData.selected = true;
        selectedObject.children.forEach(child => {
          if (child.material) {
            child.material.emissive.setHex(0x222222);
          }
        });

        setSelectedPlant(selectedObject.userData);
      }
    }

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    // Enhanced Animation
    function animate() {
      requestAnimationFrame(animate);
      controls.update();

      plants.forEach(plant => {
        plant.children.forEach((part, index) => {
          if (index > 0) {
            const swayAmount = plant.userData.type === 'sunflower' ? 0.03 : 0.05;
            part.rotation.x = Math.sin(Date.now() * 0.002 + plant.position.x) * swayAmount;
            part.rotation.z = Math.cos(Date.now() * 0.002 + plant.position.z) * swayAmount;
          }
        });
      });

      renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    function handleResize() {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      mountRef.current?.removeChild(renderer.domElement);
      
      plants.forEach(plant => {
        plant.children.forEach(child => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      });
      groundGeometry.dispose();
      groundMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[600px]">
      <div ref={mountRef} className="w-full h-full" />
      
      {showTutorial && (
        <Card className="absolute top-4 left-4 w-64 bg-white/90">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">Garden Controls:</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>🌿 Drag to rotate view</li>
                  <li>🔍 Scroll to zoom in/out</li>
                  <li>🌺 Click plants to select</li>
                </ul>
              </div>
            </div>
            <button 
              onClick={() => setShowTutorial(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </CardContent>
        </Card>
      )}
      
      {selectedPlant && (
        <Card className="absolute bottom-4 left-4 w-72 bg-white/90">
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-1">{selectedPlant.name}</h3>
            <p className="text-sm text-gray-600">{selectedPlant.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default InteractiveGarden;