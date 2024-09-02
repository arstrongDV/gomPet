import React from 'react';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';

import { Locale } from 'src/navigation';

import AnimalsScroll from './components/AnimalsScroll';

import style from './Landing.module.scss';

const Landing = ({ params: { locale } }: Readonly<{ params: { locale: Locale } }>) => {
  unstable_setRequestLocale(locale);

  const t = useTranslations('pages.landing');

  return (
    <div className={style.container}>
      <AnimalsScroll />
    </div>
  );
};

export default Landing;
