'use client';

import React, { useCallback, useEffect, useRef } from 'react';

type InfinityScrollProps = {
    loadMore: () => Promise<void>;
    hasNext: boolean;
    children: React.ReactNode;
    rootRef?: React.RefObject<HTMLElement | null>;
};

const InfinityScroll = ({ children, loadMore, hasNext, rootRef }: InfinityScrollProps) => {
    const guardRef = useRef<HTMLDivElement | null>(null);
    const isFetchingRef = useRef(false);

    const handleObserver = useCallback(
        async (entries: IntersectionObserverEntry[]) => {
          const entry = entries[0];
    
          if (!entry.isIntersecting) return;
          if (!hasNext) return;
          if (isFetchingRef.current) return;
    
          isFetchingRef.current = true;
          await loadMore();
          isFetchingRef.current = false;
        },
        [loadMore, hasNext]
      );

      useEffect(() => {
        const guardEl = guardRef.current;
        if (!guardEl) return;
      
        const observer = new IntersectionObserver(handleObserver, {
          root: rootRef?.current || null,
          rootMargin: '200px',
          threshold: 0,
        });
      
        observer.observe(guardEl);
      
        return () => observer.disconnect();
      }, [handleObserver, rootRef, hasNext]);

    return (
        <>
            {children}
            <div ref={guardRef} style={{ height: '1px' }}></div>
        </>
    );
};

export default InfinityScroll;
