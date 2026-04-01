'use client';

import { useEffect, useState } from 'react';

import { isServer } from 'src/utils/helpers';

const useIsScrollingUp = () => {
  let prevScroll: number;

  //if it is SSR then check you are now on the client and window object is available
  if (!isServer()) {
    prevScroll = window.scrollY;
  }

  const [isScrollingUp, setIsScrollingUp] = useState(false);

  const handleScroll = () => {
    const currScroll = window.scrollY;
    const isScrolled = prevScroll > currScroll;
    setIsScrollingUp(isScrolled);
    prevScroll = currScroll;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return isScrollingUp;
};

export default useIsScrollingUp;
