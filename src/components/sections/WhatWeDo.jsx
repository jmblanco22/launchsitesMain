import React from 'react'; 
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import Card from '../layout/Card';
import { FaCode, FaShoppingCart, FaBullhorn, FaRocket } from 'react-icons/fa';

const services = [
  { icon: <FaCode />, title: 'Web Development', description: 'Crafting pixel-perfect, responsive websites from scratch. Ensuring your website is blazing fast for an optimal user experience.' },
  { icon: <FaShoppingCart />, title: 'E-Commerce Solutions', description: 'Building powerful online stores that convert visitors into customers.' },
  { icon: <FaBullhorn />, title: 'SEO & Marketing', description: 'Optimizing your site to rank higher and reach a wider audience.' }
 // { icon: <FaRocket />, title: 'Performance Tuning', description: 'Ensuring your website is blazing fast for an optimal user experience.' },
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

const WhatWeDo = () => {
  return (
    <Section id="services">
      {/* Updated Header Layout */}
      <div className="section-header">
        <div className="section-header-title">
          <h2>What We Do</h2>
        </div>
        <div className="section-header-subtitle">
          <p>Our missions are designed to secure your success in the digital cosmos. We offer a constellation of services to navigate the vast expanse of the web.</p>
        </div>
      </div>

      <motion.div
        className="card-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {services.map((service, index) => (
          <Card key={index} icon={service.icon} title={service.title} description={service.description} />
        ))}
      </motion.div>
    </Section>
  );
};

export default WhatWeDo;