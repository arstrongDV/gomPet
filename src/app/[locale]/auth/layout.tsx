import React from 'react';
import Image from 'next/image';

import Logo from 'assets/images/logo.png';

import { Routes } from 'src/constants/routes';
import { Link } from 'src/navigation';

import style from './AuthLayout.module.scss';

const PagesLayout = ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className={style.container}>
      <main
        id='main'
        className={style.main}
      >
        <Link href={Routes.LANDING}>
          <Image
            className={style.logo}
            src={Logo}
            alt='Logo'
            height={60}
            priority
          />
        </Link>
        {children}
      </main>
    </div>
  );
};

export default PagesLayout;
