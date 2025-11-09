'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import Logo from 'assets/images/logo.png';

import { logout } from 'src/app/[locale]/auth/logout/actions';
import { Routes } from 'src/constants/routes';
import { Link } from 'src/navigation';

import RouteItem, { RouteItemType } from './components/RouteItem';

import style from './Sidebar.module.scss';

const Sidebar = () => {
  const t = useTranslations();
  const session = useSession();

  // const [showLogin, setShowLogin] = useState<boolean>()
  // const [showLoginOut, setShowLoginOut] = useState<boolean>()

  // useEffect(() => {
  //   if(session.status !== 'unauthenticated' && session.status === 'authenticated'){
  //     setShowLogin(true)
  //     setShowLoginOut(false)
  //   }
  //   else{
  //     setShowLogin(false)
  //     setShowLoginOut(true)
  //   }
  //   // if(session.status !== 'authenticated'){
  //   //   setShowLoginOut(true)
  //   // }
  //   // else{
  //   //   setShowLoginOut(false)
  //   // }
  // })

  const highlightedRoute: RouteItemType = {
    title: t('navigation.sidebar.myAnimals'),
    url: Routes.MY_ANIMALS,
    icon: 'heartPlus'
  };

  const topNavItems: RouteItemType[] = [
    {
      title: t('navigation.sidebar.posts'),
      url: Routes.ARTICLES,
      icon: 'message'
    },
    {
      title: t('navigation.sidebar.animals'),
      url: `${Routes.ANIMALS}?page=1&organization_type=animal_shelter%26fund%26breeding`,
      icon: 'paw'
    },
    {
      title: t('navigation.sidebar.shelters'),
      url: Routes.SHELTERS,
      icon: 'homeHeart'
    },
    {
      title: t('navigation.sidebar.breedings'),
      url: Routes.BREEDINGS,
      icon: 'buildingCottage'
    },
    {
      title: t('navigation.sidebar.foundations'),
      url: Routes.FOUNDATIONS,
      icon: 'shieldHeart'
    },
    {
      title: t('navigation.sidebar.bookmarks'),
      url: Routes.BOOKMARKS,
      icon: 'heart'
    },
    {
      title: t('navigation.sidebar.knowledge'),
      url: Routes.KNOWLEDGE,
      icon: 'book'
    }
  ];

  const bottomNavItems: RouteItemType[] = [
    // {
    //   title: 'Biblioteka',
    //   url: Routes.LIBRARY
    // },
    {
      title: t('navigation.sidebar.login'),
      url: Routes.LOGIN,
      icon: 'login',
      hidden:  session.status !== 'unauthenticated' //showLogin
    },
    {
      title: t('navigation.sidebar.logout'),
      onClick: () => logout(),
      icon: 'logout',
      hidden:  session.status !== 'authenticated' //showLoginOut
    }
  ];

  return (
    <div
      id='sidebar'
      className={style.sidebar}
    >
      <Link href={Routes.LANDING}>
        <Image
          src={Logo}
          alt='Logo'
          height={70}
          priority
        />
      </Link>

      <RouteItem
        item={highlightedRoute}
        highlighted
      />

      <nav className={style.nav}>
        <div className={style.topNav}>
          {topNavItems.map((item, index) => (
            <RouteItem
              key={index}
              item={item}
            />
          ))}
        </div>

        <div className={style.bottomNav}>
          {/* {session.status === 'authenticated' && <p className={style.user}>{session.data.user.email}</p>} */}
          {bottomNavItems.map((item, index) => (
            <RouteItem
              key={index}
              item={item}
            />
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
