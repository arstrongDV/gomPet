import React from 'react';
import classNames from 'classnames';
import { headers } from 'next/headers';

import { Routes } from 'src/constants/routes';
import { isServer } from 'src/utils/helpers';

import Footer from './components/Footer';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

import style from './PagesLayout.module.scss';

const limitedWidthRoutes = [Routes.ARTICLES, Routes.ORGANIZATION_PROFILE(''), Routes.NEW_ANIMAL, Routes.NEW_ORGANIZATION];

const PagesLayout = ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const requestHeaders = headers();
  const pathname = requestHeaders?.get('x-current-path') || '';

  let isLimitedWidth;

  if (isServer()) {
    isLimitedWidth = limitedWidthRoutes.some((route) => pathname.includes(route));
  } else {
    const path = window.location.pathname;
    isLimitedWidth = limitedWidthRoutes.some((route) => path.includes(route));
  }

  console.log(limitedWidthRoutes);
  console.log(pathname);

  const containerClasses = classNames(style.container, {
    [style.isSidebarClose]: false,
    [style.limitedWidth]: isLimitedWidth
  });

  return (
    <div className={containerClasses}>
      <Sidebar />
      <div className={style.page}>
        <Header limitedWidth={isLimitedWidth} />
        <main
          id='main'
          className={style.inner}
        >
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default PagesLayout;
