import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, ExternalLink, AlertCircle, Search, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from '../services/firebase';
import { db } from '../services/firebase';

// Add CSS to hide scrollbar
const style = document.createElement('style');
style.textContent = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;
if (!document.head.querySelector('style[data-scrollbar-hide]')) {
  style.setAttribute('data-scrollbar-hide', 'true');
  document.head.appendChild(style);
}

const LatestNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const location = useLocation();
  const isFullPage = location.pathname === '/news' || location.pathname === '/articles';

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting fetchNews...');
      console.log('Mock Firebase db:', !!db);
      console.log('Mock Firebase db type:', typeof db);

      // Fetch both news and articles
      const newsQuery = query(
        collection(db, 'content'),
        where('type', '==', 'news'),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      );

      const featuredQuery = query(
        collection(db, 'content'),
        where('featuredSections', 'array-contains', 'articles'),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      );

      const [newsSnapshot, featuredSnapshot] = await Promise.all([
        getDocs(newsQuery),
        getDocs(featuredQuery)
      ]);

      const newsData = newsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.createdAt?.toDate?.()?.toISOString().split('T')[0] ||
                data.createdAt?.split('T')[0] ||
                new Date().toISOString().split('T')[0],
          readTime: calculateReadTime(data.content || ''),
          featured: data.featured || false
        };
      });

      const featuredData = featuredSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.createdAt?.toDate?.()?.toISOString().split('T')[0] ||
                data.createdAt?.split('T')[0] ||
                new Date().toISOString().split('T')[0],
          readTime: calculateReadTime(data.content || ''),
          featured: true
        };
      });

      // Combine and remove duplicates, sorted by date (newest first)
      const allContent = [...featuredData, ...newsData.filter(item =>
        !featuredData.some(f => f.id === item.id)
      )].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setNews(allContent);
      
    } catch (error) {
      console.error('Error fetching news:', error);
      console.error('Error details:', error.message);
      setError('Failed to load news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading latest news...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Filter items based on search and category
  const filteredNews = news.filter(item => {
    const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(news.map(item => item.category).filter(Boolean))];

  // Pagination for full page
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = isFullPage
    ? filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredNews.slice(0, 6);


  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-gray-50" id="news">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Latest News & Articles
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest developments, achievements, and announcements from the Ghana School Feeding Programme
          </p>
        </motion.div>

        {/* Search and Filter - only on full page */}
        {isFullPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search news & articles..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="md:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* News Cards */}
        {isFullPage ? (
          // Full page: grid layout with pagination
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {paginatedNews.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-ghana-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    {item.featured && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-ghana-secondary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="mr-3">{formatDate(item.date)}</span>
                      <span>{item.readTime}</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-ghana-primary-600 transition-colors duration-300 line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {item.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="h-3 w-3 mr-1" />
                        {item.author || 'GSFP Communications'}
                      </div>
                      <button className="inline-flex items-center text-ghana-primary-600 hover:text-ghana-primary-700 text-sm font-medium">
                        Read More
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* No Results */}
            {paginatedNews.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600">Try adjusting your search terms or browse different categories.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          // Homepage: horizontal scrollable row
          <>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {paginatedNews.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={cardVariants}
                    whileHover={{ y: -5, transition: { duration: 0.3 } }}
                    className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative overflow-hidden">
                      <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-ghana-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span className="mr-3">{formatDate(item.date)}</span>
                        <span>{item.readTime}</span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-ghana-primary-600 transition-colors duration-300 line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {item.excerpt}
                      </p>
                      <button className="inline-flex items-center text-ghana-primary-600 hover:text-ghana-primary-700 text-sm font-medium transition-colors duration-200">
                        Read More
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* View All News Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center mt-12"
            >
              <Link
                to="/news"
                className="bg-ghana-primary-600 hover:bg-ghana-primary-700 text-white font-bold py-3 px-6 sm:px-8 md:px-10 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl inline-flex items-center text-sm sm:text-base"
              >
                View All News & Articles
                <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default LatestNews;
