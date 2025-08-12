import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ children, id }) => {
  return (
    // The outer section provides the full-width background and padding
    <motion.section
      id={id}
      className={`section ${id === 'hero' ? 'hero-section' : ''}`}
    >
      {/* This inner wrapper centers the content and applies animations */}
      <motion.div
        className="section-content-wrapper"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
};

export default Section;