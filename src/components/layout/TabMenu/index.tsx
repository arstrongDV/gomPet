'use client';

import React from 'react';
import classNames from 'classnames';

import HorizontalScroll from '../HorizontalScroll';

import style from './TabMenu.module.scss';

export type TabMenuItem = {
  label: string;
  id: string | number;
};

type TabMenuProps = {
  className?: string;
  items: TabMenuItem[];
  selected: TabMenuItem;
  onClick: (item: TabMenuItem) => void;
};

const TabMenu = ({ items, selected, onClick, className }: TabMenuProps) => {
  const handleClick = (item: TabMenuItem) => {
    onClick(item);
  };

  return (
    <HorizontalScroll className={classNames(style.tabs, className)}>
      {items?.map((item) => (
        <button
          key={item.id}
          className={classNames(style.button, { [style.active]: selected?.id === item.id })}
          onClick={() => handleClick(item)}
        >
          {item.label}
        </button>
      ))}
    </HorizontalScroll>
  );
};

export default TabMenu;
