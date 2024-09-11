import React from 'react';
import classNames from 'classnames';

import style from './SectionHeader.module.scss';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
  margin?: boolean;
  fullWidth?: boolean;
};

const SectionHeader = (props: SectionHeaderProps) => {
  const { title, subtitle, className, margin = false, fullWidth = true, children } = props;

  const classes = classNames(
    style.container,
    {
      [style.margin]: margin,
      [style.limitWidth]: !fullWidth
    },
    className
  );

  return (
    <header className={classes}>
      <div className={style.text}>
        <h2 className={style.title}>{title}</h2>
        {subtitle && <span>{subtitle}</span>}
      </div>
      {children}
    </header>
  );
};

export default SectionHeader;
