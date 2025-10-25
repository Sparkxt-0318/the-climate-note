import React, { useState, useEffect } from 'react';
import { Calendar, Clock, StickyNote, CreditCard as Edit3, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Article, UserProfile, UserNote } from '../types';
import { showToast } from './ui/Toast';

interface ArticleViewProps {
  article: Article | null;
  userProfile: UserProfile | null;
  onProfileUpdate: (profile: UserProfile) => void;
}

export default function ArticleView({ article, userProfile, onProfileUpdate }: ArticleViewProps) {
  const [noteText, setNoteText] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [hasNoteToday, setHasNoteToday] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (article && userProfile) {
      checkTodayNote();
    }
  }, [article, userProfile]);

  const checkTodayNote = async () => {
    if (!article || !userProfile) return;

    try {
      const { data, error } = await supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', userProfile.id)
        .eq('article_id', article.id)
        .maybeSingle();

      setHasNoteToday(!!data && !error);
    } catch (error) {
      console.error('Error checking today\'s note:', error);
    }
  };

  const handleSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !article || !userProfile) return;

    setLoading(true);
    try {
      const { error: noteError } = await supabase
        .from('user_notes')
        .insert({
          user_id: userProfile.id,
          article_id: article.id,
          content: noteText.trim(),
        });

      if (noteError) throw noteError;

      // Update user profile with new streak and note count
      const newStreak = userProfile.streak + 1;
      const newTotalNotes = userProfile.total_notes + 1;

      const { data: updatedProfile, error: profileError } = await supabase
        .from('user_profiles')
        .update({
          streak: newStreak,
          total_notes: newTotalNotes,
          last_note_date: new Date().toISOString().split('T')[0],
        })
        .eq('id', userProfile.id)
        .select()
        .single();

      if (profileError) throw profileError;

      onProfileUpdate(updatedProfile);
      setHasNoteToday(true);
      setNoteText('');
      setShowNoteForm(false);
      showToast('Note saved! Your streak continues!', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">No article for today</h2>
          <p className="text-gray-600">Check back tomorrow for fresh environmental insights!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(article.published_date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{article.reading_time} min read</span>
          </div>
          {article.category && (
            <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
              {article.category}
            </span>
          )}
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
          {article.title}
        </h1>
        
        {article.subtitle && (
          <p className="text-xl text-gray-600 leading-relaxed">
            {article.subtitle}
          </p>
        )}
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none mb-12 article-content">
        <div 
          dangerouslySetInnerHTML={{ __html: article.content }}
          className="text-gray-800 leading-relaxed [&_img]:w-full [&_img]:rounded-lg [&_img]:my-6 [&_img]:shadow-md"
        />
      </div>

      {/* Sticky Note Summary */}
      {article.key_takeaways && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-3">
            <StickyNote className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">Key Takeaways</h3>
          </div>
          <ul className="space-y-2">
            {article.key_takeaways.map((takeaway, index) => (
              <li key={index} className="flex items-start space-x-2 text-yellow-900">
                <span className="text-yellow-600 mt-1">•</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Note Section */}
      <div className="bg-white border-2 border-emerald-200 rounded-xl p-6" id="action-note-section">
        {hasNoteToday ? (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-emerald-600">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold text-lg">Note Complete for Today!</span>
            </div>
            <p className="text-gray-600">
              Great job! Visit your Notebook to see what others are doing to make a difference.
            </p>
          </div>
        ) : !showNoteForm ? (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">What will you do differently?</h3>
            <p className="text-gray-600">
              After reading this article, what's one specific action you can take in your daily life 
              to make a positive environmental impact?
            </p>
            <button
              onClick={() => setShowNoteForm(true)}
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Write My Action Note</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitNote} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">My Environmental Action</h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write about a specific action you'll take... (e.g., 'I'll switch to reusable produce bags when grocery shopping' or 'I'll research sustainable fashion brands before my next clothing purchase')"
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              required
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowNoteForm(false)}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !noteText.trim()}
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Save My Note</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}