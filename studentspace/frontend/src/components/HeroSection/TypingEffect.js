// TypingEffect.js
import React, { useState, useEffect } from 'react';
import { PTypingEffect } from './HeroElements';

const TypingEffect = () => {
  const texts = [
    "Sign up today and join a vibrant community of students.",
    "Enhance your learning experience and achieve success."
  ];

  const [currentText, setCurrentText] = useState('');
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !isDeleting) {
      setTimeout(() => setIsDeleting(true), 1400);
    } else if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % texts.length);
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, Math.max(isDeleting ? 20 : subIndex === texts[index].length ? 1000 :
      20, parseInt(Math.random() * 10)));

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, texts]);

  useEffect(() => {
    setCurrentText(texts[index].substring(0, subIndex));
  }, [subIndex, texts, index]);

  return (
    <PTypingEffect>
      {currentText}
    </PTypingEffect>
  );
};

export default TypingEffect;
