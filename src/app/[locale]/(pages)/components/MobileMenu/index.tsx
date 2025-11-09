import React from 'react';
import style from './MobileMenu.module.scss';

import Notifications from '../Header/components/Notifications';
import UserMenu from '../Header/components/UserMenu';
import { logout } from 'src/app/[locale]/auth/logout/actions';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { RouteItemType } from '../Sidebar/components/RouteItem';
import { Routes } from 'src/constants/routes';
import RouteItem from '../Sidebar/components/RouteItem';
import { Icon } from 'src/components';

type MenuProps = {
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileMenu = ({setShowMenu}: MenuProps) => {
  const session = useSession();
  const t = useTranslations();

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
      title: t('navigation.sidebar.blog'),
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
      hidden: session.status !== 'unauthenticated'
    },
    {
      title: t('navigation.sidebar.logout'),
      onClick: () => logout(),
      icon: 'logout',
      hidden: session.status !== 'authenticated'
    }
  ];

  return (
    <div id='mobile-menu' className={style.menu}>
      <div className={style.userMenu}>
        {session.status === 'authenticated' && (
          <div className={style.stack}>
            <UserMenu />
            <Notifications />
          </div>
        )}
        <Icon name='x' onClick={() => setShowMenu(false)} /> 
      </div>
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
          {bottomNavItems.map((item, index) => (
            <RouteItem
              key={index}
              item={item}
            />
          ))}
        </div>
      </nav>
    </div>
  )

};

export default MobileMenu;
