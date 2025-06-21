import React from 'react';
import Footer from '../components/Footer';
import SignIn from '../components/SignIn';
import ScrollToTop from '../components/ScrollToTop';

const SignInPage = () => {
  return (
    <>
      <ScrollToTop />
      <SignIn />
      <Footer />
    </>
  );
};

export default SignInPage;
