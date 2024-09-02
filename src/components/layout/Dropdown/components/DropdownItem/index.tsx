import React from 'react';
import classNames from 'classnames';

import { Icon, Pill } from 'components';

import { IconNames } from 'src/assets/icons';
import { Link } from 'src/navigation';

import style from './DropdownItem.module.scss';

export type DropdownItemType = {
  title?: string | null;
  href?: string | null;
  hrefOutside?: string;
  onClick?: () => void;
  roles: string[];
  permission?: string;
  icon?: IconNames;
  counter?: number;
  disabled?: boolean;
  customItem?: React.ReactNode;
};

export interface DropdownItemProps {
  item: DropdownItemType;
  className?: string;
  isSectionTitle?: boolean;
  closeDropdown?: () => void;
}

const DropdownItem = (props: DropdownItemProps) => {
  const { className, item, isSectionTitle = false, closeDropdown } = props;
  const { href, hrefOutside, onClick, icon, title, roles, permission, counter, disabled = false, customItem } = item;

  const onClickProxy = () => {
    if (onClick) {
      onClick();
    }
    if (closeDropdown) {
      closeDropdown();
    }
  };

  const content = (
    <>
      {icon && (
        <Icon
          name={icon}
          className={style.icon}
        />
      )}
      {title}
      {counter && <Pill>{counter}</Pill>}
    </>
  );

  if (customItem) {
    return customItem as React.ReactElement;
  }

  if (hrefOutside) {
    return (
      <a
        className={classNames(style.link, className, {
          [style.sectionTitle]: isSectionTitle,
          [style.disabled]: disabled
        })}
        href={hrefOutside}
        target='_blank'
        rel='noopener noreferrer'
        onClick={onClickProxy}
        id={'dropdown' + hrefOutside}
      >
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <Link
        className={classNames(style.link, className, {
          [style.sectionTitle]: isSectionTitle,
          [style.disabled]: disabled
        })}
        href={href}
        onClick={onClickProxy}
        id={'dropdown-' + href}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={classNames(style.link, style.button, {
        [style.sectionTitle]: isSectionTitle,
        [style.disabled]: disabled
      })}
      onClick={onClickProxy}
      id={'button-' + title}
    >
      {content}
    </button>
  );
};

export default DropdownItem;
