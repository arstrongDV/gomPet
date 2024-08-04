import React from 'react';
import classNames from 'classnames';

import style from './Pill.module.scss';

type PillProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

const Pill = ({ children, onClick, className }: PillProps) => {
  if (onClick) {
    return (
      <button
        className={classNames(style.pill, style.clickable, className)}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
  return <div className={classNames(style.pill, className)}>{children}</div>;
};

export default Pill;
