import React from 'react';
import { NotebookPen, BookOpen, Archive, LogOut, Flame, Info, Bell, Plus } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  userProfile: UserProfile | null;
  currentView: 'article' | 'notebook' | 'archive' | 'about';
  onViewChange: (view: 'article' | 'notebook' | 'archive' | 'about') => void;
  onSignOut: () => void;
  onNotificationSettings: () => void;
  onAdminPanel: () => void;
}

export default function Header({ userProfile, currentView, onViewChange, onSignOut, onNotificationSettings, onAdminPanel }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50" id="header">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <NotebookPen className="w-8 h-8 text-emerald-600" />
          <h1 className="text-xl font-bold text-gray-900">The Climate Note</h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-8" id="navigation">
          <button
            onClick={() => onViewChange('article')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'article'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <NotebookPen className="w-4 h-4" />
            <span className="font-medium">Today</span>
          </button>
          
          <button
            onClick={() => onViewChange('notebook')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'notebook'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="font-medium">Notebook</span>
          </button>
          
          <button
            onClick={() => onViewChange('archive')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'archive'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Archive className="w-4 h-4" />
            <span className="font-medium">Archive</span>
          </button>
          
          <button
            onClick={() => onViewChange('about')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'about'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Info className="w-4 h-4" />
            <span className="font-medium">About</span>
          </button>
        </nav>

        {/* User Info */}
        <div className="flex items-center space-x-4" id="user-info">
          {userProfile && (
            <div className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-lg" id="streak-counter">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-semibold text-orange-700">{userProfile.streak}</span>
              <span className="text-sm text-orange-600">day streak</span>
            </div>
          )}
          
          <button
            onClick={onAdminPanel}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Add Article (Admin)"
          >
            <Plus className="w-4 h-4" />
          </button>
          
          <button
            onClick={onNotificationSettings}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Notification Settings"
          >
            <Bell className="w-4 h-4" />
          </button>
          
          <button
            onClick={onSignOut}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}