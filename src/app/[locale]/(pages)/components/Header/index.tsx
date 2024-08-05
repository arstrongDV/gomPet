'use client';

import React from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import Logo from 'assets/images/logo.png';
import { Icon, useIsMobile, useIsScrollingDown, useIsScrollingUp } from 'components';

import Notifications from './components/Notifications';
import SearchBar from './components/SearchBar';
import UserMenu from './components/UserMenu';

import style from './Header.module.scss';

const Header = () => {
  const session = useSession();
  const isMobile = useIsMobile({});
  const isScrollingUp = useIsScrollingUp();
  const isScrollingDown = useIsScrollingDown();

  const classes = classNames({
    [style.header]: !isMobile,
    [style.mobileHeader]: isMobile,
    [style.sticky]: isScrollingUp,
    [style.inActive]: isScrollingDown
  });

  const desktopContent = (
    <div className={style.inner}>
      <SearchBar />
      {session.status === 'authenticated' && (
        <div className={style.stack}>
          <Notifications />
          <UserMenu />
        </div>
      )}
    </div>
  );

  const mobileContent = (
    <div className={style.inner}>
      <button
        className={style.iconButton}
        onClick={() => console.log('Search')}
      >
        <Icon name='search' />
      </button>
      <Image
        className={style.logo}
        src={Logo}
        alt='Logo'
        height={50}
      />
      <button
        className={style.iconButton}
        onClick={() => console.log('Menu')}
      >
        <Icon name='menu2' />
      </button>
    </div>
  );

  return (
    <header
      id='header'
      className={classes}
    >
      {isMobile ? mobileContent : desktopContent}
    </header>
  );
};

export default Header;
