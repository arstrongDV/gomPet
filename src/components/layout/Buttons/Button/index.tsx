// 'use client';

import React from 'react';
import classNames from 'classnames';

import { Icon } from 'components';

import { IconNames } from 'src/assets/icons';
import { Link } from 'src/navigation';

import style from './Button.module.scss';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  href?: string;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  small?: boolean;
  empty?: boolean;
  transparent?: boolean;
  gray?: boolean;
  white?: boolean;
  className?: string;
  icon?: IconNames;
  id?: string;
  height?: string;
  width?: string;
  reverse?: boolean;
};

const ButtonWrapper: React.FC<ButtonProps> = (props) => {
  const {
    children,
    href,
    onClick,
    className,
    height,
    width,
    type,
    isLoading = false,
    disabled = false,
    gray = false,
    white = false,
    empty = false,
    transparent = false,
    form,
    id,
    title,
    fullWidth,
    small,
    label,
    icon
  } = props;
  const buttonClasses = classNames(style.button, className, {
    [style.disabled]: disabled,
    [style.isLoading]: isLoading,
    [style.empty]: empty,
    [style.transparent]: transparent,
    [style.gray]: gray,
    [style.white]: white,
    [style.small]: small,
    [style.fullWidth]: fullWidth,
    [style.iconOnly]: !label && icon
  });

  return href ? (
    <Link
      className={buttonClasses}
      style={{ height, width }}
      onClick={onClick}
      href={href}
    >
      {children}
    </Link>
  ) : (
    <button
      onClick={disabled ? undefined : onClick}
      className={buttonClasses}
      style={{ height, width }}
      type={type}
      disabled={disabled}
      id={id}
      form={form}
      title={title}
    >
      {children}
    </button>
  );
};

const Button = (props: ButtonProps) => {
  const { label, isLoading = false, icon, empty, transparent, reverse = false, small } = props;

  const content = (
    <div
      className={classNames(style.wrapper, {
        [style.hidden]: isLoading,
        [style.reverse]: reverse
      })}
    >
      {label && <span className={style.label}>{label}</span>}
      {icon && (
        <Icon
          name={icon}
          className={style.icon}
          white={!empty && !transparent}
          small={small}
        />
      )}
    </div>
  );

  return (
    <ButtonWrapper {...props}>
      <div className={style.inner}>
        {isLoading && (
          <Icon
            name='loader'
            className={style.loader}
          />
        )}
        {content}
      </div>
    </ButtonWrapper>
  );
};

export default Button;
