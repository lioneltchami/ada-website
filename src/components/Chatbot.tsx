import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Mail, Phone, ExternalLink } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

interface ChatbotProps {
  onEmailRequest?: (email: string, subject: string, message: string) => void;
}

export default function Chatbot({ onEmailRequest }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setTimeout(() => {
        addBotMessage(
          "Hello! I'm here to help you learn about Apoti Development Association (ADA). I can answer questions about our projects, team, how to donate, volunteer opportunities, and more. How can I assist you today?",
          [
            { label: "Our Projects", action: () => handleQuickAction("Tell me about your projects") },
            { label: "How to Donate", action: () => handleQuickAction("How can I donate?") },
            { label: "Volunteer", action: () => handleQuickAction("How can I volunteer?") },
            { label: "Contact Info", action: () => handleQuickAction("How can I contact you?") }
          ]
        );
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (text: string, actions?: Array<{ label: string; action: () => void }>) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      actions
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const handleQuickAction = (question: string) => {
    addUserMessage(question);
    handleBotResponse(question);
  };

  const handleBotResponse = (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('project') || lowerMessage.includes('work') || lowerMessage.includes('program')) {
        addBotMessage(
          "ADA focuses on several key areas: Supporting widows through skills training and resources, providing education and care for orphans, empowering young women with vocational training, and community development projects including clean-up initiatives. Our current major projects include the Widow Support Program in Bamenda, Education for Orphans in Douala, and Young Women Empowerment in Yaounde.",
          [
            { label: "View Projects Page", action: () => window.location.href = '/projects' },
            { label: "See Photo Gallery", action: () => window.location.href = '/gallery' }
          ]
        );
      } else if (lowerMessage.includes('donate') || lowerMessage.includes('donation') || lowerMessage.includes('money')) {
        addBotMessage(
          "Thank you for your interest in supporting ADA's mission! You can make a secure donation through our website. We accept one-time and monthly recurring donations. 95% of all donations go directly to our programs. Even $25 can provide school supplies for 2 orphaned children for a month!",
          [
            { label: "Donate Now", action: () => window.location.href = '/donate' },
            { label: "Learn About Impact", action: () => handleQuickAction("What impact does my donation make?") }
          ]
        );
      } else if (lowerMessage.includes('volunteer') || lowerMessage.includes('help') || lowerMessage.includes('join')) {
        addBotMessage(
          "We'd love to have you join the ADA team! We have opportunities for both local volunteers in Cameroon and remote supporters worldwide. You can help with project implementation, fundraising, social media, or professional services. We also welcome corporate partnerships.",
          [
            { label: "Contact Us", action: () => window.location.href = '/contact' },
            { label: "Send Email", action: () => handleEmailRequest('volunteer') }
          ]
        );
      } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email') || lowerMessage.includes('phone')) {
        addBotMessage(
          "You can reach ADA at info@apotidevelopment.org or call us at +237 XXX XXX XXX (Mon-Fri 8AM-5PM CAT). We're based in Cameroon, Central Africa. We typically respond to emails within 24 hours.",
          [
            { label: "Contact Form", action: () => window.location.href = '/contact' },
            { label: "Send Email Now", action: () => handleEmailRequest('general') }
          ]
        );
      } else if (lowerMessage.includes('team') || lowerMessage.includes('staff') || lowerMessage.includes('who')) {
        addBotMessage(
          "ADA's team is led by Founder Marie Ngozi and includes dedicated professionals like Program Director Jean-Paul Mbah, Community Outreach Coordinator Grace Tembon, and specialists in women's empowerment and youth programs. We have 12 full-time team members and over 50 volunteers.",
          [
            { label: "Meet the Team", action: () => window.location.href = '/team' },
            { label: "Our Story", action: () => window.location.href = '/about' }
          ]
        );
      } else if (lowerMessage.includes('impact') || lowerMessage.includes('result') || lowerMessage.includes('difference')) {
        addBotMessage(
          "Since 2021, ADA has impacted over 500 lives directly! We've completed 25+ projects across 10+ communities. Our programs have supported 45 widows, provided education for 120 orphans, and trained 80 young women in vocational skills. Every dollar donated creates lasting change.",
          [
            { label: "View Impact Stories", action: () => window.location.href = '/projects' },
            { label: "See Gallery", action: () => window.location.href = '/gallery' }
          ]
        );
      } else if (lowerMessage.includes('about') || lowerMessage.includes('history') || lowerMessage.includes('story') || lowerMessage.includes('began') || lowerMessage.includes('ada')) {
        addBotMessage(
          "Apoti Development Association (ADA) was founded in 2021 by passionate individuals who saw the need to support vulnerable communities in Cameroon. We started small but have grown into a comprehensive organization addressing poverty, inequality, and lack of opportunities through sustainable, community-led programs.",
          [
            { label: "Read Our Full Story", action: () => window.location.href = '/about' },
            { label: "Our Mission & Vision", action: () => handleQuickAction("What is your mission?") }
          ]
        );
      } else if (lowerMessage.includes('mission') || lowerMessage.includes('vision') || lowerMessage.includes('goal')) {
        addBotMessage(
          "ADA's mission is to empower vulnerable communities in Cameroon through sustainable programs that support widows, orphans, and young girls while promoting community development. Our vision is a Cameroon where every person has access to opportunities for growth, education, and a dignified life free from poverty.",
          [
            { label: "Learn More About ADA", action: () => window.location.href = '/about' }
          ]
        );
      } else if (lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('cameroon')) {
        addBotMessage(
          "ADA is based in Cameroon, Central Africa, and works across multiple regions including Bamenda, Douala, Yaounde, and rural communities in the Northwest Region. Our projects reach both urban and rural areas where the need is greatest."
        );
      } else {
        addBotMessage(
          "I'd be happy to help you with information about ADA's projects, donation process, volunteer opportunities, team, or anything else about Apoti Development Association. Could you please be more specific about what you'd like to know?",
          [
            { label: "Our Projects", action: () => handleQuickAction("Tell me about your projects") },
            { label: "How to Help", action: () => handleQuickAction("How can I help?") },
            { label: "Contact Human", action: () => handleEmailRequest('general') }
          ]
        );
      }
    }, 1000 + Math.random() * 1000);
  };

  const handleEmailRequest = (type: 'general' | 'volunteer' | 'donation') => {
    const subjects = {
      general: 'General Inquiry from Website Chat',
      volunteer: 'Volunteer Interest from Website Chat',
      donation: 'Donation Inquiry from Website Chat'
    };
    
    const message = `Hello,

I was chatting with your website assistant and would like to get in touch with a human team member from ADA.

Type of inquiry: ${type}

Please contact me at your earliest convenience.

Thank you!`;

    if (onEmailRequest) {
      onEmailRequest('info@apotidevelopment.org', subjects[type], message);
    } else {
      // Fallback to mailto
      const mailtoLink = `mailto:info@apotidevelopment.org?subject=${encodeURIComponent(subjects[type])}&body=${encodeURIComponent(message)}`;
      window.location.href = mailtoLink;
    }
    
    addBotMessage("I've prepared an email for you to send to the ADA team. They'll get back to you within 24 hours!");
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addUserMessage(inputValue);
      handleBotResponse(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40 ${isOpen ? 'hidden' : 'block'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">ADA Assistant</h3>
                  <p className="text-xs text-primary-100">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === 'user' 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`rounded-2xl px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        {message.actions && (
                          <div className="mt-3 space-y-2">
                            {message.actions.map((action, index) => (
                              <button
                                key={index}
                                onClick={action.action}
                                className="block w-full text-left px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs transition-colors duration-200"
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}