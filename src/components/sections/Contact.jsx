import React, { useState } from 'react';
import Section from '../layout/Section';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaSpinner, FaCheckCircle } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('sending');

    try {
      const response = await fetch("https://formspree.io/f/mblkyzaw", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionStatus('success');
        setIsSubmitted(true); 
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error(error);
      setSubmissionStatus('error');
      setTimeout(() => setSubmissionStatus('idle'), 3000);
    }
  };
  
  const renderButtonContent = () => {
    switch (submissionStatus) {
        case 'sending':
          return (
            <div className="submit-button-content">
              <FaSpinner className="spinner" /> Sending...
            </div>
          );
        case 'success':
          return (
            <div className="submit-button-content">
              <FaCheckCircle /> Message Sent!
            </div>
          );
        case 'error':
          return 'Error - Try Again';
        default:
          return (
             <div className="submit-button-content">
               <FaPaperPlane /> Transmit Message
             </div>
          );
      }
  };

  // 1. Create a variable to check if all form fields are filled.
  //    The .trim() removes whitespace to ensure the user can't just enter spaces.
  const isFormValid = formData.name.trim() && formData.email.trim() && formData.message.trim();

  return (
    <Section id="contact">
      <div className="section-header">
        <div className="section-header-title">
          <h2>Get Started on Your Mission</h2>
        </div>
        <div className="section-header-subtitle">
          <p>Ready to launch? Send us a message, and let's chart the course for your new website.</p>
        </div>
      </div>

      {isSubmitted ? (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center' }}
        >
            <h3>Thank You!</h3>
            <p>Your message has been transmitted. We'll be in touch shortly to begin the countdown.</p>
        </motion.div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="name" 
            placeholder="Your Name" 
            value={formData.name}
            onChange={handleInputChange}
            required 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Your Email" 
            value={formData.email}
            onChange={handleInputChange}
            required 
          />
          <textarea 
            name="message" 
            placeholder="Your Message" 
            rows="5"
            value={formData.message}
            onChange={handleInputChange}
            required
          ></textarea>

          {/* 2. Update the disabled logic on the button. */}
          {/* It's now disabled if the form ISN'T valid OR if it's currently sending. */}
          <motion.button
            type="submit"
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!isFormValid || submissionStatus === 'sending'}
          >
            {renderButtonContent()}
          </motion.button>
        </form>
      )}
    </Section>
  );
};

export default Contact;