import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Archive, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Article } from '../types';

interface ArchiveViewProps {
  onArticleSelect: (article: Article) => void;
}

export default function ArchiveView({ onArticleSelect }: ArchiveViewProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('published_date', { ascending: false });

      if (error) throw error;

      setArticles(data || []);
      
      // Extract unique categories
      const uniqueCategories = [...new Set((data || [])
        .map(article => article.category)
        .filter(Boolean)
      )] as string[];
      
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group articles by category
  const groupedArticles = categories.reduce((acc, category) => {
    acc[category] = filteredArticles.filter(article => article.category === category);
    return acc;
  }, {} as Record<string, Article[]>);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12 text-center">
        <div className="animate-pulse text-emerald-600">Loading archive...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Article Archive</h1>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          Explore our collection of environmental insights and action guides
        </p>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : selectedCategory === 'all' ? (
        // Show grouped by category when viewing all
        <div className="space-y-8 sm:space-y-12">
          {Object.entries(groupedArticles).map(([category, categoryArticles]) => (
            categoryArticles.length > 0 && (
              <div key={category}>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 pb-2 border-b border-emerald-100">
                  {category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {categoryArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} onSelect={onArticleSelect} />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      ) : (
        // Show as grid when filtering by specific category
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} onSelect={onArticleSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleCard({ article, onSelect }: { article: Article; onSelect: (article: Article) => void }) {
  return (
    <div
      onClick={() => onSelect(article)}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2 sm:mb-3">
          <Calendar className="w-3 h-3" />
          <span>{new Date(article.published_date).toLocaleDateString()}</span>
          <span>•</span>
          <Clock className="w-3 h-3" />
          <span>{article.reading_time} min</span>
        </div>

        {article.category && (
          <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full mb-2 sm:mb-3">
            {article.category}
          </span>
        )}

        <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight mb-2 group-hover:text-emerald-700 transition-colors">
          {article.title}
        </h3>

        {article.subtitle && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {article.subtitle}
          </p>
        )}
      </div>

      <div className="px-4 sm:px-6 pb-4">
        <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors">
          Read article →
        </button>
      </div>
    </div>
  );
}