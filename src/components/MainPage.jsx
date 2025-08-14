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
      <HeroSection />
      <WhatWeDo />
      <WhyChooseUs />
      <Portfolio />
      <PricingPreview />
      <Testimonials />
      <Contact />
    </>
  );
};
//<Contact />
export default HomePage;