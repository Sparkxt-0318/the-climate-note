import React, { useState } from 'react';
import { NotebookPen, BookOpen, Archive, LogOut, Flame, Info, Bell, Plus, FileEdit, CheckSquare, Menu, X } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  userProfile: UserProfile | null;
  currentView: 'article' | 'notebook' | 'archive' | 'about';
  onViewChange: (view: 'article' | 'notebook' | 'archive' | 'about') => void;
  onSignOut: () => void;
  onNotificationSettings: () => void;
  onAdminPanel: () => void;
  onWriterPanel?: () => void;
  onArticleReview?: () => void;
}

export default function Header({ userProfile, currentView, onViewChange, onSignOut, onNotificationSettings, onAdminPanel, onWriterPanel, onArticleReview }: HeaderProps) {
  const isAdmin = userProfile?.role === 'admin';
  const isWriter = userProfile?.role === 'writer' || isAdmin;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50" id="header">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <NotebookPen className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
          <h1 className="text-base sm:text-xl font-bold text-gray-900">The Climate Note</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8" id="navigation">
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
        <div className="flex items-center space-x-2 sm:space-x-4" id="user-info">
          {userProfile && (
            <div className="flex items-center space-x-1 sm:space-x-2 bg-orange-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg" id="streak-counter">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
              <span className="font-semibold text-sm sm:text-base text-orange-700">{userProfile.streak}</span>
              <span className="text-xs sm:text-sm text-orange-600 hidden xs:inline">day streak</span>
            </div>
          )}
          

          <div className="hidden lg:flex items-center space-x-2">
            {isWriter && (
              <button
                onClick={onAdminPanel}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title={isAdmin ? "Add Article" : "Create Article"}
              >
                <Plus className="w-4 h-4" />
              </button>
            )}

            {isWriter && onWriterPanel && (
              <button
                onClick={onWriterPanel}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="My Articles"
              >
                <FileEdit className="w-4 h-4" />
              </button>
            )}

            {isAdmin && onArticleReview && (
              <button
                onClick={onArticleReview}
                className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Review Articles"
              >
                <CheckSquare className="w-4 h-4" />
              </button>
            )}

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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 py-3 space-y-1">
            <button
              onClick={() => {
                onViewChange('article');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                currentView === 'article'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <NotebookPen className="w-5 h-5" />
              <span className="font-medium">Today</span>
            </button>

            <button
              onClick={() => {
                onViewChange('notebook');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                currentView === 'notebook'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Notebook</span>
            </button>

            <button
              onClick={() => {
                onViewChange('archive');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                currentView === 'archive'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Archive className="w-5 h-5" />
              <span className="font-medium">Archive</span>
            </button>

            <button
              onClick={() => {
                onViewChange('about');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                currentView === 'about'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Info className="w-5 h-5" />
              <span className="font-medium">About</span>
            </button>

            <div className="border-t border-gray-100 my-2 pt-2">
              {isWriter && (
                <button
                  onClick={() => {
                    onAdminPanel();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">{isAdmin ? 'Add Article' : 'Create Article'}</span>
                </button>
              )}

              {isWriter && onWriterPanel && (
                <button
                  onClick={() => {
                    onWriterPanel();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <FileEdit className="w-5 h-5" />
                  <span className="font-medium">My Articles</span>
                </button>
              )}

              {isAdmin && onArticleReview && (
                <button
                  onClick={() => {
                    onArticleReview();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  <CheckSquare className="w-5 h-5" />
                  <span className="font-medium">Review Articles</span>
                </button>
              )}

              <button
                onClick={() => {
                  onNotificationSettings();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="font-medium">Notification Settings</span>
              </button>

              <button
                onClick={() => {
                  onSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}