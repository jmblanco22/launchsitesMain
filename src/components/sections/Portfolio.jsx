import React from 'react'; 
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import Card from '../layout/Card'; // Reusing your Card component for consistency

// This sub-component defines the content *inside* each portfolio card
const PortfolioCard = ({ title, description, url, technologies }) => {
  return (
    // We use the main Card component as the wrapper for consistent styling
    <Card>
      <div className="portfolio-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="portfolio-card-tech">
          {technologies.map((tech, index) => (
            <span key={index} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary" // Reusing your secondary button style
        >
          View Project
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1em', height: '1em'}}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </Card>
  );
};

const Portfolio = () => {
  const portfolioItems = [
    {
      title: "Smoke & Vape Shop",
      description: "A modern e-commerce web application for a smoke and vape shop featuring product catalog, shopping cart functionality, and responsive design.",
      url: "https://jmblanco22.github.io/smoke-vape-shop-webapp/",
      technologies: ["React", "JavaScript", "CSS", "E-commerce"]
    },
    {
      title: "Construction Company Mockup",
      description: "A professional construction company website mockup showcasing services, portfolio, and company information with modern design principles.",
      url: "https://jmblanco22.github.io/constructionMockup/",
      technologies: ["React", "HTML", "CSS", "Responsive Design"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <Section id="portfolio">
       <div className="section-header">
         <div className="section-header-title">
           <h2>Our Successful Missions</h2>
         </div>
         <div className="section-header-subtitle">
           <p>Explore the galaxies of projects we've successfully launched for our clients across the digital universe.</p>
         </div>
       </div>
      {/* Replaced the rigid grid with your animated, responsive card-grid */}
      <motion.div
        className="card-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {portfolioItems.map((item, index) => (
          <PortfolioCard
            key={index}
            title={item.title}
            description={item.description}
            url={item.url}
            technologies={item.technologies}
          />
        ))}
      </motion.div>
    </Section>
  );
};

export default Portfolio;