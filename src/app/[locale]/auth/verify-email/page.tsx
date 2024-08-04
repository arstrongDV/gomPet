import React from 'react';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';

import { Button, Card, LabelLink } from 'src/components';
import { Routes } from 'src/constants/routes';
import { Locale } from 'src/navigation';

import style from './VerifyEmail.module.scss';

const VerifyEmail = ({ params: { locale } }: Readonly<{ params: { locale: Locale } }>) => {
  unstable_setRequestLocale(locale);

  const t = useTranslations();

  return (
    <Card className={style.card}>
      <header className={style.header}>
        <h1 className={style.title}>Zweryfikuj konto</h1>
        <span className={style.subtitle}>Sprawdź swoją skrzynkę email</span>
      </header>

      <Button
        href={Routes.LOGIN}
        label={'Powrót do logowania'}
        empty
      />
    </Card>
  );
};

export default VerifyEmail;
