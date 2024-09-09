import React from 'react';
import classNames from 'classnames';

import style from './Pill.module.scss';

type PillProps = {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
  color?: string;
};

const Pill = ({ children, onClick, selected = true, className }: PillProps) => {
  const classes = classNames(
    style.pill,
    {
      [style.notSelected]: !selected,
      [style.clickable]: onClick
    },
    className
  );

  if (onClick) {
    return (
      <button
        className={classes}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
  return <div className={classes}>{children}</div>;
};

export default Pill;
