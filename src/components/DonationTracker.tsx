import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Target, Users, Calendar, Gift } from 'lucide-react';

interface DonationGoal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'emergency' | 'project' | 'general';
  donors: number;
  recentDonations: {
    amount: number;
    donor: string;
    message?: string;
    timestamp: string;
  }[];
}

interface DonationTrackerProps {
  goals: DonationGoal[];
  showRecentDonations?: boolean;
}

export default function DonationTracker({ goals, showRecentDonations = true }: DonationTrackerProps) {
  const [selectedGoal, setSelectedGoal] = useState(0);

  useEffect(() => {
    // Animate the progress bars
    const timer = setTimeout(() => {
      // Animation logic would go here
    }, 500);
    return () => clearTimeout(timer);
  }, [goals]);

  const currentGoal = goals[selectedGoal];
  const progressPercentage = (currentGoal.currentAmount / currentGoal.targetAmount) * 100;

  const categoryColors = {
    emergency: 'from-red-500 to-red-600',
    project: 'from-blue-500 to-blue-600',
    general: 'from-green-500 to-green-600'
  };

  const categoryBadgeColors = {
    emergency: 'bg-red-100 text-red-800',
    project: 'bg-blue-100 text-blue-800',
    general: 'bg-green-100 text-green-800'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Target className="w-8 h-8 text-primary-500 mr-3" />
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
            Current Fundraising Goals
          </h3>
        </div>
        <p className="text-gray-600">
          Help us reach our targets and make an even greater impact in our communities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Goal Selection */}
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <motion.button
              key={goal.id}
              onClick={() => setSelectedGoal(index)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedGoal === index
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryBadgeColors[goal.category]}`}>
                  {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
              
              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 bg-gradient-to-r ${categoryColors[goal.category]} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-gray-600">
                    ${goal.currentAmount.toLocaleString()} raised
                  </span>
                  <span className="font-semibold text-gray-900">
                    ${goal.targetAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Selected Goal Details */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-gray-900">{currentGoal.title}</h4>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryBadgeColors[currentGoal.category]}`}>
                {currentGoal.category.charAt(0).toUpperCase() + currentGoal.category.slice(1)}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{currentGoal.description}</p>

            {/* Large Progress Circle */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeLinecap="round"
                  className="text-primary-500"
                  initial={{ strokeDasharray: "0 314" }}
                  animate={{ strokeDasharray: `${(progressPercentage / 100) * 314} 314` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(progressPercentage)}%
                  </div>
                  <div className="text-xs text-gray-600">Complete</div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center bg-white p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">
                  ${currentGoal.currentAmount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Raised</div>
              </div>
              <div className="text-center bg-white p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{currentGoal.donors}</div>
                <div className="text-xs text-gray-600">Donors</div>
              </div>
            </div>

            {/* Deadline */}
            <div className="flex items-center justify-center text-gray-600 mb-6">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">Deadline: {currentGoal.deadline}</span>
            </div>

            {/* Donate Button */}
            <button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl">
              Donate to This Goal
            </button>
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      {showRecentDonations && currentGoal.recentDonations.length > 0 && (
        <div className="mt-8 border-t border-gray-200 pt-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Gift className="w-5 h-5 mr-2 text-primary-500" />
            Recent Donations
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {currentGoal.recentDonations.map((donation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900">{donation.donor}</div>
                  {donation.message && (
                    <div className="text-sm text-gray-600 italic">"{donation.message}"</div>
                  )}
                  <div className="text-xs text-gray-500">{donation.timestamp}</div>
                </div>
                <div className="text-lg font-bold text-green-600">
                  ${donation.amount.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}