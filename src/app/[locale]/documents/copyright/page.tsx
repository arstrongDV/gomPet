'use client';

import { useTranslations } from 'next-intl';

import BackButton from '../BackButton';
import style from '../DocumentsLayout.module.scss';

const CopyrightPage = () => {
  const t = useTranslations('pages.documents.copyright');

  return (
    <>
      <BackButton label={t('back')} />
      <h1 className={style.title}>{t('title')}</h1>
      <div className={style.content}>
        <section>
          <h2>{t('section1.title')}</h2>
          <p>{t('section1.content')}</p>
        </section>
        <section>
          <h2>{t('section2.title')}</h2>
          <p>{t('section2.content')}</p>
        </section>
        <section>
          <h2>{t('section3.title')}</h2>
          <p>{t('section3.content')}</p>
        </section>
        <section>
          <h2>{t('section4.title')}</h2>
          <p>{t('section4.content')}</p>
        </section>
      </div>
    </>
  );
};

export default CopyrightPage;
