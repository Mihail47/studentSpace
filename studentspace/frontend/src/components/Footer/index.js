import React from 'react'
import { animateScroll as scroll } from 'react-scroll'
import { FooterContainer,
         FooterWrap,
         FooterLinksContainer,
         FooterLinksWrapper,
         FooterLinkItems,
         FooterLinkTitle,
         FooterLink,
         SocialMedia,
         SocialMediaWrap,
         SocialLogo,
         WebRights,
         SIcons,
         SILink
         } from './FooterElements'
import { FaInstagram } from 'react-icons/fa'
import { FaFacebook } from 'react-icons/fa'
import { FaYoutube } from 'react-icons/fa'
import { FaTwitter } from 'react-icons/fa'

const Footer = () => {
    const toggleHome = () => {
        scroll.scrollToTop();
      }

  return (
    <FooterContainer>
    <FooterWrap>
        <FooterLinksContainer>
            <FooterLinksWrapper>
                <FooterLinkItems>
                    <FooterLinkTitle>Get Started</FooterLinkTitle>
                        <FooterLink to='/news'>Today's news</FooterLink>
                        <FooterLink to='/'>Community guidelines</FooterLink>
                </FooterLinkItems>
                <FooterLinkItems>
                    <FooterLinkTitle>About Us</FooterLinkTitle>
                        <FooterLink to='/'>How it works</FooterLink>
                        <FooterLink to='/'>Cookies & online safety</FooterLink>
                        <FooterLink to='/'>Terms & conditions</FooterLink>
                        <FooterLink to='/'>Ad privacy setting</FooterLink>
                        <FooterLink to='/'>Contact us</FooterLink>
                </FooterLinkItems>
                <FooterLinkItems>
                    <FooterLinkTitle>Contact Us</FooterLinkTitle>
                        <FooterLink to='/'>Support</FooterLink>
                </FooterLinkItems>
                </FooterLinksWrapper>
                </FooterLinksContainer>
                <SocialMedia>
                    <SocialMediaWrap>
                        <SocialLogo to='/' onClick={toggleHome}>
                            StudentSpace
                        </SocialLogo>
                        <WebRights>StudentSpace © 2025. ALl rights reserved.</WebRights>
                        <SIcons>
                            <SILink>
                                <FaFacebook />
                            </SILink>
                            <SILink>
                                <FaInstagram />
                            </SILink>
                            <SILink>
                                <FaYoutube />
                            </SILink>
                            <SILink>
                                <FaTwitter />
                            </SILink>
                        </SIcons>
                    </SocialMediaWrap>
                </SocialMedia>
    </FooterWrap>
    </FooterContainer>
  )
}

export default Footer