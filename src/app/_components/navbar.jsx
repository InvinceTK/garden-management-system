import React, { useState, useEffect } from 'react';
import { Menu, X, Leaf, Camera } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '/', text: 'Home', icon: Leaf },
    { href: '/garden-planner', text: 'Garden Planner', icon: Leaf },
    { href: '/plant-disease', text: 'Disease Detection', icon: Camera },
    { href: '/weed-detection', text: 'Weed Detection', icon: Camera },
    { href: '/plant-library', text: 'Plant Library', icon: Leaf },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full z-50 bg-white transition-all duration-200 
      ${scrolled ? 'shadow-md' : 'border-b border-green-200'}`}>
      <div className="w-full h-14 sm:h-16">
        <div className="flex justify-between items-center h-full">
          {/* Logo and Brand - Now at the very left */}
          <a href="/" className="flex items-center space-x-2 shrink-0 pl-4 sm:pl-6 lg:pl-8">
            <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-green-700" />
            <span className="text-lg sm:text-2xl font-bold text-green-800">OpenGarden</span>
          </a>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center space-x-4 lg:space-x-8 px-4">
            {links.map(({ href, text, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className="flex items-center space-x-1 text-sm lg:text-xl text-green-700 hover:text-green-900 
                  transition-colors py-1 px-2 rounded-md hover:bg-green-50"
              >
                <Icon className="h-4 w-4" />
                <span>{text}</span>
              </a>
            ))}
          </div>

          {/* Mobile Menu Button - At the right */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 mr-4 sm:mr-6 lg:mr-8 text-green-700 hover:text-green-900 hover:bg-green-50 rounded-md"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-2 border-t border-green-100">
            {links.map(({ href, text, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className="flex items-center space-x-2 px-4 py-2.5 text-green-700 hover:bg-green-50 
                  transition-colors rounded-md text-sm"
                onClick={() => setIsOpen(false)}
              >
                <Icon className="h-4 w-4" />
                <span>{text}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;