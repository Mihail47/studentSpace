import React, {useState} from 'react'
import Video from '../../videos/video1.mp4'
import {HeroContainer,
       HeroBackground,
       VideoBG,
       H1,
       HeroContent,
       HeroBtnWrapper,
       ArrowForward,
       ArrowRight
      } from './HeroElements'
import PTypingEffect from './TypingEffect'
import {Button} from '../ButtonElement'


const HeroSection = () => {
  const [hover, setHover] = useState(false)

  const onHover = () => {
    setHover(!hover)
  }

  return (
    <HeroContainer id = "home">
        <HeroBackground>
        <VideoBG autoPlay loop muted src = {Video} type='video/mp4'/>
        </HeroBackground>
        <HeroContent>
          <H1>Unlock Your Academic Potential</H1>
          <PTypingEffect/>
          <HeroBtnWrapper>
            <Button to = "/signin" 
            onMouseEnter ={onHover}
            onMouseLeave={onHover}
            primary = 'true'
            dark = 'true'
            >
              Get Started {hover ? <ArrowForward/> : <ArrowRight/>}
            </Button>
          </HeroBtnWrapper>
        </HeroContent>
    </HeroContainer>
  )
}

export default HeroSection