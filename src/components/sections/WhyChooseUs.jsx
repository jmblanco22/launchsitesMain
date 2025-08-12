import React from 'react'; 
import Section from '../layout/Section';
import Card from '../layout/Card';
import { FaBolt, FaPalette, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const features = [
  { icon: <FaBolt />, title: 'Warp Speed', description: 'Our websites are optimized for speed, providing an instant user experience.' },
  { icon: <FaPalette />, title: 'Stunning Design', description: 'We create visually captivating designs that are out of this world.' },
  { icon: <FaShieldAlt />, title: 'Ironclad Security', description: 'Your digital assets are protected with the latest security protocols.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const WhyChooseUs = () => {
  return (
    <Section id="features">
      {/* Updated Header Layout */}
      <div className="section-header">
        <div className="section-header-title">
          <h2>Why Choose Us?</h2>
        </div>
        <div className="section-header-subtitle">
          <p>Our crew is dedicated to navigating the complexities of web development so you can focus on your destination. We provide the thrust you need to achieve escape velocity.</p>
        </div>
      </div>

      <motion.div
        className="card-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {features.map((feature, index) => (
          <Card key={index} icon={feature.icon} title={feature.title} description={feature.description} />
        ))}
      </motion.div>
    </Section>
  );
};

export default WhyChooseUs;