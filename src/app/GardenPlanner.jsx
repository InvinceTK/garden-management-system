"use client";
import React, { useState, useRef } from "react";
import plantData from "@/app/_components/plantData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { X, Leaf, Grid, Trash2, Group } from "lucide-react";

const COLORS = [
  "border-blue-500 bg-blue-500",
  "border-emerald-500 bg-emerald-500",
  "border-purple-500 bg-purple-500",
  "border-amber-500 bg-amber-500",
  "border-pink-500 bg-pink-500",
  "border-teal-500 bg-teal-500",
  "border-indigo-500 bg-indigo-500",
  "border-orange-500 bg-orange-500",
];

const soilStyle = {
  backgroundColor: "#3B2417",
  backgroundImage: `
    radial-gradient(circle at 50% 50%, #2A1810 2%, transparent 6%),
    radial-gradient(circle at 20% 20%, #4A3020 4%, transparent 8%),
    radial-gradient(circle at 80% 80%, #321E14 3%, transparent 6%),
    radial-gradient(circle at 30% 70%, #3E2819 5%, transparent 10%)
  `,
  backgroundSize: "12px 12px",
  backgroundPosition: "0 0, 6px 6px, -3px -3px, 3px -3px",
};

const PlantDetails = ({
  plant,
  row,
  col,
  groupNumber,
  groupColor,
  onClick,
  isGrouping,
}) => {
  const PlantContent = (
    <div
      onClick={onClick}
      className={`w-full h-full flex items-center justify-center cursor-pointer 
        overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-200 relative
        ${groupColor ? `ring-2 ring-offset-1 ${groupColor.split(" ")[0]}` : ""}`}
    >
      {groupNumber && (
        <div
          className={`absolute -top-1 -left-1 w-5 h-5 flex items-center justify-center
          ${groupColor} text-white text-xs font-bold
          rounded-full shadow-lg z-10 transition-all duration-200`}
        >
          {groupNumber}
        </div>
      )}
      <img
        src={plant.image}
        alt={plant.name}
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  );

  if (isGrouping) {
    return PlantContent;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{PlantContent}</PopoverTrigger>
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
              <div className="text-green-700 text-xs font-medium">
                Companions
              </div>
              <div className="text-green-900">
                {plant.companions.join(", ")}
              </div>
            </div>
            <div className="bg-red-50 p-2 rounded">
              <div className="text-red-700 text-xs font-medium">
                Antagonists
              </div>
              <div className="text-red-900">{plant.antagonists.join(", ")}</div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const GardenPlanner = () => {
  const [grid, setGrid] = useState(
    Array(8).fill(null).map(() => Array(8).fill(null))
  );
  const [draggedPlant, setDraggedPlant] = useState(null);
  const [message, setMessage] = useState(null);
  const [groups, setGroups] = useState([]);
  const [isGrouping, setIsGrouping] = useState(false);
  const [selectedPlantsForGroup, setSelectedPlantsForGroup] = useState([]);
  const nextColorIndex = useRef(0);

  const clearTile = (row, col) => {
    const newGrid = [...grid];
    newGrid[row][col] = null;
    setGrid(newGrid);
    setGroups(groups.filter(group => 
      !group.cells.some(cell => cell.row === row && cell.col === col)
    ));
    setMessage({ type: "info", text: "Plant removed from garden" });
  };

  const handleDrop = (row, col) => {
    if (!draggedPlant || isGrouping) return;
    const newGrid = [...grid];
    newGrid[row][col] = draggedPlant;
    setGrid(newGrid);
    setDraggedPlant(null);
    setMessage({
      type: "success",
      text: `${plantData[draggedPlant].name} planted successfully!`
    });
  };

  const clearGrid = () => {
    setGrid(Array(8).fill(null).map(() => Array(8).fill(null)));
    setGroups([]);
    setSelectedPlantsForGroup([]);
    setMessage({ type: "info", text: "Garden cleared successfully!" });
  };

  const togglePlantSelection = (row, col) => {
    if (!grid[row][col]) return;

    const cellKey = `${row},${col}`;
    setSelectedPlantsForGroup((prev) => {
      if (prev.includes(cellKey)) {
        return prev.filter((key) => key !== cellKey);
      }
      return [...prev, cellKey];
    });
  };

  const createGroup = () => {
    if (selectedPlantsForGroup.length < 2) {
      setMessage({
        type: "error",
        text: "Select at least 2 plants to create a group",
      });
      return;
    }

    const cells = selectedPlantsForGroup.map((cell) => {
      const [row, col] = cell.split(",").map(Number);
      return { row, col };
    });

    setGroups([
      ...groups,
      {
        id: groups.length + 1,
        cells,
        color: COLORS[nextColorIndex.current % COLORS.length],
      },
    ]);

    nextColorIndex.current += 1;
    setSelectedPlantsForGroup([]);
    setIsGrouping(false);
    setMessage({ type: "success", text: "Plant group created!" });
  };

  const getCellGroup = (row, col) => {
    return groups.find((group) =>
      group.cells.some((cell) => cell.row === row && cell.col === col)
    );
  };

  return (
    <Card className="w-full max-w-4xl bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800">
      <CardHeader className="border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Leaf className="w-6 h-6 text-green-400" />
            <CardTitle className="text-gray-100 text-2xl">
              Garden Planner
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isGrouping ? "default" : "outline"}
              className="gap-2"
              onClick={() => {
                if (isGrouping) {
                  createGroup();
                } else {
                  setIsGrouping(true);
                  setSelectedPlantsForGroup([]);
                }
              }}
            >
              <Group size={16} />
              {isGrouping ? "Confirm Group" : "Create Group"}
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
            <h3 className="text-gray-300 text-sm font-medium mb-3">
              Available Plants
            </h3>
            <div className="flex gap-3 p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700">
              {Object.entries(plantData).map(([key, plant]) => (
                <div
                  key={key}
                  draggable
                  onDragStart={() => !isGrouping && setDraggedPlant(key)}
                  className="px-4 py-2 w-1/3 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg 
                    cursor-move hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200
                    shadow-md shadow-green-500/20"
                >
                  {plant.name}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div
              className="inline-grid grid-cols-8 gap-2 p-4 rounded-xl shadow-inner bg-opacity-90"
              style={soilStyle}
            >
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const group = getCellGroup(rowIndex, colIndex);
                  const isSelected = selectedPlantsForGroup.includes(
                    `${rowIndex},${colIndex}`
                  );
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`w-12 h-12 flex items-center justify-center relative transition-all duration-200
                        ${cell ? "bg-opacity-50" : "hover:bg-opacity-30 bg-opacity-10"} 
                        bg-white rounded-lg
                        ${isGrouping && cell ? "hover:ring-2 hover:ring-blue-500" : ""}
                        ${isSelected ? "ring-2 ring-blue-500" : ""}`}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (!isGrouping) {
                          handleDrop(rowIndex, colIndex);
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      {cell && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearTile(rowIndex, colIndex);
                            }}
                            className="absolute -top-1 -right-1 p-1 bg-red-500 hover:bg-red-600 
                              text-white rounded-full shadow-lg z-10 transition-all duration-200"
                          >
                            <X size={12} />
                          </button>
                          <PlantDetails
                            plant={plantData[cell]}
                            row={rowIndex}
                            col={colIndex}
                            groupNumber={group?.id}
                            groupColor={group?.color}
                            onClick={() => {
                              if (isGrouping) {
                                togglePlantSelection(rowIndex, colIndex);
                              }
                            }}
                            isGrouping={isGrouping}
                          />
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {message && (
            <Alert
              className={`mt-4 border ${
                message.type === "error"
                  ? "bg-red-500/10 border-red-500 text-red-500"
                  : message.type === "success"
                  ? "bg-green-500/10 border-green-500 text-green-500"
                  : "bg-blue-500/10 border-blue-500 text-blue-500"
              }`}
            >
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {isGrouping && (
            <div className="mt-4 text-sm text-gray-300">
              {selectedPlantsForGroup.length === 0
                ? "Click on plants to add them to the group"
                : `Selected ${selectedPlantsForGroup.length} plants - click "Confirm Group" to create group`}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default GardenPlanner;