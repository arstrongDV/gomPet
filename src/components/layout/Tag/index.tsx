import React from 'react';
import classNames from 'classnames';

import { Link } from 'src/navigation';

import style from './Tag.module.scss';

type TagProps = {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  hrefOutside?: boolean;
  selected?: boolean;
};

const Tag = (props: TagProps) => {
  const { onClick, selected = false, href, hrefOutside, children, className } = props;

  const classes = classNames(
    style.tag,
    {
      [style.selected]: selected
    },
    className
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={classes}
      >
        {children}
      </button>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  if (hrefOutside) {
    return (
      <a
        href={href}
        target='_blank'
        rel='noreferrer'
        className={classes}
      >
        {children}
      </a>
    );
  }

  return <div className={classes}>{children}</div>;
};

export default Tag;
