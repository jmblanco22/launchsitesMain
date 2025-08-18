import React from 'react'; 
import HeroSection from '../components/sections/HeroSection';
import WhatWeDo from '../components/sections/WhatWeDo';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import Portfolio from '../components/sections/Portfolio';
import Testimonials from '../components/sections/Testimonials';
import Contact from '../components/sections/Contact';
import PricingPreview from '../components/sections/PricingPreviews';


const HomePage = () => {
  return (
    <>
      <section id="herosection"><HeroSection /></section>
      <section id="services"><WhatWeDo /></section>
      <section id="features"><WhyChooseUs /></section>
      <section id="portfolio"><Portfolio /></section>
      <section id="pricing"><PricingPreview /></section>
      <section id="testimonials"><Testimonials /></section>
      <section id="contact"><Contact /></section>
    </>
  );
};
//<Contact />
export default HomePage;