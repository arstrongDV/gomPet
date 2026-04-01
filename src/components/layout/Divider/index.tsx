import React from 'react';
import classNames from 'classnames';

import style from './Divider.module.scss';

type DividerProps = {
  className?: string;
};

const Divider = ({ className }: DividerProps) => {
  return <div className={classNames(style.divider, className)} />;
};

export default Divider;
