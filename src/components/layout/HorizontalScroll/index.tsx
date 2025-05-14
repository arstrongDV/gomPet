'use client';

import React, { useRef } from 'react';
import { useDraggable } from 'react-use-draggable-scroll';
import classNames from 'classnames';

import style from './HorizontalScroll.module.scss';

type HorizontalScrollProps = {
  children: React.ReactNode;
  withScrollbar?: boolean;
  className?: string;
};

const HorizontalScroll = (props: HorizontalScrollProps) => {
  const { children, className, withScrollbar } = props;

  const draggableRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events } = useDraggable(draggableRef, {
    // applyRubberBandEffect: true,
    decayRate: 0.96,
    safeDisplacement: 10
  });

  const containerStyles: string = classNames(
    style.container,
    {
      [style.withScrollbar]: withScrollbar
    },
    className
  );

  return (
    <div
      className={containerStyles}
      {...events}
      ref={draggableRef}
    >
      {children}
    </div>
  );
};

export default HorizontalScroll;
