import React from 'react';
import classNames from 'classnames';

import Footer from './components/Footer';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

import style from './PagesLayout.module.scss';

const PagesLayout = ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const containerClasses = classNames(style.container, {
    [style.isSidebarClose]: false
  });

  return (
    <div className={containerClasses}>
      <Sidebar />
      <div className={style.page}>
        <Header />
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
