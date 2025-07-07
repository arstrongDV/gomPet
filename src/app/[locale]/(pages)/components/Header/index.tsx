'use client';

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import Logo from 'assets/images/logo.png';
import { Icon, useIsMobile, useIsScrollingDown, useIsScrollingUp } from 'components';

import Notifications from './components/Notifications';
import SearchBar from './components/SearchBar';
import UserMenu from './components/UserMenu';

import style from './Header.module.scss';
import MobileMenu from '../MobileMenu';

type HeaderProps = {
  limitedWidth?: boolean;
};

const Header = ({ limitedWidth = false }: HeaderProps) => {
  const session = useSession();
  const isMobile = useIsMobile({});
  const isScrollingUp = useIsScrollingUp();
  const isScrollingDown = useIsScrollingDown();
  const [isSearch, setIsSearch] = useState(false)

  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(prev => !prev);

  useEffect(() => {
    document.body.style.overflow = showMenu ? 'hidden' : '';
  }, [showMenu]);


  const classes = classNames({
    [style.header]: !isMobile,
    [style.mobileHeader]: isMobile,
    [style.sticky]: isScrollingUp,
    [style.inActive]: isScrollingDown,
    [style.limitedWidth]: limitedWidth
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
    <>
      <div className={style.inner}>
        <button
          className={style.iconButton}
          onClick={() => setIsSearch(prev => !prev)}
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
          className={`${style.iconButton} ${showMenu ? style.rotate : style.fade}`}
          onClick={toggleMenu}
        >
          <Icon name='menu2' />
        </button>
      </div>
      {isSearch && <SearchBar />}
    </>
  );

  return (
    <>
      <header
        id='header'
        className={classes}
      >
        {isMobile ? mobileContent : desktopContent}
      </header>
      {showMenu && (
        <div className={style.backdrop} onClick={() => setShowMenu(false)} />
      )}
      <div className={classNames(style.mobileMenu, {
        [style.active]: showMenu,
        [style.inactive]: !showMenu,
      })}>
          {isMobile && showMenu && <MobileMenu setShowMenu={setShowMenu} />}
      </div>
    </>
  );
};

export default Header;
