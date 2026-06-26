import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, Star, Calendar, MapPin, ArrowRight } from 'lucide-react';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from '../services/firebase';
import { db } from '../services/firebase';

const Spotlight = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [spotlightItems, setSpotlightItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpotlightContent();
  }, []);

  useEffect(() => {
    if (isAutoPlay && spotlightItems.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % spotlightItems.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [isAutoPlay, spotlightItems.length]);

  const fetchSpotlightContent = async () => {
    try {
      setLoading(true);

      // Fetch featured content from multiple sources
      const featuredQuery = query(
        collection(db, 'content'),
        where('featuredSections', 'array-contains', 'spotlight'),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      );

      const featuredSnapshot = await getDocs(featuredQuery);
      const featuredData = featuredSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'Featured Story',
          description: data.excerpt || data.description || '',
          image: data.image || data.mediaUrl || data.thumbnail || '/Hero1.jpg',
          category: data.category || 'Featured',
          date: data.createdAt?.toDate?.()?.toISOString().split('T')[0] ||
                data.createdAt?.split('T')[0] ||
                new Date().toISOString().split('T')[0],
          location: data.location || 'Ghana',
          link: data.link || '#',
          type: data.type || 'article'
        };
      });

      // If no featured content from Firebase, use fallback content
      if (featuredData.length === 0) {
        setSpotlightItems([
          {
            id: 'fallback-1',
            title: 'Feeding Over 3 Million Children Daily',
            description: 'The Ghana School Feeding Programme currently provides nutritious meals to over 3 million school children across all 16 regions of Ghana, improving attendance and academic performance.',
            image: '/Hero1.jpg',
            video: '/media/Video4.mp4',
            category: 'Impact',
            date: '2025-01-15',
            location: 'Nationwide',
            link: '#impact',
            type: 'achievement'
          },
          {
            id: 'fallback-2',
            title: 'Empowering Local Farmers',
            description: 'Through our farm-to-school initiative, we partner with over 50,000 local farmers to source fresh, locally-grown ingredients, boosting rural economies.',
            image: '/Hero2.jpg',
            video: '/media/Video5.mp4',
            category: 'Partnership',
            date: '2025-01-14',
            location: 'All Regions',
            link: '#partners',
            type: 'achievement'
          },
          {
            id: 'fallback-3',
            title: 'Creating Jobs for Local Caterers',
            description: 'Our programme has created employment opportunities for thousands of local caterers and kitchen staff, supporting livelihoods in communities across Ghana.',
            image: '/Hero4.jpg',
            video: '/media/Video6.mp4',
            category: 'Employment',
            date: '2025-01-13',
            location: 'Ghana',
            link: '#programs',
            type: 'achievement'
          },
          {
            id: 'fallback-4',
            title: 'Nutrition Education Programs',
            description: 'Comprehensive nutrition education initiatives teaching children and families about healthy eating habits, food security, and sustainable agricultural practices.',
            image: '/Hero1.jpg',
            video: '/media/Video7.mp4',
            category: 'Education',
            date: '2025-01-12',
            location: 'All Regions',
            link: '#programs',
            type: 'achievement'
          },
          {
            id: 'fallback-5',
            title: 'Community Outreach Initiatives',
            description: 'Extending nutrition support beyond schools through community programs, farmer training workshops, and sustainable agriculture development projects.',
            image: '/Hero2.jpg',
            video: '/media/Video8.mp4',
            category: 'Community',
            date: '2025-01-11',
            location: 'Ghana',
            link: '#programs',
            type: 'achievement'
          },
          {
            id: 'fallback-6',
            title: 'School Garden Projects',
            description: 'Establishing school gardens across the country to teach students about agriculture, nutrition, and environmental stewardship while providing fresh produce.',
            image: '/Hero4.jpg',
            video: '/media/Video9.mp4',
            category: 'Sustainability',
            date: '2025-01-10',
            location: 'Nationwide',
            link: '#programs',
            type: 'achievement'
          },
          {
            id: 'fallback-7',
            title: 'Monitoring and Quality Assurance',
            description: 'Implementing robust monitoring systems to ensure food safety, nutritional standards, and program accountability across all beneficiary schools.',
            image: '/Hero1.jpg',
            video: '/media/Video10.mp4',
            category: 'Quality',
            date: '2025-01-09',
            location: 'All Regions',
            link: '#impact',
            type: 'achievement'
          }
        ]);
      } else {
        setSpotlightItems(featuredData.slice(0, 5)); // Limit to 5 items
      }
    } catch (error) {
      console.error('Error fetching spotlight content:', error);
      // Use fallback content on error
      setSpotlightItems([
        {
          id: 'fallback-1',
          title: 'Feeding Over 3 Million Children Daily',
          description: 'The Ghana School Feeding Programme currently provides nutritious meals to over 3 million school children across all 16 regions of Ghana.',
          image: '/Hero1.jpg',
          video: '/media/Video4.mp4',
          category: 'Impact',
          date: '2025-01-15',
          location: 'Nationwide',
          link: '#impact',
          type: 'achievement'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % spotlightItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + spotlightItems.length) % spotlightItems.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-r from-ghana-primary-50 to-ghana-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ghana-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading featured content...</p>
          </div>
        </div>
      </section>
    );
  }

  if (spotlightItems.length === 0) {
    return null; // Don't render if no content
  }

  return (
    <section className="py-16 bg-gradient-to-r from-ghana-primary-50 to-ghana-secondary-50" id="spotlight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="h-6 w-6 text-ghana-secondary-600 fill-ghana-secondary-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Featured Spotlight
            </h2>
            <Star className="h-6 w-6 text-ghana-secondary-600 fill-ghana-secondary-600" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Highlighting key achievements, success stories, and important updates from the Ghana School Feeding Programme
          </p>
        </motion.div>

        {/* Spotlight Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Video/Image Side */}
                <div className="relative h-64 md:h-auto overflow-hidden">
                  {spotlightItems[currentSlide].video ? (
                    <video
                      src={spotlightItems[currentSlide].video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={spotlightItems[currentSlide].image}
                      alt={spotlightItems[currentSlide].title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-ghana-primary-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {spotlightItems[currentSlide].category}
                    </span>
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(spotlightItems[currentSlide].date)}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {spotlightItems[currentSlide].location}
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {spotlightItems[currentSlide].title}
                    </h3>

                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {spotlightItems[currentSlide].description}
                    </p>

                    <a
                      href={spotlightItems[currentSlide].link}
                      className="inline-flex items-center text-ghana-primary-600 hover:text-ghana-primary-700 font-semibold transition-colors duration-200"
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {spotlightItems.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 z-10"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 z-10"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Auto-play Control */}
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 z-10"
              >
                {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {spotlightItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-ghana-primary-600 w-6'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Spotlight;
