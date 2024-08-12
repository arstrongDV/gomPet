'use client';

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { range } from 'lodash';

import { Icons } from 'src/assets/icons';

import style from './StarRating.module.scss';

type StarIconProps = {
  color?: string;
  strokeWidth?: number;
  size?: number;
  percentage: number;
};

const Star = ({ percentage = 0, size = 24 }: StarIconProps) => {
  const classes = classNames(style.starIcon);
  const props = {
    height: size,
    width: size,
    className: classes
  };

  if (percentage <= 25) return <Icons.bone {...props} />;
  if (percentage > 25 && percentage < 100) return <Icons.bone {...props} />;
  return <Icons.boneFilled {...props} />;
};

type StarRatingProps = {
  rating: number;
  readonly?: boolean;
  numberOfStars?: number;
  onChange?: (rating: number) => void;
  className?: string;
  starSize?: number;
  showInfo?: boolean;
};

const StarRating = (props: StarRatingProps) => {
  const {
    className,
    rating = 0,
    numberOfStars = 5,
    onChange,
    starSize = 24,
    readonly = false,
    showInfo = false
  } = props;

  const [currentRating, setCurrentRating] = useState<number>(rating);
  const [hoverIndex, setHoverIndex] = useState<number>(rating || 0);

  const changeable = !readonly && onChange;

  useEffect(() => {
    setCurrentRating(rating);
    setHoverIndex(rating || 0);
  }, [rating]);

  const handleRatingChange = (e: any, index: number) => {
    e.preventDefault();
    if (readonly || !onChange) return;

    if (index === currentRating) {
      onChange && onChange(0);
      setCurrentRating(0);
      return;
    }

    onChange && onChange(index);
    setCurrentRating(index);
  };

  const classes = classNames(
    style.starList,
    {
      [style.readonly]: readonly || !onChange
    },
    className
  );

  return (
    <div className={classes}>
      {range(1, numberOfStars + 1).map(
        (num) =>
          num <= numberOfStars && (
            <button
              key={num}
              className={classNames(style.starListItem, {
                [style.button]: !readonly && onChange
              })}
              onClick={(e) => handleRatingChange(e, num)}
              onMouseEnter={changeable ? () => setHoverIndex(num) : undefined}
              onMouseLeave={changeable ? () => setHoverIndex(currentRating) : undefined}
            >
              <Star
                percentage={
                  hoverIndex >= num ? 100 : hoverIndex > num - 1 && hoverIndex < num ? (hoverIndex - num + 1) * 100 : 0
                }
                size={starSize}
              />
            </button>
          )
      )}
      {showInfo && <span className={style.message}>{rating > 0 ? rating?.toFixed(1) : 'brak oceny'}</span>}
    </div>
  );
};

export default StarRating;
