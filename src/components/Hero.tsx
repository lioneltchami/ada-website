import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Heart, Globe, Play } from 'lucide-react';
import InteractiveButton from './InteractiveButton';
import ParallaxSection from './ParallaxSection';

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <motion.div 
          className="absolute top-0 left-0 w-64 h-64 bg-primary-500 rounded-full -translate-x-32 -translate-y-32"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500 rounded-full translate-x-32 translate-y-32"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            x: [0, -30, 0],
            y: [0, -50, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Additional floating shapes */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-32 h-32 bg-accent-400 rounded-full"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-primary-400 rounded-full"
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
            scale: [1, 0.9, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
              >
                <Heart className="w-5 h-5 text-primary-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Love Conquers All - Since 2021</span>
              </motion.div>

              <motion.h1 
                className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Empowering
                <motion.span 
                  className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent block"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  Communities
                </motion.span>
                in Cameroon
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Since 2021, Apoti Development Association (ADA) has been dedicated to supporting vulnerable communities, 
                helping widows, orphans, and young girls while promoting sustainable development across Cameroon.
              </motion.p>
            </div>

            {/* Animated Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {[
                { icon: Users, number: "500+", label: "Lives Impacted", color: "primary" },
                { icon: Heart, number: "25+", label: "Projects Completed", color: "secondary" },
                { icon: Globe, number: "10+", label: "Communities Served", color: "accent" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center group cursor-pointer"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className={`w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-${stat.color}-200 transition-colors duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </motion.div>
                  <motion.div 
                    className="text-2xl font-bold text-gray-900"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link to="/donate">
                <InteractiveButton
                  variant="primary"
                  size="lg"
                  icon={Heart}
                  className="group"
                >
                  Make a Donation
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </InteractiveButton>
              </Link>
              
              <Link to="/projects">
                <InteractiveButton
                  variant="outline"
                  size="lg"
                  icon={Play}
                >
                  View Our Projects
                </InteractiveButton>
              </Link>
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <ParallaxSection offset={30}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <motion.img
                  src="https://images.pexels.com/photos/6646/mother-child-africa-africa.jpg?auto=compress&cs=tinysrgb&w=800"
                  alt="Community support in Cameroon"
                  className="w-full h-96 object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Overlay content */}
                <motion.div
                  className="absolute bottom-4 left-4 right-4 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  <h3 className="text-lg font-semibold mb-1">Transforming Lives</h3>
                  <p className="text-sm text-gray-200">Through love, compassion, and community action</p>
                </motion.div>
              </div>
            </ParallaxSection>

            {/* Floating Achievement Card */}
            <motion.div 
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100"
              initial={{ opacity: 0, y: 20, rotate: -5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              whileHover={{ 
                scale: 1.05, 
                rotate: 2,
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Heart className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Making Impact</div>
                  <div className="text-xs text-gray-600">Since 2021 • ADA</div>
                </div>
              </div>
            </motion.div>

            {/* Additional floating elements */}
            <motion.div
              className="absolute top-4 right-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Globe className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}