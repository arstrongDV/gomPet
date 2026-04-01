import React from 'react';
import Image from 'next/image';

import Logo from 'assets/images/logo.png';
import backGround from 'assets/images/AuthBgPaw.png'

import { Routes } from 'src/constants/routes';
import { Link } from 'src/navigation';

import style from './AuthLayout.module.scss';

export const dynamic = 'force-dynamic';

const PagesLayout = ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div
    style={{
      backgroundImage: `url(${backGround.src})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}
      className={style.container}
    >
      <main id="main" className={style.main}>
        <Link href={Routes.LANDING}>
          <Image
            className={style.logo}
            src={Logo}
            alt="Logo"
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
