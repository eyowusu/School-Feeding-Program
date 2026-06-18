import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Location',
      details: ['GHANA SCHOOL FEEDING PROGRAMME', 'P.O.BOX 1627 State House, Accra'],
      color: 'text-ghana-primary-600'
    },
    {
      icon: Phone,
      title: 'Phone',
      details: ['Tel: 0508563053', 'Toll Free: 080068856'],
      color: 'text-ghana-secondary-600'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['contact@gsfp@mogcsp.gov.gh'],
      color: 'text-ghana-primary-600'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: ['Monday - Friday: 8:00 AM - 5:00 PM'],
      color: 'text-ghana-secondary-600'
    }
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://www.facebook.com/p/Ghana-School-Feeding-Programme-100069106004464/',
      color: 'hover:text-blue-600 bg-blue-500',
      bgIcon: 'bg-blue-600'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://twitter.com/GhanaSchoolFeeding',
      color: 'hover:text-blue-400 bg-blue-400',
      bgIcon: 'bg-blue-500'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://www.instagram.com/ghanaschoolfeedingprogramme',
      color: 'hover:text-pink-500 bg-gradient-to-br from-pink-500 to-purple-500',
      bgIcon: 'bg-gradient-to-br from-pink-600 to-purple-600'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      href: '#', // Would need actual YouTube channel URL
      color: 'hover:text-red-600 bg-red-500',
      bgIcon: 'bg-red-600'
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
    <section className="py-20 bg-white" id="contact">
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
            Contact Us
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with the Ghana School Feeding Programme. We're here to help and answer your questions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
            <p className="text-gray-600 mb-8">
              Whether you have questions about our programs, want to partner with us, or need support for your community, we're here to help.
            </p>

            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    className="flex items-start space-x-4"
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center ${info.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{info.title}</h4>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Social Media Links */}
            <div className="mt-8">
              <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className={`w-12 h-12 rounded-lg ${social.bgIcon} text-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg`}
                      aria-label={social.name}
                    >
                      <IconComponent className="h-6 w-6" />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-gray-50 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircle className="h-16 w-16 text-ghana-secondary-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Message Sent Successfully!</h4>
                <p className="text-gray-600">
                  Thank you for contacting us. We'll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ghana-primary-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ghana-primary-500 focus:border-transparent transition-colors duration-200"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ghana-primary-500 focus:border-transparent transition-colors duration-200"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ghana-primary-500 focus:border-transparent transition-colors duration-200 resize-none"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-ghana-primary-600 hover:bg-ghana-primary-700 disabled:bg-ghana-neutral-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Ministry Link */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-ghana-primary-50 rounded-xl p-6 max-w-2xl mx-auto">
            <h4 className="font-semibold text-gray-900 mb-2">Government Partnership</h4>
            <p className="text-gray-600 mb-4">
              The Ghana School Feeding Programme is implemented under the Ministry of Gender, Children and Social Protection.
            </p>
            <a
              href="https://www.mogcsp.gov.gh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-ghana-primary-600 hover:text-ghana-primary-700 font-medium transition-colors duration-200"
            >
              Visit Ministry Website
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
