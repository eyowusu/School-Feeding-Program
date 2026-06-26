import React from 'react';
import { motion } from 'framer-motion';
import {
  Utensils,
  Apple,
  Users,
  TrendingUp,
  Award,
  Heart,
  Target,
  CheckCircle
} from 'lucide-react';

const Programs = () => {
  const programs = [
    {
      id: 'feeding',
      title: 'School Feeding Program',
      icon: Utensils,
      description: 'Providing nutritious, locally-sourced meals to school children to improve attendance, concentration, and academic performance.',
      features: [
        'Daily balanced meals',
        'Local farmer partnerships',
        'Monitoring'
      ],
      stats: '2M+ Children Served Daily',
      color: 'ghana-secondary'
    },
    {
      id: 'nutrition',
      title: 'Nutrition Education',
      icon: Apple,
      description: 'Comprehensive nutrition education programs teaching children and families about healthy eating habits and food security.',
      features: [
        'Community workshops',
        'Cooking demonstrations'
      ],
      stats: '16 Regions Covered',
      color: 'ghana-primary'
    },
    {
      id: 'outreach',
      title: 'Community Outreach',
      icon: Users,
      description: 'Extending nutrition support beyond schools through community programs, farmer training, and sustainable agriculture initiatives.',
      features: [
        'Farmer Linkages programs',
        'Food security initiatives',
        'Local business development'
      ],
      stats: '50K+ Jobs Created',
      color: 'ghana-secondary'
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Improved Attendance',
      description: '98% school attendance rate with regular meals',
      value: '98%'
    },
    {
      icon: Award,
      title: 'Academic Performance',
      description: 'Enhanced concentration and learning outcomes',
      value: '+25%'
    },
    {
      icon: Heart,
      title: 'Health & Nutrition',
      description: 'Reduced malnutrition and improved health metrics',
      value: '85%'
    },
    {
      icon: Target,
      title: 'Economic Impact',
      description: 'Supporting local farmers and creating jobs',
      value: '50K+'
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
    <section className="py-20 bg-gray-50" id="programs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Programs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive nutrition and education initiatives that nourish Ghana's future generation
          </p>
        </motion.div>

        {/* Main Programs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {programs.map((program) => {
            const IconComponent = program.icon;
            return (
              <motion.div
                key={program.id}
                variants={cardVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group"
                id={program.id}
              >
                {/* Program Header */}
                <div className={`bg-gradient-to-r from-ghana-primary-600 to-ghana-primary-700 p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-white bg-opacity-20`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{program.stats.split(' ')[0]}</div>
                      <div className="text-sm opacity-90">{program.stats.split(' ').slice(1).join(' ')}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                </div>

                {/* Program Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {program.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 mb-6">
                    {program.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-ghana-secondary-600 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Impact Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-16 border border-gray-100"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Program Impact</h3>
            <p className="text-gray-600">Measurable results from our comprehensive nutrition initiatives</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ghana-primary-100 mb-4">
                    <IconComponent className="h-8 w-8 text-ghana-primary-600" />
                  </div>
                  <div className="text-2xl font-bold text-ghana-primary-600 mb-1">{benefit.value}</div>
                  <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Support Our Programs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-ghana-primary-600 to-ghana-primary-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Support Our Programs</h3>
            <p className="text-ghana-primary-100 mb-6 max-w-2xl mx-auto">
              Your contribution helps us expand our nutrition programs and reach more children across Ghana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  const element = document.getElementById('mandates');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="border-2 border-white text-white hover:bg-white hover:text-ghana-primary-700 font-bold py-3 px-8 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Learn More
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Programs;
