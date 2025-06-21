import React from 'react'
import {Button} from '../ButtonElement';
import { Img } from './MiddleElements';
import { MiddleContainer,
         MiddleWrapper,
         MiddleRow,
         Column1,
         Column2,
         TextWrapper,
         TopLine,
         Heading,
         Subtitle,
         BtnWrap,
         ImgWrap
         } from './MiddleElements';

const MiddleSection = ({lightBg,id,imgStart,topline,lightText,
    headline,darkText,description,buttonLabel,buttonLink, img,alt,primary,dark,dark2}) => {
  return (
    <>
    <MiddleContainer lightBg= {lightBg} id = {id}>
        <MiddleWrapper>
            <MiddleRow imgStart = {imgStart}>
                <Column1>
                <TextWrapper>
                  <TopLine>{topline}</TopLine>
                  <Heading lightText={lightText}> {headline} </Heading>
                  <Subtitle darkText={darkText}>{description}</Subtitle>
                  <BtnWrap>
                    <Button to={buttonLink}
                    smooth ={true}
                    duration={500}
                    spy={true}
                    exact='true'
                    offset={-80}
                    primary={primary ? 1:0}
                    dark={primary ? 1:0}
                    dark2={primary ? 1:0}
                    >{buttonLabel}</Button>
                  </BtnWrap>
                </TextWrapper>
                </Column1>
                <Column2>
                <ImgWrap>
                <Img src={img} alt={alt}/>
                </ImgWrap>
                </Column2>
            </MiddleRow>
        </MiddleWrapper>
    </MiddleContainer>
    </>

  )
}

export default MiddleSection