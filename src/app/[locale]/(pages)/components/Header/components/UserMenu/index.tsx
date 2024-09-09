'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { Avatar, Dropdown } from 'src/components';
import { DropdownItemType } from 'src/components/layout/Dropdown/components/DropdownItem';
import { Routes } from 'src/constants/routes';

import style from './UserMenu.module.scss';

const UserMenu = () => {
  const t = useTranslations();
  const session = useSession();

  const menuItems: DropdownItemType[] = [
    {
      title: 'Profile',
      href: Routes.LANDING,
      roles: []
    },
    {
      title: 'Nowa organizacja',
      href: Routes.NEW_ORGANIZATION,
      roles: []
    }
  ];

  return (
    <Dropdown
      icon={'chevronDown'}
      items={menuItems}
      rotateIconOnOpen
      hideIcon
      label={
        <Avatar
          className={style.image}
          profile={session.data?.user}
        />
      }
    />
  );
};

export default UserMenu;
