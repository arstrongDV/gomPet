'use client';

import { useWindowSize } from 'components';

// isMobileSsr should be passed from getStaticProps or getServerSideProps to page, and then to this hook
const useIsMobile = ({ breakpoint = 1024, isMobileSsr = false }: { breakpoint?: number; isMobileSsr?: boolean }) => {
  const { width: windowWidth } = useWindowSize();
  const isWidthMobile = !!windowWidth && windowWidth < breakpoint;

  return isMobileSsr || isWidthMobile;
};

export default useIsMobile;
