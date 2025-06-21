import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import MiddleSection from '../components/MiddleSection';
import { homeObjOne, homeObjThree, homeObjTwo } from '../components/MiddleSection/Data';
import Footer from '../components/Footer';

const Home = ({ isOpen, toggle }) => {
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} position="overlay" />
      <HeroSection />
      <MiddleSection {...homeObjOne} />
      <MiddleSection {...homeObjTwo} />
      <MiddleSection {...homeObjThree} />
      <Footer />
    </>
  );
};

export default Home;
