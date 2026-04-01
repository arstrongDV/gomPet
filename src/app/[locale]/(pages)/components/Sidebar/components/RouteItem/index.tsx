'use client';

import React from 'react';
import classNames from 'classnames';

import { IconNames } from 'src/assets/icons';
import { Icon } from 'src/components';
import { Link, usePathname } from 'src/navigation';
import { getEnvName } from 'src/utils/helpers';

import style from './RouteItem.module.scss';

export type RouteItemType = {
  title: string;
  url?: string | null;
  roles?: string[];
  permissions?: string[];
  env?: string[];
  hidden?: boolean;
  icon?: IconNames;
  onClick?: () => void;
  customItem?: React.ReactNode;
};

type RouteItemProps = {
  item: RouteItemType;
  onClick?: () => void;
  className?: string;
  highlighted?: boolean;
};

const RouteItem = ({ item, className, highlighted }: RouteItemProps) => {
  const { title, url, roles = [], permissions = [], env = [], icon, onClick, hidden = false, customItem } = item;
  const pathname = usePathname();

  const classes = classNames(
    style.item,
    {
      [style.active]: pathname === String(url).split('?')[0],
      [style.highlighted]: highlighted
    },
    className
  );

  const inner = customItem || (
    <>
      {icon && <Icon name={icon} />}
      {title}
    </>
  );

  if (hidden) return null;

  if (env.length > 0 && !env.includes(getEnvName())) return null;

  if (onClick) {
    return (
      <button
        className={classes}
        onClick={onClick}
      >
        {inner}
      </button>
    );
  }

  if (url) {
    return (
      <Link
        href={url}
        className={classes}
      >
        {inner}
      </Link>
    );
  }

  return null;
};

export default RouteItem;
