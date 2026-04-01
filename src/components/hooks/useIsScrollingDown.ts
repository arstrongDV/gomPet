'use client';

import { useEffect, useState } from 'react';

import { isServer } from 'src/utils/helpers';

const useIsScrollingDown = () => {
  let prevScroll: number;

  //if it is SSR then check you are now on the client and window object is available
  if (!isServer()) {
    prevScroll = window.scrollY;
  }

  const [isScrollingDown, setIsScrollingDown] = useState(false);

  const handleScroll = () => {
    const currScroll = window.scrollY;
    const isScrolled = prevScroll < currScroll;
    setIsScrollingDown(isScrolled);
    prevScroll = currScroll;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return isScrollingDown;
};

export default useIsScrollingDown;
