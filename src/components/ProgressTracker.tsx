import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle, Clock, Target } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  color: 'primary' | 'secondary' | 'accent';
}

interface ProgressTrackerProps {
  goals: Goal[];
  title?: string;
}

export default function ProgressTracker({ goals, title = "Our 2024 Goals" }: ProgressTrackerProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const statusIcons = {
    completed: CheckCircle,
    'in-progress': Clock,
    upcoming: Target
  };

  const statusColors = {
    completed: 'text-green-600 bg-green-100',
    'in-progress': 'text-blue-600 bg-blue-100',
    upcoming: 'text-yellow-600 bg-yellow-100'
  };

  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    accent: 'from-accent-500 to-accent-600'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600">
          Track our progress towards making an even greater impact in our communities
        </p>
      </div>

      <div ref={ref} className="space-y-6">
        {goals.map((goal, index) => {
          const StatusIcon = statusIcons[goal.status];
          const percentage = Math.min((goal.current / goal.target) * 100, 100);
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusColors[goal.status]}`}>
                      <StatusIcon className="w-4 h-4" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {goal.title}
                    </h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {goal.description}
                  </p>
                  <div className="text-sm text-gray-500">
                    Deadline: {goal.deadline}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {goal.current}
                    <span className="text-lg text-gray-500">/{goal.target}</span>
                  </div>
                  <div className="text-sm text-gray-600">{goal.unit}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${colorClasses[goal.color]} rounded-full`}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${percentage}%` } : { width: 0 }}
                    transition={{ duration: 1.5, delay: index * 0.2 }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">
                    {percentage.toFixed(0)}% Complete
                  </span>
                  <span className={`text-sm font-medium ${
                    goal.status === 'completed' ? 'text-green-600' :
                    goal.status === 'in-progress' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>
                    {goal.status === 'completed' ? 'Completed' :
                     goal.status === 'in-progress' ? 'In Progress' :
                     'Upcoming'}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}