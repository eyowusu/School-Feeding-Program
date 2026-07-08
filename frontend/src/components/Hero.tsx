import React, { useState, useEffect, useCallback, memo } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = memo(() => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroContent();
  }, []);

  useEffect(() => {
    if (isAutoPlay && slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 10000);
      return () => clearInterval(timer);
    }
  }, [isAutoPlay, slides.length]);

  const fetchHeroContent = () => {
    setLoading(true);
    setSlides([
      {
        id: 1,
        title: "Nourishing Ghana's Future",
        subtitle: "Providing nutritious meals to school children across Ghana",
        description: "The Ghana School Feeding Programme ensures that every child has access to quality nutrition, supporting their growth, education, and development.",
        image: "/Hero1.jpg",
        buttonText: "Learn More",
        buttonLink: "#about"
      },
      {
        id: 2,
        title: "Healthy Meals, Bright Futures",
        subtitle: "Partnering with local communities for sustainable nutrition",
        description: "Our programme works with local farmers and caterers to provide fresh, locally-sourced meals that promote both health and economic development.",
        image: "/Hero2.jpg",
        buttonText: "Our Impact",
        buttonLink: "#impact"
      },
      {
        id: 3,
        title: "Building Stronger Communities",
        subtitle: "Empowering local farmers and caterers across all regions",
        description: "Through sustainable partnerships, we create jobs and support local agriculture while feeding the next generation of Ghanaian leaders.",
        image: "/Hero4.jpg",
        buttonText: "Get Involved",
        buttonLink: "#contact"
      }
    ]);
    setLoading(false);
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  if (loading) {
    return (
      <section className="relative h-screen overflow-hidden bg-ghana-primary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ghana-secondary-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading hero content...</p>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-screen overflow-hidden bg-ghana-primary-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">No hero content available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen overflow-hidden bg-ghana-primary-900">
      <AnimatePresence>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0 }}
          className="relative h-full"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${slides[currentSlide].image})`
            }}
          />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4"
              >
                {slides[currentSlide].title}
              </motion.h1>
              <motion.h2
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl md:text-2xl lg:text-3xl text-ghana-neutral-200 mb-6 font-light"
              >
                {slides[currentSlide].subtitle}
              </motion.h2>
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-lg md:text-xl text-ghana-neutral-200 mb-8 max-w-3xl mx-auto"
              >
                {slides[currentSlide].description}
              </motion.p>
              <motion.a
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                href={slides[currentSlide].buttonLink}
                className="inline-block bg-ghana-secondary-600 hover:bg-ghana-secondary-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                {slides[currentSlide].buttonText}
              </motion.a>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-300 z-20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-300 z-20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Auto-play Control */}
      <button
        onClick={() => setIsAutoPlay(!isAutoPlay)}
        className="absolute bottom-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-300 z-20"
      >
        {isAutoPlay ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </section>
  );
});

export default Hero;
