import React from 'react'; 
import { motion } from 'framer-motion';
import { FaSpaceShuttle } from 'react-icons/fa';
import Section from '../layout/Section';

const HeroSection = () => {
  return (
    <Section id="hero">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, type: 'spring' }}
      >
        <FaSpaceShuttle className="hero-rocket" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Powerful Websites Built for Small Businesses
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Launch your business online today with an affordable, high-quality website designed to attract customers and grow your brand.
      </motion.p>
      <motion.div
        className="hero-buttons"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <a href="#contact" className="btn btn-primary">Get Started</a>
        {/* The "Book a Demo" button has been removed */}
      </motion.div>
    </Section>
  );
};

export default HeroSection;