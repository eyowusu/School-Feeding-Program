import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const Partners = () => {
  const partners = [
    {
      id: 1,
      name: "Ministry of Gender, Children and Social Protection",
      logo: "/coat1.jpg",
      type: "Government Partner",
      description: "Ensuring child protection and social welfare in school feeding programs.",
      website: "https://www.mogcsp.gov.gh/",
      category: "government"
    },
    {
      id: 2,
      name: "World Food Programme",
      logo: "/wfp-logo.svg",
      type: "International Partner",
      description: "Global leader in fighting hunger worldwide, providing technical expertise and funding support.",
      website: "https://www.wfp.org",
      category: "international"
    },
    {
      id: 3,
      name: "Ghana Education Service",
      logo: "/coat1.jpg",
      type: "Government Partner",
      description: "Collaborating on policy development and ensuring alignment with national education goals.",
      website: "https://ges.gov.gh/",
      category: "government"
    },
    {
      id: 4,
      name: "UNICEF Ghana",
      logo: "/unicef-logo.svg",
      type: "UN Agency",
      description: "Supporting child nutrition programs and monitoring child development outcomes.",
      website: "https://www.unicef.org/ghana",
      category: "international"
    },
    {
      id: 5,
      name: "Ghana Health Service",
      logo: "/coat1.jpg",
      type: "Government Partner",
      description: "Providing nutritional guidelines and health monitoring for school children.",
      website: "https://ghs.gov.gh/",
      category: "government"
    },
    {
      id: 6,
      name: "World Bank",
      logo: "/world-bank-logo.svg",
      type: "International Partner",
      description: "Providing financial support and technical assistance for sustainable school feeding programs.",
      website: "https://www.worldbank.org",
      category: "international"
    },
    {
      id: 7,
      name: "CARE International",
      logo: "/coat1.jpg",
      type: "International Partner",
      description: "Working in Ghana to provide emergency aid, boost equality for women and girls, help communities adapt to climate change, and increase access to health services, food, and water.",
      website: "https://www.care-international.org/our-work/where-we-work/ghana",
      category: "international"
    },
    {
      id: 8,
      name: "Ministry of Climate Change and Sustainability",
      logo: "/coat1.jpg",
      type: "Government Partner",
      description: "Natural Resources, Environment and Climate Change (NREC) Unit under the Ministry of Finance, focusing on climate resilience and sustainable development.",
      website: "https://mofep.gov.gh/divisions/rsd/climate-change",
      category: "government"
    },
    {
      id: 9,
      name: "Feed Ghana Programme",
      logo: "/coat1.jpg",
      type: "Government Partner",
      description: "Agricultural initiative supporting school feeding programs through local food production and farmer partnerships.",
      website: "https://mofa.gov.gh/site/index.php/feed-ghana",
      category: "government"
    },
    {
      id: 10,
      name: "Ghana Gold Board",
      logo: "/coat1.jpg",
      type: "Government Partner",
      description: "The sole authority with exclusive rights to buy, sell, weigh, grade, assay, value and export gold and other precious minerals in Ghana.",
      website: "https://goldbod.gov.gh/",
      category: "government"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

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

  const getCategoryColor = (category) => {
    switch (category) {
      case 'international':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'government':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'community':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'private':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'foundation':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'academic':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <section className="py-20 bg-gray-50" id="partners">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Partners
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Collaborating with global organizations, government agencies, and local communities to deliver comprehensive nutrition programs
          </p>
        </motion.div>


        {/* Partners Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {partners.map((partner) => (
            <motion.div
              key={partner.id}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
              className="bg-white rounded-xl shadow-lg p-6 group hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 mb-4 rounded flex items-center justify-center overflow-hidden">
                  <img src={partner.logo} alt={`${partner.name} logo`} className="max-w-full max-h-full object-contain" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-ghana-primary-600 transition-colors duration-300">
                  {partner.name}
                </h4>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border mb-3 ${getCategoryColor(partner.category)}`}>
                  {partner.type}
                </span>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {partner.description}
                </p>
                {partner.website !== "#" && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-ghana-primary-600 hover:text-ghana-primary-700 text-sm font-medium transition-colors duration-200 group-hover:translate-x-1 transform transition-transform duration-200"
                  >
                    Visit Website
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Partnership CTA */}
      </div>
    </section>
  );
};

export default Partners;
