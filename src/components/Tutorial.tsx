import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, NotebookPen, BookOpen, Archive, CreditCard as Edit3, Flame } from 'lucide-react';

interface TutorialProps {
  onComplete: () => void;
  currentView: 'article' | 'notebook' | 'archive' | 'about';
  onViewChange: (view: 'article' | 'notebook' | 'archive' | 'about') => void;
}

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  view?: 'article' | 'notebook' | 'archive' | 'about';
  position: 'center' | 'top' | 'bottom' | 'left' | 'right';
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to The Climate Note! 🌱',
    content: 'Let\'s take a quick tour to show you how to turn environmental awareness into daily action.',
    position: 'center'
  },
  {
    id: 'daily-article',
    title: 'Daily Environmental Stories',
    content: 'Every day, we publish a new article about environmental issues, solutions, and inspiring stories. This is your starting point for climate action.',
    target: 'article-content',
    view: 'article',
    position: 'center'
  },
  {
    id: 'action-note',
    title: 'Turn Reading into Action',
    content: 'After reading each article, write a personal action note about what you\'ll do differently. This is how you build sustainable habits!',
    target: 'action-note-section',
    view: 'article',
    position: 'top'
  },
  {
    id: 'streak-system',
    title: 'Build Your Streak',
    content: 'Every time you write an action note, your streak grows! This gamifies your environmental journey and keeps you motivated.',
    target: 'streak-counter',
    view: 'article',
    position: 'bottom'
  },
  {
    id: 'navigation',
    title: 'Navigate Your Journey',
    content: 'Use these tabs to explore: Today\'s article, your Notebook with community actions, and the Archive of past articles.',
    target: 'navigation',
    view: 'article',
    position: 'bottom'
  },
  {
    id: 'notebook-view',
    title: 'Community Notebook',
    content: 'See what actions others are taking and share inspiration. You can view all community notes or filter to see just your own.',
    target: 'notebook-content',
    view: 'notebook',
    position: 'center'
  },
  {
    id: 'archive-view',
    title: 'Article Archive',
    content: 'Browse past articles by category or search for specific topics. All your environmental learning in one place.',
    target: 'archive-content',
    view: 'archive',
    position: 'center'
  },
  {
    id: 'complete',
    title: 'You\'re All Set! 🎉',
    content: 'Start your climate journey by reading today\'s article and writing your first action note. Every small step counts!',
    position: 'center'
  }
];

export default function Tutorial({ onComplete, currentView, onViewChange }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const step = tutorialSteps[currentStep];

  useEffect(() => {
    // Change view if the current step requires it
    if (step.view && step.view !== currentView) {
      onViewChange(step.view);
    }
  }, [currentStep, step.view, currentView, onViewChange]);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTutorial = () => {
    setIsVisible(false);
    onComplete();
  };

  const skipTutorial = () => {
    completeTutorial();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        {/* Tutorial Modal */}
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
          {/* Close Button */}
          <button
            onClick={skipTutorial}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Progress Indicator */}
          <div className="flex items-center space-x-2 mb-6">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step Content */}
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed">{step.content}</p>

            {/* Step-specific Icons */}
            {step.id === 'daily-article' && (
              <div className="flex justify-center">
                <NotebookPen className="w-12 h-12 text-emerald-500" />
              </div>
            )}
            {step.id === 'action-note' && (
              <div className="flex justify-center">
                <Edit3 className="w-12 h-12 text-blue-500" />
              </div>
            )}
            {step.id === 'streak-system' && (
              <div className="flex justify-center">
                <Flame className="w-12 h-12 text-orange-500" />
              </div>
            )}
            {step.id === 'notebook-view' && (
              <div className="flex justify-center">
                <BookOpen className="w-12 h-12 text-purple-500" />
              </div>
            )}
            {step.id === 'archive-view' && (
              <div className="flex justify-center">
                <Archive className="w-12 h-12 text-indigo-500" />
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <span className="text-sm text-gray-500">
              {currentStep + 1} of {tutorialSteps.length}
            </span>

            <button
              onClick={nextStep}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <span>{currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Skip Button */}
          <div className="text-center mt-4">
            <button
              onClick={skipTutorial}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip tutorial
            </button>
          </div>
        </div>
      </div>

      {/* Highlight Overlay for Targeted Elements */}
      {step.target && (
        <div className="fixed inset-0 pointer-events-none z-40">
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          {/* The actual highlighting would be handled by CSS targeting */}
        </div>
      )}
    </>
  );
}