'use client';
import React from 'react';
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

  const topNavItems: RouteItemType[] = [
    {
      title: t('navigation.sidebar.landing'),
      url: Routes.LANDING,
      icon: 'grid'
    },
    {
      title: t('navigation.sidebar.library'),
      url: Routes.LIBRARY,
      icon: 'designTools'
    },
    {
      title: t('navigation.sidebar.login'),
      url: Routes.LOGIN,
      icon: 'fileSearch'
    },
    {
      title: t('navigation.sidebar.offers'),
      url: Routes.OFFERS,
      icon: 'next'
    }
  ];

  const bottomNavItems: RouteItemType[] = [
    {
      title: t('navigation.sidebar.logout'),
      onClick: () => logout(),
      icon: 'logout',
      hidden: session.status !== 'authenticated'
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
          {session.status === 'authenticated' && <p className={style.user}>{session.data.user.email}</p>}
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
