'use client';

import React from 'react';
import classNames from 'classnames';

import { PAGINATION_DOTS, usePagination } from './usePagination';

import styles from './Pagination.module.scss';

type PaginationProps = {
  className?: string;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  isMobileSsr?: boolean;
};

const Pagination = (props: PaginationProps) => {
  const { className, currentPage, pageSize, totalCount, onPageChange, siblingCount = 1 } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
    isMobileSsr: props.isMobileSsr
  });

  if (!paginationRange) return null;

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul className={classNames(styles.container, className)}>
      {/* Left navigation arrow */}
      <li
        key={'page-previous'}
        className={classNames(styles.paginationItem, {
          [styles.disabled]: +currentPage === 1
        })}
        onClick={onPrevious}
      >
        <div className={classNames(styles.arrow, styles.left)} />
      </li>

      {paginationRange.map((pageNumber, i) => {
        // If the pageItem is a DOT, render the DOTS unicode character
        if (pageNumber === PAGINATION_DOTS) {
          return (
            <li
              key={`page-dots-${i}`}
              className={classNames(styles.paginationItem, styles.dots)}
            >
              &#8230;
            </li>
          );
        }

        // Render Page Pills
        return (
          <li
            key={`page-${pageNumber}`}
            className={classNames(styles.paginationItem, {
              [styles.selected]: +pageNumber === +currentPage
            })}
            onClick={() => onPageChange(+pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}

      {/*  Right Navigation arrow */}
      <li
        key={'page-next'}
        className={classNames(styles.paginationItem, {
          [styles.disabled]: +currentPage === +lastPage
        })}
        onClick={onNext}
      >
        <div className={classNames(styles.arrow, styles.right)} />
      </li>
    </ul>
  );
};

export default Pagination;
