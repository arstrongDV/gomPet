'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button, Card, Icon } from 'src/components';
import { Routes } from 'src/constants/routes';

import style from './VerifyEmailCheckValid.module.scss';

const VerifyEmailCheckValid = () => {
  const params = useParams();
  const token = params?.token as string;

  const isVerified = token === 'valid';

  const t = useTranslations();

  if (!isVerified)
    return (
      <Card className={style.card}>
        <header className={style.header}>
          <h1 className={style.title}>Nie udało się</h1>
          <span className={style.subtitle}>Coś poszło nie tak podczas weryfikacji</span>
        </header>

        <Icon
          name='circleX'
          className={style.icon}
        />

        <Button
          href={Routes.LOGIN}
          label={'Prześlij link ponownie'}
          empty
        />
      </Card>
    );

  return (
    <Card className={style.card}>
      <header className={style.header}>
        <h1 className={style.title}>Konto zweryfikowane</h1>
        <span className={style.subtitle}>Możesz się teraz zalogować do aplikacji</span>
      </header>

      <Icon
        name='circleCheck'
        className={style.icon}
      />

      <Button
        href={Routes.LOGIN}
        label={'Przejdź do logowania'}
      />
    </Card>
  );
};

export default VerifyEmailCheckValid;
