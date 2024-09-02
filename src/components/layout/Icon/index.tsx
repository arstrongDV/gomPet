import classNames from 'classnames';

import { IconNames, Icons } from 'src/assets/icons';
import { Link } from 'src/navigation';

import style from './Icon.module.scss';

interface IconProps extends Partial<HTMLAnchorElement> {
  name: IconNames;
  href?: string;
  hrefOutside?: string;
  small?: boolean;
  svgProps?: object;
  gray?: boolean;
  dark?: boolean;
  white?: boolean;
  colored?: boolean;
  noPointerEvents?: boolean;
  currentColor?: boolean;
  onClick?: () => void;
}

const Icon = (props: IconProps) => {
  const {
    name,
    className,
    href,
    hrefOutside,
    onClick,
    small,
    svgProps,
    gray,
    dark,
    white,
    colored,
    noPointerEvents,
    currentColor = false
  } = props;

  const iconProps = {
    className: classNames(style.icon, className, {
      [style.small]: small,
      [style.gray]: gray,
      [style.dark]: dark,
      [style.white]: white,
      [style.colored]: colored,
      [style.noPointerEvents]: noPointerEvents,
      [style.currentColor]: currentColor
    }),
    ...svgProps
  };

  const IconComponent = Icons[name];

  if (!IconComponent) return null;

  if (hrefOutside) {
    return (
      <a
        href={href}
        className={style.link}
        target='_blank'
        rel='noreferrer'
      >
        <IconComponent {...iconProps} />
      </a>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        className={style.link}
      >
        <IconComponent {...iconProps} />
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        className={style.button}
        onClick={onClick}
      >
        <IconComponent {...iconProps} />
      </button>
    );
  }

  return <IconComponent {...iconProps} />;
};

export default Icon;
