"use client";
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const plantData = {
  lavender: {
    name: 'Lavender',
    species: 'Lavandula angustifolia',
    soil_type: 'Well-draining',
    ph_level: 6.7,
    health_status: 'Healthy',
    image_url: '/placeholder.jpg',
    companions: ['roses', 'sage', 'thyme'],
    antagonists: ['humid_plants']
  },
  roses: {
    name: 'Roses',
    species: 'Rosa hybrid',
    soil_type: 'Rich loamy',
    ph_level: 6.5,
    health_status: 'Healthy',
    image_url: '/placeholder.jpg',
    companions: ['lavender', 'garlic', 'marigold'],
    antagonists: ['boxwood']
  },
  hydrangea: {
    name: 'Hydrangea',
    species: 'Hydrangea macrophylla',
    soil_type: 'Rich organic',
    ph_level: 5.5,
    health_status: 'Healthy',
    image_url: '/placeholder.jpg',
    companions: ['ferns', 'hostas'],
    antagonists: ['succulents']
  },
  sage: {
    name: 'Sage',
    species: 'Salvia officinalis',
    soil_type: 'Sandy',
    ph_level: 6.5,
    health_status: 'Healthy',
    image_url: '/placeholder.jpg',
    companions: ['rosemary', 'thyme', 'lavender'],
    antagonists: ['cucumbers']
  },
  hostas: {
    name: 'Hostas',
    species: 'Hosta sieboldiana',
    soil_type: 'Rich organic',
    ph_level: 6.5,
    health_status: 'Healthy',
    image_url: '/placeholder.jpg',
    companions: ['ferns', 'astilbe', 'hydrangea'],
    antagonists: ['sun_plants']
  }
};

const COLORS = [
  'border-blue-500',
  'border-red-500',
  'border-green-500',
  'border-purple-500',
  'border-yellow-500',
  'border-pink-500',
  'border-indigo-500',
  'border-orange-500'
];

const PlantDetails = ({ plant }) => (
  <Popover>
    <PopoverTrigger asChild>
      <div className="w-full h-full flex items-center justify-center bg-green-100 cursor-pointer">
        {plant.name.charAt(0)}
      </div>
    </PopoverTrigger>
    <PopoverContent className="w-64">
      <h3 className="font-bold mb-2">{plant.name}</h3>
      <div className="space-y-2">
        <div><span className="font-bold">Species:</span> {plant.species}</div>
        <div><span className="font-bold">Soil Type:</span> {plant.soil_type}</div>
        <div><span className="font-bold">pH Level:</span> {plant.ph_level}</div>
        <div><span className="font-bold">Health:</span> {plant.health_status}</div>
        <div><span className="font-bold">Companions:</span> {plant.companions.join(', ')}</div>
        <div><span className="font-bold">Antagonists:</span> {plant.antagonists.join(', ')}</div>
      </div>
    </PopoverContent>
  </Popover>
);

const GardenPlanner = () => {
  const [grid, setGrid] = useState(Array(8).fill(null).map(() => Array(8).fill(null)));
  const [draggedPlant, setDraggedPlant] = useState(null);
  const [message, setMessage] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [groups, setGroups] = useState([]);
  const [isGroupingMode, setIsGroupingMode] = useState(false);
  const [isRemovingGroups, setIsRemovingGroups] = useState(false);
  const nextColorIndex = useRef(0);

  const clearTile = (row, col) => {
    const newGrid = [...grid];
    newGrid[row][col] = null;
    setGrid(newGrid);
  };

  const handleDrop = (row, col) => {
    if (!draggedPlant) return;
    
    const newGrid = [...grid];
    newGrid[row][col] = draggedPlant;
    setGrid(newGrid);
    setDraggedPlant(null);
  };

  const clearGrid = () => {
    setGrid(Array(8).fill(null).map(() => Array(8).fill(null)));
    setGroups([]);
    setMessage({ type: 'success', text: 'Grid cleared successfully!' });
  };

  const handleMouseDown = (row, col) => {
    if (!isGroupingMode || !grid[row][col]) return;
    setIsSelecting(true);
    setSelectionStart({ row, col });
  };

  const handleMouseUp = (row, col) => {
    if (isRemovingGroups) {
      setGroups(groups.filter(group => 
        !(row >= group.startRow && row <= group.endRow && 
          col >= group.startCol && col <= group.endCol)
      ));
      return;
    }

    if (isSelecting && selectionStart && grid[row][col]) {
      const startRow = Math.min(selectionStart.row, row);
      const endRow = Math.max(selectionStart.row, row);
      const startCol = Math.min(selectionStart.col, col);
      const endCol = Math.max(selectionStart.col, col);

      if (startRow !== endRow || startCol !== endCol) {
        setGroups([...groups, {
          startRow,
          endRow,
          startCol,
          endCol,
          colorClass: COLORS[nextColorIndex.current % COLORS.length]
        }]);
        nextColorIndex.current += 1;
      }
    }
    setIsSelecting(false);
    setSelectionStart(null);
  };

  const getGroupBorder = (row, col) => {
    for (const group of groups) {
      if (row >= group.startRow && row <= group.endRow &&
          col >= group.startCol && col <= group.endCol) {
        const borderClasses = [];
        if (row === group.startRow) borderClasses.push('border-t-4');
        if (row === group.endRow) borderClasses.push('border-b-4');
        if (col === group.startCol) borderClasses.push('border-l-4');
        if (col === group.endCol) borderClasses.push('border-r-4');
        if (borderClasses.length > 0) {
          return `${borderClasses.join(' ')} ${group.colorClass}`;
        }
      }
    }
    return '';
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Garden Planner</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant={isGroupingMode ? "default" : "outline"}
            onClick={() => {
              setIsGroupingMode(!isGroupingMode);
              setIsRemovingGroups(false);
            }}
          >
            Group Plants
          </Button>
          <Button 
            variant={isRemovingGroups ? "default" : "outline"}
            onClick={() => {
              setIsRemovingGroups(!isRemovingGroups);
              setIsGroupingMode(false);
            }}
          >
            Remove Groups
          </Button>
          <Button variant="outline" onClick={clearGrid}>Clear Grid</Button>
        </div>
      </CardHeader>
      <div className=' w-full flex items-center justify-center'> 
      <CardContent>
        <div className="mb-4">
          <div className="flex gap-2 mb-4">
            {Object.keys(plantData).map((plant) => (
              <div
                key={plant}
                draggable
                onDragStart={() => setDraggedPlant(plant)}
                className="p-2 bg-green-100 rounded cursor-move hover:bg-green-200"
              >
                {plantData[plant].name}
              </div>
            ))}
          </div>
        </div>

        <div className="inline-grid grid-cols-8 gap-1 bg-gray-100 p-1">
          {grid.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-12 h-12 border border-gray-300 bg-white flex items-center justify-center relative ${
                  getGroupBorder(rowIndex, colIndex)
                }`}
                onDrop={() => handleDrop(rowIndex, colIndex)}
                onDragOver={(e) => e.preventDefault()}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseUp={() => handleMouseUp(rowIndex, colIndex)}
                onMouseEnter={(e) => {
                  if (e.buttons === 1) handleMouseUp(rowIndex, colIndex);
                }}
              >
                {cell && (
                  <>
                    <button 
                      onClick={() => clearTile(rowIndex, colIndex)}
                      className="absolute top-0 right-0 p-0.5 bg-red-100 hover:bg-red-200 rounded-bl z-10"
                    >
                      <X size={12} />
                    </button>
                    <PlantDetails plant={plantData[cell]} />
                  </>
                )}
              </div>
            ))
          ))}
        </div>

        {message && (
          <Alert className={message.type === 'error' ? 'bg-red-50' : 'bg-green-50'}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      </div>
      
    </Card>
  );
};

export default GardenPlanner;