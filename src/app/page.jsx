'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, ShieldCheck, Sprout } from 'lucide-react';
import GardenPlanner from './GardenPlanner';
import Navbar from './_components/navbar';
import './animations.css';
import ImageUpload from './_components/imageUpload';
import dynamic from 'next/dynamic';

// Dynamic import of BasicScene
const BasicScene = dynamic(() => import('./_components/BasicScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-zinc-900 rounded-lg flex items-center justify-center text-white">
      Loading 3D Scene...
    </div>
  ),
});

const GardenPage = () => {
  // Intersection Observer for scroll animations
  const observeElement = (element) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    observer.observe(element);
    return () => observer.disconnect();
  };

  // Ref for scroll animations
  const featuresRef = useRef(null);
  const guideRef = useRef(null);
  const plannerRef = useRef(null);
  const toolsRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    // Initialize scroll animations
    const elements = [featuresRef, guideRef, plannerRef, toolsRef, sceneRef];
    elements.forEach(ref => {
      if (ref.current) {
        observeElement(ref.current);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="relative">
        {/* Background Image */}
        <Image
          src="/g.jpg"
          alt="Garden background"
          fill
          priority
          className="object-cover opacity-40 z-0"  
          sizes="100vw"  
          quality={100}  
        />
      
        {/* Content */}
        <div className="relative z-10 py-12 md:py-20 border-b border-green-500/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="py-10 text-4xl md:text-5xl font-bold text-green-400 mb-4 animate-slide-up">
                Smart Garden Planning Made Simple
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 mb-8 animate-slide-up stagger-delay-1">
                Design your perfect garden with AI-powered tools and expert guidance
              </p>
              <div className="flex flex-wrap justify-center gap-4 animate-slide-up stagger-delay-2">
                <Button 
                  className="bg-green-600 hover:bg-green-500 text-black font-semibold px-6 py-2 hover-lift animate-pulse-glow"
                  onClick={() => document.getElementById('planner').scrollIntoView({ behavior: 'smooth' })}
                >
                  Start Planning
                </Button>
                <Button 
                  variant="outline" 
                  className="border-green-500 text-green-400 hover:bg-green-500/10 px-6 py-2 hover-lift"
                >
                  Watch Tutorial
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Feature Cards with Scroll Animation */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 section-fade-in">
          {[
            {
              icon: Sprout,
              title: "Drag & Drop Planning",
              description: "Easily design your garden layout with intuitive drag and drop tools"
            },
            {
              icon: ShieldCheck,
              title: "AI-Powered Protection",
              description: "Detect and prevent plant diseases and weeds with advanced AI"
            },
            {
              icon: Leaf,
              title: "Smart Recommendations",
              description: "Get personalized plant grouping and care recommendations"
            }
          ].map((feature, index) => (
            <Card key={index} className="bg-zinc-900 border-green-500/20 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 transition-all hover-scale">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                  <feature.icon className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>


        {/* Right side - Content */}
          
        <div className="bg-black min-h-screen flex items-center">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {/* Left side - Content */}
      <div className="p-4 text-left">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-green-400">
          Smart Garden Management
        </h1>
        <p className="text-lg md:text-xl text-zinc-300 mb-8 leading-relaxed">
          Keep your garden healthy with AI-powered weed detection and smart notifications. 
          Get real-time alerts and personalized recommendations for your garden's needs.
        </p>
        
        {/* Feature List */}
        <ul className="space-y-4">
          {[
            'AI-powered weed detection',
            'Real-time alert notifications',
            'Personalized care recommendations'
          ].map((feature, index) => (
            <li 
              key={index}
              className="flex items-center text-zinc-400 text-lg"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Right side - Phone Images */}
      <div className="relative h-[600px] flex items-center justify-center">
        {/* Second Phone */}
        <div className="absolute transform rotate-12 -translate-x-8">
          <Image 
            src="/ip.png"
            alt="App Interface"
            width={560}
            height={1120}
            className="rounded-3xl shadow-2xl"
            priority
          />
        </div>
      </div>
    </div>
  </div>
</div>


        {/* Quick Start Guide with Scroll Animation */}
        <div ref={guideRef} className="section-fade-in">
          <Card className="mb-8 bg-gradient-to-r from-zinc-900 to-zinc-800 border-green-500/20 hover-scale">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center mr-3 text-green-400 animate-pulse-glow">
                💡
                </span>
                Quick Start Guide
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Design Your Layout",
                    description: "Drag and drop plants onto the grid to create your garden layout"
                  },
                  {
                    title: "Group Plants",
                    description: "Create plant groupings by clicking and dragging selections"
                  },
                  {
                    title: "Fine-tune",
                    description: "Adjust your design and get AI-powered recommendations"
                  }
                ].map((step, index) => (
                  <div key={index} className="flex items-start hover-lift">
                    <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center mr-3 text-green-400 font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-400 mb-1">{step.title}</h3>
                      <p className="text-zinc-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Garden Planner with Scroll Animation */}
        <div id="planner" ref={plannerRef} className="scroll-mt-16 section-fade-in">
          <div className="flex justify-center mb-12">
            <div className="w-full max-w-7xl bg-zinc-900 p-6 rounded-lg border border-green-500/20 hover-scale">
              <GardenPlanner />
            </div>
          </div>
        </div>

        {/* AI Tools Section with Scroll Animation */}
<ImageUpload />

        {/* 3D Garden Visualization */}
        <div className="mt-16 mb-12">
          <Card className="w-full bg-zinc-900 border-green-500/20">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-green-400 mb-6">Interactive 3D Garden Preview</h2>
              <div className="w-full h-[800px] bg-zinc-900 rounded-lg overflow-hidden">
                <BasicScene />
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
);
};
export default GardenPage;