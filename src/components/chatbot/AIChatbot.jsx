import React from 'react';
import { Bot, MessageCircle, Info } from 'lucide-react';

const AIChatbot = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Chatbot Support</h1>
        <p className="text-gray-600">
          Get instant support and guidance through our AI-powered mental health assistant
        </p>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-12 text-center border border-blue-100">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <Bot className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Chatbot Coming Soon</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            We're developing an intelligent AI assistant that will provide 24/7 mental health support, 
            coping strategies, and personalized guidance.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-sm text-gray-600">
              Get immediate responses to your mental health questions anytime
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Bot className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Personalized Guidance</h3>
            <p className="text-sm text-gray-600">
              Receive tailored coping strategies based on your specific needs
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Info className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Evidence-Based</h3>
            <p className="text-sm text-gray-600">
              Advice grounded in proven therapeutic techniques and practices
            </p>
          </div>
        </div>

        {/* Notification Signup */}
        <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200 max-w-md mx-auto">
          <h4 className="font-semibold text-gray-900 mb-2">Get Notified When It's Ready</h4>
          <p className="text-sm text-gray-600 mb-4">
            Be the first to know when our AI chatbot is available
          </p>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Notify Me
            </button>
          </div>
        </div>
      </div>

      {/* Information Box */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-amber-800">Important Note</h4>
            <p className="text-sm text-amber-700 mt-1">
              While our AI chatbot will provide valuable support and guidance, it's not a replacement for 
              professional mental health care. Always consult with a qualified therapist for personalized 
              treatment and serious mental health concerns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;