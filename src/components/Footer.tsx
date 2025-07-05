import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Apoti Development Association</h3>
                <p className="text-gray-400 text-sm">Empowering Communities Since 2021</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              We are dedicated to supporting vulnerable communities in Cameroon, helping widows, orphans, 
              young girls, and promoting sustainable community development across our region.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-primary-400 transition-colors duration-200">About Us</Link></li>
              <li><Link to="/projects" className="text-gray-300 hover:text-primary-400 transition-colors duration-200">Our Projects</Link></li>
              <li><Link to="/team" className="text-gray-300 hover:text-primary-400 transition-colors duration-200">Meet the Team</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-primary-400 transition-colors duration-200">Contact Us</Link></li>
              <li><Link to="/donate" className="text-gray-300 hover:text-primary-400 transition-colors duration-200">Donate</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300 text-sm">Cameroon, Central Africa</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300 text-sm">info@apotidevelopment.org</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300 text-sm">+237 XXX XXX XXX</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Apoti Development Association. All rights reserved. | 
            <span className="text-primary-400"> Making a difference since 2021</span>
          </p>
        </div>
      </div>
    </footer>
  );
}