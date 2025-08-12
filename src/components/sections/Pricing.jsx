import React from 'react'; 
import Section from '../layout/Section';
import Card from '../layout/Card';
import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const plans = [
    // ... (keep the existing plans array as it is)
    {
        name: 'The Starter Package',
        fee: '$500',
        monthly: '$40 / month',
        bestFor: "New businesses or freelancers needing a polished, credible online presence.",
        features: ["Up to 5 core pages", "User-Friendly CMS w/ Training", "Responsive Design", "Integrated Contact Form", "Basic SEO Setup"],
    },
    {
        name: 'The Business Growth Package',
        fee: '$700',
        monthly: '$70 / month',
        bestFor: "Growing businesses that want to use their website as an active marketing tool.",
        features: ["Everything in Starter", "Up to 10 pages", "Advanced Features (Blog, Galleries)", "Local SEO Focus", "Google Analytics 4 Setup"],
    },
    {
        name: 'The Pro Scale Package',
        fee: '$900',
        monthly: '$100 / month',
        bestFor: "Established businesses aiming for aggressive growth and market leadership.",
        features: ["Everything in Business Growth", "Up to 15 pages", "Free Domain Name (1st Year)", "Comprehensive SEO Strategy", "Priority Support & Quarterly Calls"],
    },
];

const carePlanFeatures = [
    "Daily Cloud Backups", "24/7 Uptime Monitoring", "Weekly Security Scans",
    "Plugin & Core Updates", "Performance Optimization", "Basic Content Update Support (30min/mo)"
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
};

const PricingPage = () => {
  return (
    <>
      <Section id="pricing-page">
        <div className="hybrid-model-info">
          <h2>The Hybrid Pricing Model</h2>
          <p>
            Instead of unpredictable hourly billing, we use a hybrid model. You get a fixed, one-time price for the project scope, giving you peace of mind. Any work outside the original scope is handled at a clear hourly rate ($45/hour). This offers a predictable budget while protecting you from scope creep.
          </p>
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
              <p className="plan-best-for">{plan.bestFor}</p>
              <div className="price-tag">
                <span className="price-fee">{plan.fee}</span>
                <span className="price-monthly">{plan.monthly}</span>
              </div>
              <ul className="pricing-card-features">
                {plan.features.map(feature => (
                  <li key={feature}><FaCheckCircle /> {feature}</li>
                ))}
              </ul>
              <NavLink to="/#contact" className="btn btn-primary">
                Select Plan
              </NavLink>
            </Card>
          ))}
        </motion.div>
      </Section>

      {/* NEW DEEPER EXPLANATION SECTION */}
      <Section id="care-plan-details">
        <div className="section-header">
            <div className="section-header-title">
                <h2>Monthly Care Plan Details</h2>
            </div>
            <div className="section-header-subtitle">
                <p>Every plan includes our comprehensive Monthly Care Plan to ensure your website remains secure, fast, and up-to-date. Think of us as your mission control, keeping your digital presence in perfect orbit.</p>
            </div>
        </div>
        <div className="care-plan-grid">
            {carePlanFeatures.map(feature => (
                <div key={feature} className="care-plan-item">
                    <FaCheckCircle />
                    <span>{feature}</span>
                </div>
            ))}
        </div>
      </Section>
    </>
  );
};

export default PricingPage;