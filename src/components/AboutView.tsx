import React from 'react';
import { NotebookPen, Heart, Globe, Shield, FileText } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
          <NotebookPen className="w-8 h-8 sm:w-12 sm:h-12 text-emerald-600" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">About The Climate Note</h1>
        </div>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
          Turning environmental awareness into daily action, one note at a time
        </p>
      </div>

      {/* Founder's Note */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center space-x-2">
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
          <span>Founder's Note</span>
        </h2>

        <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-800 leading-relaxed space-y-4 sm:space-y-6">
          <p>
            I'm Siyeong (John) Park, founder of The Climate Note and an aspiring environmental scientist. 
            As I approached climate change in various perspectives, through scientific research, policies, 
            and running various related projects.
          </p>
          
          <p>
            After trying to understand this big issue of climate change in small bites, I realized the 
            importance of <span className="font-semibold text-emerald-600">taking action</span>. Also, 
            I realized that most of our generation is aware of the problems and the actions that we could 
            take to mitigate climate change.
          </p>
          
          <p>
            The Climate Note is different from other newsletters in a way we encourage
            <span className="font-semibold text-emerald-600"> you to take actions</span> for the environment.
            Through our articles, and the 'climate note' function, we will help you think more about your
            actions and remind you of a small habit to fix.
          </p>
          
          <p className="text-center text-base sm:text-lg lg:text-xl font-semibold">
            <span className="text-emerald-600">Together, I am confident that climate change is solvable.</span>
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="text-center p-4 sm:p-6 bg-emerald-50 rounded-lg">
          <NotebookPen className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 mx-auto mb-3 sm:mb-4" />
          <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2">Daily Insights</h3>
          <p className="text-gray-600 text-sm">
            Fresh environmental stories and actionable insights delivered every day
          </p>
        </div>

        <div className="text-center p-4 sm:p-6 bg-emerald-50 rounded-lg">
          <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 mx-auto mb-3 sm:mb-4" />
          <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2">Action-Focused</h3>
          <p className="text-gray-600 text-sm">
            Turn reading into action with personal climate notes and habit tracking
          </p>
        </div>

        <div className="text-center p-4 sm:p-6 bg-emerald-50 rounded-lg">
          <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 mx-auto mb-3 sm:mb-4" />
          <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2">Community Impact</h3>
          <p className="text-gray-600 text-sm">
            Join a community of young environmental champions making a difference
          </p>
        </div>
      </div>
      
      {/* Legal Links */}
      <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Legal Information</h2>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <a 
            href="/privacy-policy" 
            className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Privacy Policy</h3>
                <p className="text-sm text-gray-600">How we protect your data</p>
              </div>
            </div>
          </a>
          
          <a 
            href="/terms-of-service" 
            className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Terms of Service</h3>
                <p className="text-sm text-gray-600">App usage guidelines</p>
              </div>
            </div>
          </a>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            By using The Climate Note, you agree to our terms and privacy practices.
          </p>
        </div>
      </div>
    </div>
  );
}