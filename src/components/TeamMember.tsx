import React from 'react';
import { Mail, Linkedin, Twitter } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
}

export default function TeamMember({
  name,
  role,
  image,
  bio,
  email,
  linkedin,
  twitter
}: TeamMemberProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-primary-600 font-medium mb-3">{role}</p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{bio}</p>
        
        <div className="flex space-x-3">
          {email && (
            <a
              href={`mailto:${email}`}
              className="p-2 bg-gray-100 rounded-full hover:bg-primary-100 hover:text-primary-600 transition-colors duration-200"
              title="Send Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 rounded-full hover:bg-primary-100 hover:text-primary-600 transition-colors duration-200"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {twitter && (
            <a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 rounded-full hover:bg-primary-100 hover:text-primary-600 transition-colors duration-200"
              title="Twitter/X Profile"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}