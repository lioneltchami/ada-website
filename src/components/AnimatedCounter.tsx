import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'primary' | 'secondary' | 'accent';
}

export default function AnimatedCounter({
  end,
  duration = 2,
  suffix = '',
  prefix = '',
  label,
  icon: Icon,
  color = 'primary'
}: AnimatedCounterProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3
  });

  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    accent: 'bg-accent-100 text-accent-600'
  };

  return (
    <motion.div
      ref={ref}
      className="text-center group"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className={`w-16 h-16 ${colorClasses[color]} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
        <Icon className="w-8 h-8" />
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">
        {inView && (
          <CountUp
            start={0}
            end={end}
            duration={duration}
            prefix={prefix}
            suffix={suffix}
          />
        )}
      </div>
      <div className="text-gray-600">{label}</div>
    </motion.div>
  );
}