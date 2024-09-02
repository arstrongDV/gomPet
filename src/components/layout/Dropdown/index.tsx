'use client';

import React, { useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import classNames from 'classnames';

import { Icon } from 'components';

import { IconNames } from 'src/assets/icons';
import { usePathname } from 'src/navigation';

import DropdownItem, { DropdownItemType } from './components/DropdownItem';

import style from './Dropdown.module.scss';

type DropdownProps = {
  className?: string;
  menuClassName?: string;
  containerClassName?: string;
  hideIcon?: boolean;
  rotateIconOnOpen?: boolean;
  items: DropdownItemType[];
  icon?: IconNames;
  onOpenChange?: (isOpen: boolean) => void;
  label?: React.ReactNode;
};

const Dropdown = (props: DropdownProps) => {
  const {
    items = [],
    icon = 'chevronDown',
    rotateIconOnOpen = false,
    hideIcon = false,
    onOpenChange,
    className,
    menuClassName,
    containerClassName,
    label = null
  } = props;
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const iconClasses = classNames(style.icon, {
    [style.rotate]: isOpen && rotateIconOnOpen
  });

  const menuClasses = classNames(style.dropdownMenu, menuClassName, {
    [style.open]: isOpen
  });

  useEffect(() => {
    onOpenChange && onOpenChange(isOpen);
  }, [isOpen, onOpenChange]);

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setIsOpen(false);
      }}
    >
      <div className={classNames(style.container, containerClassName)}>
        <button
          className={classNames(style.button, className)}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {label}
          {!hideIcon && (
            <Icon
              className={iconClasses}
              name={icon}
            />
          )}
        </button>

        <div className={menuClasses}>
          {items &&
            items.map((item, index) => (
              <DropdownItem
                key={index}
                item={item}
                closeDropdown={() => setIsOpen(false)}
              />
            ))}
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default Dropdown;
