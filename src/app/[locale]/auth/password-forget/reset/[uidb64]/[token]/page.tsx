'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Card, LabelLink } from 'src/components';
import { Params } from 'src/constants/params';
import { Routes } from 'src/constants/routes';

import PasswordForgetResetForm from './form';

import style from './PasswordForgetReset.module.scss';

const PasswordForgetReset = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const params = useParams();

  const uidb64 = params?.uidb64 as string;
  const token = params?.token as string;
  const email = searchParams.get(Params.EMAIL);

  return (
    <Card className={style.card}>
      <header className={style.header}>
        <h1 className={style.title}>Zmiana hasła</h1>
        <span className={style.subtitle}>Wprowadź nowe hasło, a następnie zaloguj się</span>
      </header>
      <PasswordForgetResetForm />
      <LabelLink
        className={style.labelLink}
        href={`${Routes.LOGIN}${email ? `?${Params.EMAIL}=${email}` : ''}`}
        label='Powrót do logowania'
        color='dimmed'
        small
      />
    </Card>
  );
};

export default PasswordForgetReset;
