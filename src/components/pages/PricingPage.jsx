import React from 'react';
import Section from '../layout/Section';
import Card from '../layout/Card';
import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

// More detailed plans for the full page
const fullPlans = [
  {
    name: 'Starter Package',
    fee: '$500',
    monthly: '$70 / month',
    features: [
      'Up to 5 Pages',
      'Mobile Responsive Design',
      'Basic On-Page SEO Setup',
      'Monthly Software Updates & Security Scans',
      'Daily Backups'
    ]
  },
  {
    name: 'Business Growth',
    fee: '$700',
    monthly: '$100 / month',
    features: [
      'Up to 10 Pages',
      'Mobile Responsive Design',
      'Enhanced On-Page SEO (Includes keyword research)',
      'E-Commerce Ready (Setup for up to 10 products)',
      'External API and Backend Integration',
      'Everything in Starter Maintenance + Performance Monitoring'
    ]
  },
  {
    name: 'Pro Scale',
    fee: '$900',
    monthly: '$200 / month',
    features: [
      'Up to 15 Pages',
      'Mobile Responsive Design',
      'Enhanced On-Page SEO (Includes keyword research)',
      'E-Commerce Ready',
      'Blog & Portfolio Integration',
      'External API and Backend Integration',
      'Customizable Features and Process',
      'Everything in Business Maintenance + Priority Support'
    ]
  }
];



const PricingPage = () => {
  return (
    <Section id="full-pricing">
        <div className="section-header" style={{ paddingTop: '5rem' }}>
            <div className="section-header-title">
                <h2>Our Mission Plans</h2>
            </div>
            <div className="section-header-subtitle">
                <p>We offer flexible and transparent plans designed to meet your business needs at any stage of growth. Find the perfect trajectory for your project.</p>
            </div>
        </div>
        <motion.div 
            className="card-grid"
            initial="hidden"
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.2 } }
            }}
        >
            {fullPlans.map(plan => {
              let link = "#";
              if (plan.name === "Starter Package") link = "https://square.link/u/E6TRpBFw";
              if (plan.name === "Business Growth") link = "https://square.link/u/aatZABfO";
              if (plan.name === "Pro Scale") link = "https://square.link/u/sX3LFoES";
              return (
                <Card key={plan.name} title={plan.name}>
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
                  <ul className="pricing-card-features">
                    {plan.features.map(feature => (
                      <li key={feature}><FaCheckCircle /> {feature}</li>
                    ))}
                  </ul>
                  <a
                    href={link}
                    className="btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Select Plan
                  </a>
                </Card>
              );
            })}
        </motion.div>
    </Section>
  );
};

export default PricingPage;