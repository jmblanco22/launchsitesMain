import React from 'react'; 
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import Card from '../layout/Card';
import { NavLink } from 'react-router-dom';

const plans = [
  { name: 'Starter Package', fee: '$400', monthly: '$50 / month' },
  { name: 'Business Growth', fee: '$600', monthly: '$70 / month' },
  { name: 'Pro Scale', fee: '$800', monthly: '$100 / month' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const PricingPreview = () => {
  return (
    <Section id="pricing">
       <div className="section-header">
         <div className="section-header-title">
           <h2>Mission Pricing</h2>
         </div>
         <div className="section-header-subtitle">
           <p>Choose a plan that fits your mission objectives. We offer transparent pricing for every voyage to the digital frontier.</p>
         </div>
       </div>

      <motion.div
        className="card-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {plans.map(plan => (
          <Card key={plan.name}>
            <h3>{plan.name}</h3>
            {/* New formatted price details */}
            <div className="price-details">
              <div className="price-item">
                <span className="price-label">One-Time Fee</span>
                <span className="price-value">{plan.fee}</span>
              </div>
              <div className="price-item">
                <span className="price-label">Maintenance</span>
                <span className="price-value">{plan.monthly}</span>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>
      
      <div className="see-more-container" style={{marginTop: '3rem'}}>
        <NavLink to="/pricing" className="btn btn-secondary">
            See Full Plan Details
        </NavLink>
      </div>
    </Section>
  );
};

export default PricingPreview;