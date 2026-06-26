import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye } from 'lucide-react';

const MissionVision = () => {
  const cards = [
    {
      id: 1,
      title: "Our Mission",
      icon: Target,
      description: "To ensure that every school child in Ghana has access to nutritious, locally-sourced meals that support their physical and cognitive development, while fostering sustainable partnerships with local farmers and communities.",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      title: "Our Vision",
      icon: Eye,
      description: "A Ghana where every child is well-nourished, healthy, and able to reach their full potential through quality education and nutrition, creating a brighter future for the nation.",
      color: "from-green-500 to-green-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-white" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            The Ghana School Feeding Programme
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The Ghana School Feeding Programme (GSFP) is an initiative of the comprehensive Africa Agricultural Development Programme (CAADP) Pillar 3 which seeks to enhance food security and reduce hunger in line with the United Nations (UN) Sustainable Development Goals (MDGs) on hunger, poverty and malnutrition.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid md:grid-cols-2 gap-8 lg:gap-12"
        >
          {cards.map((card) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={card.id}
                variants={cardVariants}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl shadow-lg p-8 group hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ghana-primary-100 text-ghana-primary-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-ghana-primary-600 transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-ghana-primary-600 mb-2">2M+</div>
            <div className="text-gray-600">Children Fed Daily</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-ghana-secondary-600 mb-2">16</div>
            <div className="text-gray-600">Regions Covered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-ghana-primary-600 mb-2">50K+</div>
            <div className="text-gray-600">Local Jobs Created</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-ghana-secondary-600 mb-2">98%</div>
            <div className="text-gray-600">Attendance Rate</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVision;
