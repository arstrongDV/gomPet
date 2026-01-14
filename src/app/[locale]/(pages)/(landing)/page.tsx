import React from 'react';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';

import { Locale } from 'src/navigation';

import AnimalsScroll from './components/AnimalsScroll';
import OrganizationsScroll from './components/OrganizationsScroll';

import style from './Landing.module.scss';
import Banner from './components/Banner';
import Footer from './components/Footer'
import TextBlock from './components/TextBlock';
import KnowledgeScroll from './components/KnowledgeScroll';

const Landing = ({ params: { locale } }: Readonly<{ params: { locale: Locale } }>) => {
  unstable_setRequestLocale(locale);

  const t = useTranslations('pages.landing');

  return (
    <div className={style.container}>
      <Banner />
      <AnimalsScroll />
      <TextBlock />
      <OrganizationsScroll />
      <KnowledgeScroll />
      <Footer />
    </div>
  );
};

export default Landing;