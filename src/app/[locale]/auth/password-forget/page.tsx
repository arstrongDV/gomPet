import React from 'react';
import { setRequestLocale } from 'next-intl/server';

import { Card, LabelLink } from 'src/components';
import { Routes } from 'src/constants/routes';
import { Locale } from 'src/navigation';

import PasswordForgetForm from './form';

import style from './PasswordForget.module.scss';

const PasswordForget = async ({ params }: Readonly<{ params: Promise<{ locale: string }> }>) => {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <Card className={style.card}>
      <header className={style.header}>
        <h1 className={style.title}>Nie pamiętasz hasła?</h1>
        <span className={style.subtitle}>Podaj swój email, wyślemy Tobie link resetujący hasło</span>
      </header>
      <PasswordForgetForm />
      <LabelLink
        className={style.labelLink}
        href={Routes.LOGIN}
        label='Powrót do logowania'
        color='dimmed'
        small
      />
    </Card>
  );
};

export default PasswordForget;
