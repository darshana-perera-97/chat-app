import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatBubbleLeftRightIcon, UserGroupIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Real-time Chat',
      description: 'Instant messaging with real-time updates and typing indicators.'
    },
    {
      icon: UserGroupIcon,
      title: 'User Management',
      description: 'Easy user discovery and conversation management.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Authentication',
      description: 'Google OAuth integration for secure user authentication.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to ChatApp
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A modern chat application with Google Sign-In and real-time messaging
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/chat')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Chatting
          </button>
          <button
            onClick={() => navigate('/users')}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Browse Users
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 py-12">
        {features.map((feature, index) => (
          <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-4">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          App Statistics
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">100+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">1K+</div>
            <div className="text-gray-600">Messages Sent</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">50+</div>
            <div className="text-gray-600">Conversations</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-gray-600 mb-6">
          Join thousands of users who are already chatting on our platform
        </p>
        <button
          onClick={() => navigate('/chat')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Get Started Now
        </button>
      </div>
    </div>
  );
};

export default HomePage;
