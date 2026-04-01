import { useMemo } from 'react';
import { range } from 'lodash';

import useIsMobile from 'src/components/hooks/useIsMobile';

export const PAGINATION_DOTS = '...';

type UsePaginationProps = {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
  isMobileSsr?: boolean;
};

export const usePagination = (props: UsePaginationProps) => {
  const { totalCount, pageSize, siblingCount = 1, currentPage } = props;
  const isMobile = useIsMobile({ breakpoint: 567, isMobileSsr: props.isMobileSsr });

  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    /*
      Case 1:
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount + 1);
    }

    /*
    	Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
    */
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

    /*
      We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
    */
    const shouldShowLeftDots = leftSiblingIndex > 1;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    /*
    	Case 2: No left dots to show, but rights dots to be shown
    */
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 * siblingCount;
      const leftRange = range(1, leftItemCount + 1);

      return [...leftRange, PAGINATION_DOTS, totalPageCount];
    }

    /*
    	Case 3: No right dots to show, but left dots to be shown
    */
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 * siblingCount;
      const rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount + 1);
      return [firstPageIndex, PAGINATION_DOTS, ...rightRange];
    }

    /*
    	Case 4: Both left and right dots to be shown
    */
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex + 1);
      if (isMobile) return middleRange;
      return [firstPageIndex, PAGINATION_DOTS, ...middleRange, PAGINATION_DOTS, lastPageIndex];
    }
  }, [totalCount, pageSize, siblingCount, currentPage, isMobile]);

  return paginationRange;
};
