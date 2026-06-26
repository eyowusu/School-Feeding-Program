import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail } from 'lucide-react';

const Leadership = () => {
  const leaders = [
    {
      id: 1,
      name: "Mrs. Hajia Fati Forgor", 
      position: "National Coordinator",
      bio: "Leading Ghana's school feeding initiative with dedication and commitment to ensuring every child receives nutritious meals for better education and health outcomes.",
      image: "/Our Leadership.jpeg",
      linkedin: "#",
      twitter: "#",
      email: "hajia.fati@gsfp.gov.gh"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <section className="py-20 bg-gray-50" id="leadership">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Leadership
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the dedicated professional driving Ghana's school feeding revolution
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-1 lg:grid-cols-1 gap-8 max-w-7xl mx-auto"
        >
          {leaders.map((leader) => (
            <motion.div
              key={leader.id}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
              className="bg-white rounded-xl shadow-lg p-6 group hover:shadow-xl transition-all duration-300"
            >
              <div className="text-center mb-4">
                <div className="w-64 h-80 mx-auto mb-6 rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/320/320';
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-ghana-primary-600 transition-colors duration-300">
                  {leader.name}
                </h3>
                <p className="text-ghana-primary-600 font-medium mb-4">
                  {leader.position}
                </p>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {leader.bio}
              </p>
              <div className="flex justify-center space-x-3">
                <a
                  href={leader.linkedin}
                  className="bg-ghana-primary-600 hover:bg-ghana-primary-700 text-white p-2 rounded-full transition-colors duration-200"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href={leader.twitter}
                  className="bg-ghana-secondary-600 hover:bg-ghana-secondary-700 text-white p-2 rounded-full transition-colors duration-200"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href={`mailto:${leader.email}`}
                  className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors duration-200"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Leadership;
