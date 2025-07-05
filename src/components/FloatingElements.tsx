import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Sparkles } from 'lucide-react';

export default function FloatingElements() {
  // Reduced number of elements for better performance
  const elements = [
    { Icon: Heart, delay: 0, duration: 12, x: '10%', y: '20%' },
    { Icon: Star, delay: 3, duration: 15, x: '80%', y: '30%' },
    { Icon: Sparkles, delay: 6, duration: 18, x: '20%', y: '70%' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute opacity-5"
          style={{ left: element.x, top: element.y }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <element.Icon className="w-6 h-6 text-primary-300" />
        </motion.div>
      ))}
    </div>
  );
}