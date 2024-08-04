import React from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { Card, LabelLink } from 'src/components';
import { Routes } from 'src/constants/routes';
import { Locale } from 'src/navigation';

import SignUpForm from './form';

import style from './SignUp.module.scss';

const SignUp = ({ params: { locale } }: Readonly<{ params: { locale: Locale } }>) => {
  unstable_setRequestLocale(locale);

  return (
    <div className={style.container}>
      <Card className={style.card}>
        <header className={style.header}>
          <h1 className={style.title}>Stwórz nowe konto</h1>
          <span className={style.subtitle}>i dołącz do naszej społeczności</span>
        </header>
        <SignUpForm />
        <LabelLink
          className={style.labelLink}
          href={Routes.LOGIN}
          label='Masz już konto? Zaloguj się'
          color='accent'
          small
        />
      </Card>
    </div>
  );
};

export default SignUp;
