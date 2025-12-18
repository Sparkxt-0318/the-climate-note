import React, { useState } from 'react';
import { Mail, NotebookPen, ArrowRight, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { showToast } from './ui/Toast';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log('LandingPage rendering...');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !showForgotPassword && !password) return;

    if (!showForgotPassword && password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      if (showForgotPassword) {
        // Send password reset email
        const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${appUrl}/reset-password`,
        });

        if (error) throw error;
        showToast('Password reset email sent! Check your inbox.', 'success');
        setShowForgotPassword(false);
      } else if (isLogin) {
        // Sign in existing user
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        showToast('Welcome back!', 'success');
      } else {
        // Sign up new user
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        showToast('Welcome! Setting up your account...', 'success');
      }
    } catch (error: any) {
      // Handle specific error cases with user-friendly messages
      if (error.message?.includes('User already registered') || error.message?.includes('user_already_exists')) {
        showToast('This email is already registered. Please log in instead.', 'error');
        // Automatically switch to login mode for better UX
        setIsLogin(true);
      } else if (error.message?.includes('Invalid login credentials')) {
        showToast('Invalid email or password. Please check your credentials.', 'error');
      } else if (error.message?.includes('Email not confirmed')) {
        showToast('Please check your email and click the confirmation link.', 'error');
      } else {
        // Only log unexpected errors to console
        console.error('Unexpected auth error:', error);
        showToast(error.message || 'Authentication failed', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-12">
          <NotebookPen className="w-12 h-12 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900">The Climate Note</h1>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              {showForgotPassword ? (
                <>
                  Reset your password
                </>
              ) : (
                <>
                  Daily climate action,
                  <span className="text-emerald-600"> one note at a time</span>
                </>
              )}
            </h2>
            {!showForgotPassword && (
              <p className="text-gray-600 text-lg">
                Discover untold environmental stories and turn reading into action through personalized sustainability notes.
              </p>
            )}
          </div>

          {/* Toggle between Sign Up, Login, and Forgot Password */}
          {!showForgotPassword && (
            <div className="flex items-center justify-center space-x-1 text-sm">
              <button
                onClick={() => {
                  setIsLogin(false);
                  setPassword('');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !isLogin
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => {
                  setIsLogin(true);
                  setPassword('');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isLogin
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Log In
              </button>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-lg transition-all"
                required
              />
            </div>

            {!showForgotPassword && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "Enter your password" : "Create a password (min 6 characters)"}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-lg transition-all"
                  required
                  minLength={6}
                />
              </div>
            )}

            {/* Forgot Password Link */}
            {isLogin && !showForgotPassword && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Back to Login Link */}
            {showForgotPassword && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← Back to login
                </button>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 text-lg shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>
                    {showForgotPassword 
                      ? 'Send Reset Email' 
                      : isLogin 
                        ? 'Log In' 
                        : 'Join The Movement'
                    }
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="text-sm text-gray-500 space-y-2">
            {showForgotPassword ? (
              <p className="text-gray-600 text-center">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            ) : !isLogin ? (
              <>
                <p>✅ Daily environmental insights delivered to your inbox</p>
                <p>✅ Track your climate action with personal notes</p>
                <p>✅ Join a community of young environmental champions</p>
              </>
            ) : (
              <p className="text-gray-600">Welcome back! Enter your credentials to continue your climate journey.</p>
            )}
          </div>
        </div>
        
        {/* Legal Links */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
            <a 
              href="/privacy-policy" 
              className="hover:text-emerald-600 transition-colors"
            >
              Privacy Policy
            </a>
            <span>•</span>
            <a 
              href="/terms-of-service" 
              className="hover:text-emerald-600 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}