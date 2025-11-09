import React from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { Card, LabelLink } from 'src/components';
import { Routes } from 'src/constants/routes';
import { Locale } from 'src/navigation';

import LoginForm from './form';
import backgroundImage from '../../../../assets/gompet.png'

import style from './Login.module.scss';

const Login = async ({ params: { locale } }: Readonly<{ params: { locale: Locale } }>) => {
  unstable_setRequestLocale(locale);

  return (
    <Card className={style.card}>
      <header className={style.header}>
        <h1 className={style.title}>Logowanie</h1>
        <span className={style.subtitle}>do aplikacji</span>
      </header>
      <LoginForm />
      <div className={style.footer}>
        <LabelLink
          className={style.labelLink}
          href={Routes.SIGNUP}
          label='Nie masz konta? Zarejestruj się'
          color='accent'
          small
        />
        <LabelLink
          className={style.labelLink}
          href={Routes.PASSWORD_FORGET}
          label='Nie pamiętasz hasła?'
          color='dimmed'
          small
        />
      </div>
    </Card>
  );
};

export default Login;
