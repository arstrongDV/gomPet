import React from 'react';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';

import { Button, Card } from 'components';

import { Routes } from 'src/constants/routes';
import { Link, Locale } from 'src/navigation';

import style from './Landing.module.scss';

const Landing = ({ params: { locale } }: Readonly<{ params: { locale: Locale } }>) => {
  unstable_setRequestLocale(locale);

  const t = useTranslations('pages.landing');

  return (
    <div className={style.container}>
      <Card className={style.card}>
        <h1>{t('title')}</h1>
        <h3>{t('subtitle', { locale })}</h3>
        <p>
          {t.rich('withLink', {
            link: (chunks) => <Link href={Routes.LOGIN}>{chunks}</Link>
          })}
        </p>
        <Button
          href={Routes.LOGIN}
          label='Zaloguj się'
        />
        <Button
          href={Routes.SIGNUP}
          label='Utwórz konto'
        />
      </Card>
    </div>
  );
};

export default Landing;
