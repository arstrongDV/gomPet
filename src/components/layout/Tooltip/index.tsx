'use client';

import React, { useState } from 'react';
import classNames from 'classnames';

import style from './Tooltip.module.scss';

type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  withArrow?: boolean;
  open?: boolean;
  enterDelay?: number;
  leaveDelay?: number;
};

const Tooltip = (props: TooltipProps) => {
  const {
    content,
    children,
    placement = 'top',
    className,
    withArrow = true,
    open = false,
    enterDelay = 500,
    leaveDelay = 200
  } = props;

  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const show = () => {
    setTimeout(() => setShowTooltip(true), enterDelay);
  };

  const hide = () => {
    setTimeout(() => setShowTooltip(false), leaveDelay);
  };

  const classes = classNames(style.tooltip, className, {
    [style.open]: showTooltip || open,
    [style.withArrow]: withArrow,
    [style[placement]]: placement
  });

  return (
    <div
      className={classes}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      <div className={style.content}>{content}</div>
    </div>
  );
};

export default Tooltip;
