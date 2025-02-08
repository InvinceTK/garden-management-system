"use client";
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { X, Leaf, Grid, Trash2, Group } from 'lucide-react';

const plantData = {
  lavender: {
    name: 'Lavender',
    species: 'Lavandula angustifolia',
    soil_type: 'Well-draining',
    ph_level: 6.7,
    health_status: 'Healthy',
    image: '/lav.png',
    companions: ['roses', 'sage', 'thyme'],
    antagonists: ['humid_plants']
  },
  roses: {
    name: 'Roses',
    species: 'Rosa hybrid',
    soil_type: 'Rich loamy',
    ph_level: 6.5,
    health_status: 'Healthy',
    image: '/rose.png',
    companions: ['lavender', 'garlic', 'marigold'],
    antagonists: ['boxwood']
  },
  hydrangea: {
    name: 'Hydrangea',
    species: 'Hydrangea macrophylla',
    soil_type: 'Rich organic',
    ph_level: 5.5,
    health_status: 'Healthy',
    image: '/hy.png',
    companions: ['ferns', 'hostas'],
    antagonists: ['succulents']
  },
  sage: {
    name: 'Sage',
    species: 'Salvia officinalis',
    soil_type: 'Sandy',
    ph_level: 6.5,
    health_status: 'Healthy',
    image: '/sage.png',
    companions: ['rosemary', 'thyme', 'lavender'],
    antagonists: ['cucumbers']
  },
  hostas: {
    name: 'Hostas',
    species: 'Hosta sieboldiana',
    soil_type: 'Rich organic',
    ph_level: 6.5,
    health_status: 'Healthy',
    image: '/hos.png',
    companions: ['ferns', 'astilbe', 'hydrangea'],
    antagonists: ['sun_plants']
  }
};

const COLORS = [
  'border-blue-500',
  'border-emerald-500',
  'border-purple-500',
  'border-amber-500',
  'border-pink-500',
  'border-teal-500',
  'border-indigo-500',
  'border-orange-500'
];

const soilStyle = {
  backgroundColor: '#3B2417',
  backgroundImage: `
    radial-gradient(circle at 50% 50%, #2A1810 2%, transparent 6%),
    radial-gradient(circle at 20% 20%, #4A3020 4%, transparent 8%),
    radial-gradient(circle at 80% 80%, #321E14 3%, transparent 6%),
    radial-gradient(circle at 30% 70%, #3E2819 5%, transparent 10%)
  `,
  backgroundSize: '12px 12px',
  backgroundPosition: '0 0, 6px 6px, -3px -3px, 3px -3px'
};

const PlantDetails = ({ plant }) => (
  <Popover>
    <PopoverTrigger asChild>
      <div className="w-full h-full flex items-center justify-center cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
        <img 
          src={plant.image} 
          alt={plant.name}
          className="w-full h-full object-cover"
        />
      </div>
    </PopoverTrigger>
    <PopoverContent className="w-72 p-4 bg-white/95 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Leaf className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold">{plant.name}</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-3 gap-1">
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-gray-600 text-xs">Species</div>
              <div className="font-medium">{plant.species}</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-gray-600 text-xs">Soil Type</div>
              <div className="font-medium">{plant.soil_type}</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-gray-600 text-xs">pH Level</div>
              <div className="font-medium">{plant.ph_level}</div>
            </div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <div className="text-green-700 text-xs font-medium">Companions</div>
            <div className="text-green-900">{plant.companions.join(', ')}</div>
          </div>
          <div className="bg-red-50 p-2 rounded">
            <div className="text-red-700 text-xs font-medium">Antagonists</div>
            <div className="text-red-900">{plant.antagonists.join(', ')}</div>
          </div>
        </div>
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
    setMessage({ type: 'info', text: 'Plant removed from garden' });
  };

  const handleDrop = (row, col) => {
    if (!draggedPlant) return;
    
    const newGrid = [...grid];
    newGrid[row][col] = draggedPlant;
    setGrid(newGrid);
    setDraggedPlant(null);
    setMessage({ type: 'success', text: `${plantData[draggedPlant].name} planted successfully!` });
  };

  const clearGrid = () => {
    setGrid(Array(8).fill(null).map(() => Array(8).fill(null)));
    setGroups([]);
    setMessage({ type: 'info', text: 'Garden cleared successfully!' });
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
    <Card className="w-full max-w-4xl bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800" >
      <CardHeader className="border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Leaf className="w-6 h-6 text-green-400" />
            <CardTitle className="text-gray-100 text-2xl">Garden Planner</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={isGroupingMode ? "default" : "outline"}
              className="gap-2"
              onClick={() => {
                setIsGroupingMode(!isGroupingMode);
                setIsRemovingGroups(false);
              }}
            >
              <Group size={16} />
              Group Plants
            </Button>
            <Button 
              variant={isRemovingGroups ? "destructive" : "outline"}
              className="gap-2"
              onClick={() => {
                setIsRemovingGroups(!isRemovingGroups);
                setIsGroupingMode(false);
              }}
            >
              <Grid size={16} />
              Remove Groups
            </Button>
            <Button variant="outline" className="gap-2" onClick={clearGrid}>
              <Trash2 size={16} />
              Clear Garden
            </Button>
          </div>
        </div>
      </CardHeader>

      <div className="w-full flex items-center justify-center bg-gray-900"> 
        <CardContent className="p-8">
          <div className="mb-6">
            <h3 className="text-gray-300 text-sm font-medium mb-3">Available Plants</h3>
            <div className="flex gap-3 p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700">
              {Object.entries(plantData).map(([key, plant]) => (
                <div
                  key={key}
                  draggable
                  onDragStart={() => setDraggedPlant(key)}
                  className="px-4 py-2 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg 
                    cursor-move hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200
                    shadow-md shadow-green-500/20"
                >
                  {plant.name}
                </div>
              ))}
            </div>
          </div>

          <div 
            className="inline-grid grid-cols-8 gap-2 p-4 rounded-xl shadow-inner bg-opacity-90"
            style={soilStyle}
          >
            {grid.map((row, rowIndex) => (
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-12 h-12 flex items-center justify-center relative transition-all duration-200
                    ${cell ? 'bg-opacity-50' : 'hover:bg-opacity-30 bg-opacity-10'} 
                    bg-white rounded-lg
                    ${getGroupBorder(rowIndex, colIndex)}`}
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
                        className="absolute -top-1 -right-1 p-1 bg-red-500 hover:bg-red-600 
                          text-white rounded-full shadow-lg z-10 transition-all duration-200"
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
            <Alert className={`mt-4 border ${
              message.type === 'error' ? 'bg-red-500/10 border-red-500 text-red-500' : 
              message.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-500' :
              'bg-blue-500/10 border-blue-500 text-blue-500'
            }`}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default GardenPlanner;