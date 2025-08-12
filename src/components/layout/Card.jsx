import React from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const Card = ({ icon, title, description, children }) => {
  return (
    <motion.div
      className="card"
      variants={cardVariants}
      whileHover={{ scale: 1.05, y: -10 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {icon && <div className="card-icon">{icon}</div>}
      {title && <h3>{title}</h3>}
      {description && <p>{description}</p>}
      {children}
    </motion.div>
  );
};

export default Card;