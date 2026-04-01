import React from 'react';
import classnames from 'classnames';

import classes from './Card.module.scss';

type CardProps = {
  className?: string;
  children?: React.ReactNode;
  shadow?: boolean;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  as?: 'div' | 'li' | 'section';
  color?: 'white' | 'gray';
  title?: string;
  actions?: React.ReactNode;
};

const Card = (props: CardProps) => {
  const {
    as: Tag = 'div',
    className,
    children,
    style,
    onClick,
    shadow = false,
    color = 'white',
    title,
    actions,
    ...rest
  } = props;

  const cardClassName = classnames(classes.card, className, {
    [classes.card__shadow]: shadow,
    [classes.card__gray]: color === 'gray'
  });

  return (
    <Tag
      className={cardClassName}
      style={style}
      onClick={onClick}
      {...rest}
    >
      {title && (
        <div className={classes.card__header}>
          <h3 className={classes.card__title}>{title}</h3>
          {actions && <div className={classes.card__actions}>{actions}</div>}
        </div>
      )}

      {children}
    </Tag>
  );
};

export default Card;
