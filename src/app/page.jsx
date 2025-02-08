"use client";
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import GardenPlanner from './GardenPlanner';
import Navbar from './_components/navbar';

const GardenPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 mt-16">
        {/* Instructions Card - More compact on mobile */}
        <Card className="mb-4 sm:mb-8 bg-green-50 border-green-200">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-3 sm:mb-4">
              How to Use the Garden Planner
            </h2>
            <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-green-700">
              <p>1. Drag and drop plants from the selection onto the grid</p>
              <p>2. Click "Group Plants" to create plant groupings by clicking and dragging</p>
              <p>3. Use "Remove Groups" to delete groupings by clicking on them</p>
              <p>4. Click the X on any plant to remove it from the grid</p>
              <p>5. Hover over plants to see detailed information</p>
            </div>
          </CardContent>
        </Card>

        {/* Centered Garden Planner - Adjusts size based on screen */}
        <div className="flex justify-center mb-6 sm:mb-12">
          <div className="w-full max-w-[800px]">
            <GardenPlanner />
          </div>
        </div>

        {/* AI Features Cards - Stack on mobile, grid on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-12">
          {/* Plant Disease Detection Card
          
          <a href="/plant-disease" className="block">
            <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow h-full">
              <CardContent className="p-4 sm:p-6">
                <div className="aspect-video bg-green-100 rounded-lg overflow-hidden mb-3 sm:mb-4">
                  <img 
                    src="/api/placeholder/800/400" 
                    alt="Plant Disease Detection" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-green-800 mb-2">
                  Plant Disease Detection
                </h3>
                <p className="text-sm sm:text-base text-green-700">
                  Upload photos of your plants to detect and diagnose diseases using AI
                </p>
              </CardContent>
            </Card>
          </a> */}

          {/* Weed Detection Card */}
          <a href="/weed-detection" className="block">
            <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow h-full">
              <CardContent className="p-4 sm:p-6">
                <div className="aspect-video bg-green-100 rounded-lg overflow-hidden mb-3 sm:mb-4">
                  <img 
                    src="/api/placeholder/800/400" 
                    alt="Weed Detection" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-green-800 mb-2">
                  Weed Detection
                </h3>
                <p className="text-sm sm:text-base text-green-700">
                  Identify unwanted weeds in your garden with AI-powered detection
                </p>
              </CardContent>
            </Card>
          </a>
        </div>
      </div>
    </div>
  );
};

export default GardenPage;