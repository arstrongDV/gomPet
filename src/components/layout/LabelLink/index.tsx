import classNames from 'classnames';

import { IconNames } from 'src/assets/icons';
import { Link } from 'src/navigation';

import Icon from '../Icon';

import style from './LabelLink.module.scss';

type LabelLinkProps = {
  label?: string;
  onClick?: () => void;
  className?: string;
  labelStyle?: string;
  color?: 'primary' | 'accent' | 'font' | 'dimmed' | 'black';
  underlined?: boolean;
  icon?: IconNames;
  fontSize?: number;
  href?: string;
  hrefOut?: string;
  targetBlank?: boolean;
  small?: boolean;
};

const LabelLink = (props: LabelLinkProps) => {
  const {
    label,
    onClick,
    className,
    labelStyle,
    color = 'primary',
    underlined,
    icon,
    fontSize,
    href,
    hrefOut,
    targetBlank,
    small,
    ...rest
  } = props;

  const linkProps = targetBlank
    ? {
        target: '_blank',
        rel: 'noreferrer'
      }
    : {};

  const classes = classNames(style.link, className, {
    [style.color]: color === 'primary',
    [style.accent]: color === 'accent',
    [style.dimmed]: color === 'dimmed',
    [style.font]: color === 'font',
    [style.small]: small,
    [style.underlined]: underlined,
    [style.icon]: icon
  });

  const inner = (
    <span
      className={classes}
      onClick={onClick}
      {...rest}
    >
      {icon && (
        <Icon
          name={icon}
          className={style.icon}
        />
      )}
      <span
        className={labelStyle}
        style={{ fontSize }}
      >
        {label}
      </span>
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...rest}
      >
        {inner}
      </Link>
    );
  }

  if (hrefOut) {
    return (
      <a
        href={hrefOut}
        className={classes}
        {...linkProps}
        {...rest}
      >
        {inner}
      </a>
    );
  }

  return inner;
};

export default LabelLink;
