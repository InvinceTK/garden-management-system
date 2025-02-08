"use client";
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import GardenPlanner  from './GardenPlanner';
import Link from 'next/link';

const GardenPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-green-800 text-center mb-8">Garden Planning & AI Tools</h1>
        
        {/* Instructions */}
        <Card className="mb-8 bg-green-50 border-green-200">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4">How to Use the Garden Planner</h2>
            <div className="space-y-2 text-green-700">
              <p>1. Drag and drop plants from the selection onto the grid</p>
              <p>2. Click "Group Plants" to create plant groupings by clicking and dragging</p>
              <p>3. Use "Remove Groups" to delete groupings by clicking on them</p>
              <p>4. Click the X on any plant to remove it from the grid</p>
              <p>5. Hover over plants to see detailed information</p>
            </div>
          </CardContent>
        </Card>

        {/* Centered Garden Planner */}
        <div className="flex justify-center mb-12">
          <GardenPlanner />
        </div>

        {/* AI Features Cards */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Link href="/plant-disease">
            <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="aspect-video bg-green-100 mb-4 rounded-lg overflow-hidden">
                  <img 
                    src="/api/placeholder/800/400" 
                    alt="Plant Disease Detection" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-green-800 mb-2">Plant Disease Detection</h3>
                <p className="text-green-700">Upload photos of your plants to detect and diagnose diseases using AI</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/weed-detection">
            <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="aspect-video bg-green-100 mb-4 rounded-lg overflow-hidden">
                  <img 
                    src="/api/placeholder/800/400" 
                    alt="Weed Detection" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-green-800 mb-2">Weed Detection</h3>
                <p className="text-green-700">Identify unwanted weeds in your garden with AI-powered detection</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GardenPage;