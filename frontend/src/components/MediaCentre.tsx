import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Play, X, ChevronLeft, ChevronRight, Calendar, MapPin, AlertCircle } from 'lucide-react';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from '../services/firebase';
import { db } from '../services/firebase';

const localPhotos = [
  { id: 'hero1', title: 'School Feeding Programme', description: 'Children enjoying nutritious meals at school', url: '/media/Hero1.jpg', thumbnail: '/media/Hero1.jpg', category: 'Programme', location: 'Ghana', date: '2025-01-15', tags: ['feeding', 'children'], isFeatured: true },
  { id: 'hero2', title: 'School Feeding in Action', description: 'Serving meals to school children across Ghana', url: '/media/Hero2.jpg', thumbnail: '/media/Hero2.jpg', category: 'Programme', location: 'Ghana', date: '2025-01-14', tags: ['feeding', 'schools'], isFeatured: true },
  { id: 'hero4', title: 'Nourishing Ghana\'s Future', description: 'The Ghana School Feeding Programme at work', url: '/media/Hero4.jpg', thumbnail: '/media/Hero4.jpg', category: 'Programme', location: 'Ghana', date: '2025-01-13', tags: ['feeding', 'nutrition'], isFeatured: true },
  { id: 'sch1', title: 'School Feeding Activity', description: 'Students receiving daily balanced meals', url: '/media/Sch1.jpg', thumbnail: '/media/Sch1.jpg', category: 'Schools', location: 'Ghana', date: '2025-02-10', tags: ['school', 'meals'], isFeatured: false },
  { id: 'sch2', title: 'Nutrition at Schools', description: 'Promoting healthy eating habits in schools', url: '/media/Sch2.jpg', thumbnail: '/media/Sch2.jpg', category: 'Schools', location: 'Ghana', date: '2025-02-09', tags: ['nutrition', 'education'], isFeatured: false },
  { id: 'sch3', title: 'Feeding Programme Coverage', description: 'Expanding the reach of school feeding across regions', url: '/media/Sch3.jpg', thumbnail: '/media/Sch3.jpg', category: 'Schools', location: 'Ghana', date: '2025-02-08', tags: ['coverage', 'regions'], isFeatured: false },
  { id: 'sch4', title: 'School Meal Service', description: 'Daily meal service at a participating school', url: '/media/Sch4.jpg', thumbnail: '/media/Sch4.jpg', category: 'Schools', location: 'Ghana', date: '2025-02-07', tags: ['meals', 'service'], isFeatured: false },
  { id: 'sch5', title: 'Children at Lunch', description: 'Children enjoying their daily school meals', url: '/media/Sch5.jpg', thumbnail: '/media/Sch5.jpg', category: 'Schools', location: 'Ghana', date: '2025-02-06', tags: ['children', 'lunch'], isFeatured: false },
  { id: 'sch6', title: 'School Feeding Impact', description: 'Improving attendance and academic performance', url: '/media/Sch6.jpg', thumbnail: '/media/Sch6.jpg', category: 'Schools', location: 'Ghana', date: '2025-02-05', tags: ['impact', 'attendance'], isFeatured: false },
  { id: 'sch7', title: 'Community Involvement', description: 'Community participation in the feeding programme', url: '/media/Sch7.jpg', thumbnail: '/media/Sch7.jpg', category: 'Community', location: 'Ghana', date: '2025-02-04', tags: ['community', 'involvement'], isFeatured: false },
  { id: 'sch8', title: 'Programme Highlights', description: 'Key moments from the School Feeding Programme', url: '/media/Sch8.jpg', thumbnail: '/media/Sch8.jpg', category: 'Programme', location: 'Ghana', date: '2025-02-03', tags: ['highlights', 'programme'], isFeatured: false },
  { id: 'sch9', title: 'Healthy Meals for All', description: 'Ensuring every child gets a nutritious meal', url: '/media/Sch9.jpg', thumbnail: '/media/Sch9.jpg', category: 'Programme', location: 'Ghana', date: '2025-02-02', tags: ['health', 'nutrition'], isFeatured: false },
  { id: 'cat1', title: 'Local Caterers at Work', description: 'Local caterers preparing meals for school children', url: '/media/cat1.jpg', thumbnail: '/media/cat1.jpg', category: 'Caterers', location: 'Ghana', date: '2025-03-10', tags: ['caterers', 'cooking'], isFeatured: false },
  { id: 'cat2', title: 'Catering Operations', description: 'Behind the scenes of school meal preparation', url: '/media/cat2.jpg', thumbnail: '/media/cat2.jpg', category: 'Caterers', location: 'Ghana', date: '2025-03-09', tags: ['caterers', 'operations'], isFeatured: false },
  { id: 'cat3', title: 'Food Preparation', description: 'Preparing nutritious locally-sourced meals', url: '/media/cat3.jpg', thumbnail: '/media/cat3.jpg', category: 'Caterers', location: 'Ghana', date: '2025-03-08', tags: ['food', 'preparation'], isFeatured: false },
  { id: 'cat4', title: 'Kitchen Activities', description: 'School feeding kitchen in full operation', url: '/media/cat4.jpg', thumbnail: '/media/cat4.jpg', category: 'Caterers', location: 'Ghana', date: '2025-03-07', tags: ['kitchen', 'cooking'], isFeatured: false },
  { id: 'cat5', title: 'Caterer Partnership', description: 'Working with local caterers to deliver quality meals', url: '/media/cat5.jpg', thumbnail: '/media/cat5.jpg', category: 'Caterers', location: 'Ghana', date: '2025-03-06', tags: ['partnership', 'caterers'], isFeatured: false },
  { id: 'cat6', title: 'Meal Distribution', description: 'Distributing meals to school children', url: '/media/cat6.jpg', thumbnail: '/media/cat6.jpg', category: 'Caterers', location: 'Ghana', date: '2025-03-05', tags: ['distribution', 'meals'], isFeatured: false },
  { id: 'cat7', title: 'Local Food Sourcing', description: 'Supporting local farmers through food procurement', url: '/media/cat7.jpg', thumbnail: '/media/cat7.jpg', category: 'Caterers', location: 'Ghana', date: '2025-03-04', tags: ['local', 'farming'], isFeatured: false },
  { id: 'cat8', title: 'Catering Excellence', description: 'Maintaining high standards in meal preparation', url: '/media/cat8.jpg', thumbnail: '/media/cat8.jpg', category: 'Caterers', location: 'Ghana', date: '2025-03-03', tags: ['quality', 'standards'], isFeatured: false },
  { id: 'cat9', title: 'Feeding Programme Support', description: 'Caterers supporting the national feeding initiative', url: '/media/cat9.jpg', thumbnail: '/media/cat9.jpg', category: 'Caterers', location: 'Ghana', date: '2025-03-02', tags: ['support', 'programme'], isFeatured: false },
];

const localVideos = [
  { id: 'video1', title: 'School Feeding Programme Overview', description: 'An overview of the Ghana School Feeding Programme and its impact on children across the country', url: '/media/Video1.mp4', thumbnail: '/media/Sch1.jpg', category: 'Programme', duration: '0:00', date: '2025-01-15', tags: ['overview', 'programme'], isFeatured: true },
  { id: 'video2', title: 'Feeding Programme in Action', description: 'Watch the school feeding programme in action as meals are prepared and served to school children', url: '/media/Video2.mp4', thumbnail: '/media/Sch2.jpg', category: 'Schools', duration: '0:00', date: '2025-01-14', tags: ['action', 'schools'], isFeatured: true },
  { id: 'video3', title: 'Community Impact Stories', description: 'Stories from communities benefiting from the school feeding programme and its positive effects', url: '/media/Video3.mp4', thumbnail: '/media/Sch3.jpg', category: 'Community', duration: '0:00', date: '2025-01-13', tags: ['community', 'impact'], isFeatured: true },
];

const categories = [
  {
    id: 'featured',
    name: 'Featured Highlights',
    description: 'Key moments and achievements from the Ghana School Feeding Programme',
    previewImage: '/media/Hero1.jpg',
    filter: (photo) => photo.isFeatured,
    count: localPhotos.filter(p => p.isFeatured).length
  },
  {
    id: 'schools',
    name: 'School Programme Photos',
    description: 'Daily school feeding activities and programme implementation',
    previewImage: '/media/Sch1.jpg',
    filter: (photo) => photo.category === 'Schools' || photo.category === 'Programme',
    count: localPhotos.filter(p => p.category === 'Schools' || p.category === 'Programme').length
  },
  {
    id: 'caterers',
    name: 'Caterer Operations',
    description: 'Local caterers and food preparation activities',
    previewImage: '/media/cat1.jpg',
    filter: (photo) => photo.category === 'Caterers',
    count: localPhotos.filter(p => p.category === 'Caterers').length
  }
];

const MediaCentre = () => {
  const [photos, setPhotos] = useState(localPhotos);
  const [videos, setVideos] = useState(localVideos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('videos');
  const [selectedItem, setSelectedItem] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const [filteredPhotos, setFilteredPhotos] = useState([]);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch photos/gallery content
      const photosQuery = query(
        collection(db, 'content'),
        where('type', 'in', ['gallery', 'image']),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      );

      // Fetch video content
      const videosQuery = query(
        collection(db, 'content'),
        where('type', '==', 'video'),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      );

      const [photosSnapshot, videosSnapshot] = await Promise.all([
        getDocs(photosQuery),
        getDocs(videosQuery)
      ]);

      const photosData = photosSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'Untitled',
          description: data.excerpt || data.description || '',
          url: data.mediaUrl || data.image || '',
          thumbnail: data.thumbnail || data.mediaUrl || data.image || '',
          category: data.category || 'General',
          location: data.location || '',
          date: data.createdAt?.toDate?.()?.toISOString().split('T')[0] ||
                data.createdAt?.split('T')[0] ||
                new Date().toISOString().split('T')[0],
          tags: data.tags || [],
          isFeatured: data.isFeatured || false
        };
      });

      const videosData = videosSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'Untitled Video',
          description: data.excerpt || data.description || '',
          url: data.videoUrl || data.mediaUrl || '',
          thumbnail: data.thumbnail || data.mediaUrl || data.image || '',
          category: data.category || 'General',
          duration: data.duration || '0:00',
          date: data.createdAt?.toDate?.()?.toISOString().split('T')[0] ||
                data.createdAt?.split('T')[0] ||
                new Date().toISOString().split('T')[0],
          tags: data.tags || [],
          isFeatured: data.isFeatured || false
        };
      });

      setPhotos([...localPhotos, ...photosData]);
      setVideos([...localVideos, ...videosData]);
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const currentItems = activeTab === 'photos' ? (activeCategory ? filteredPhotos : photos) : videos;

  const openCategoryGallery = (category) => {
    const filtered = photos.filter(category.filter);
    setFilteredPhotos(filtered);
    setActiveCategory(category.id);
    if (filtered.length > 0) {
      setSelectedItem(filtered[0]);
      setLightboxIndex(0);
    }
  };

  const closeLightbox = () => {
    setSelectedItem(null);
    setActiveCategory(null);
  };

  const openLightbox = (item, index) => {
    setSelectedItem(item);
    setLightboxIndex(index);
  };

  const navigateLightbox = (direction) => {
    const newIndex = lightboxIndex + direction;
    if (newIndex >= 0 && newIndex < currentItems.length) {
      setLightboxIndex(newIndex);
      setSelectedItem(currentItems[newIndex]);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading media...</p>
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

  return (
    <section className="py-20 bg-gray-50" id="media">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Media Centre
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore photos and videos from the Ghana School Feeding Programme
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-8 py-3 rounded-md font-medium transition-all duration-300 inline-flex items-center gap-2 ${
                activeTab === 'videos'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Play className="h-4 w-4" />
              Videos
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-8 py-3 rounded-md font-medium transition-all duration-300 inline-flex items-center gap-2 ${
                activeTab === 'photos'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              Photos
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {activeTab === 'photos' && !activeCategory ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                variants={cardVariants}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => openCategoryGallery(category)}
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={category.previewImage}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.count} photos</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {category.description}
                  </p>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                    View Gallery
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : currentItems.length > 0 ? (
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {currentItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => openLightbox(item, index)}
              >
                <div className="relative overflow-hidden">
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    {activeTab === 'videos' ? (
                      <video
                        src={item.url}
                        muted
                        autoPlay
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
                  {activeTab === 'videos' && (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white bg-opacity-90 rounded-full p-3">
                          <Play className="h-6 w-6 text-green-600 ml-0.5" />
                        </div>
                      </div>
                      {item.duration && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {item.duration}
                        </div>
                      )}
                    </>
                  )}
                  {item.isFeatured && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {item.location && (
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {item.location}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(item.date)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            {activeTab === 'photos' ? (
              <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            ) : (
              <Play className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            )}
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No {activeTab === 'photos' ? 'photos' : 'videos'} available yet
            </h3>
            <p className="text-gray-500">
              Check back soon for updates from the Ghana School Feeding Programme.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity duration-200"
              >
                <X className="h-6 w-6" />
              </button>

              {lightboxIndex > 0 && (
                <button
                  onClick={() => navigateLightbox(-1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}
              {lightboxIndex < currentItems.length - 1 && (
                <button
                  onClick={() => navigateLightbox(1)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}

              <div className="relative">
                {activeTab === 'videos' ? (
                  <video
                    src={selectedItem.url}
                    controls
                    className="w-full max-h-96 object-contain bg-black"
                  />
                ) : (
                  <img
                    src={selectedItem.url || selectedItem.thumbnail}
                    alt={selectedItem.title}
                    className="w-full max-h-96 object-contain bg-black"
                  />
                )}
              </div>

              <div className="p-6">
                {activeCategory && (
                  <div className="mb-4">
                    <button
                      onClick={closeLightbox}
                      className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-2 mb-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back to Categories
                    </button>
                    <div className="text-sm text-gray-500">
                      {categories.find(c => c.id === activeCategory)?.name} - {lightboxIndex + 1} / {currentItems.length}
                    </div>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedItem.title}</h3>
                <p className="text-gray-600 mb-4">{selectedItem.description}</p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  {selectedItem.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedItem.location}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(selectedItem.date)}
                  </div>
                </div>
                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedItem.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MediaCentre;
