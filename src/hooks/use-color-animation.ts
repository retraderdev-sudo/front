'use client';

import { useState, useEffect } from 'react';

// Define 5 beautiful color combinations for the animation
const colorSets = [
  {
    text: 'from-blue-500 to-purple-600',
    button: 'from-red-500 to-pink-600',
    textGradient: 'bg-gradient-to-r from-blue-500 to-purple-600',
    buttonGradient: 'bg-gradient-to-r from-red-500 to-pink-600',
  },
  {
    text: 'from-emerald-500 to-teal-600',
    button: 'from-orange-500 to-red-600',
    textGradient: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    buttonGradient: 'bg-gradient-to-r from-orange-500 to-red-600',
  },
  {
    text: 'from-violet-500 to-purple-600',
    button: 'from-cyan-500 to-blue-600',
    textGradient: 'bg-gradient-to-r from-violet-500 to-purple-600',
    buttonGradient: 'bg-gradient-to-r from-cyan-500 to-blue-600',
  },
  {
    text: 'from-rose-500 to-pink-600',
    button: 'from-lime-500 to-green-600',
    textGradient: 'bg-gradient-to-r from-rose-500 to-pink-600',
    buttonGradient: 'bg-gradient-to-r from-lime-500 to-green-600',
  },
  {
    text: 'from-amber-500 to-orange-600',
    button: 'from-indigo-500 to-purple-600',
    textGradient: 'bg-gradient-to-r from-amber-500 to-orange-600',
    buttonGradient: 'bg-gradient-to-r from-indigo-500 to-purple-600',
  },
];

export function useColorAnimation() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);

      // Change color after animation starts
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % colorSets.length);
        setIsAnimating(false);
      }, 300); // Half of the transition duration
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const currentColors = colorSets[currentIndex];

  return {
    currentColors,
    isAnimating,
    textClasses: `bg-gradient-to-r ${currentColors.text} bg-clip-text text-transparent transition-all duration-600 ${
      isAnimating ? 'animate-pulse' : ''
    }`,
    buttonClasses: `bg-gradient-to-r ${currentColors.button} hover:shadow-lg transition-all duration-600 ${
      isAnimating ? 'animate-pulse' : ''
    }`,
  };
}
