'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Card, LabelLink } from 'src/components';
import { Params } from 'src/constants/params';
import { Routes } from 'src/constants/routes';

import PasswordForgetResetForm from './form';

import style from './PasswordForgetReset.module.scss';

const PasswordForgetReset = () => {
  const t = useTranslations('pages.auth.passwordForgetReset');
  const searchParams = useSearchParams();

  const uid = searchParams.get('uid');
  const token = searchParams.get('token');
  const email = searchParams.get(Params.EMAIL);

  return (
    <Card className={style.card}>
      <header className={style.header}>
        <h1 className={style.title}>{t('title')}</h1>
        <span className={style.subtitle}>{t('subtitle')}</span>
      </header>
      <PasswordForgetResetForm uid={uid} token={token} />
      <LabelLink
        className={style.labelLink}
        href={`${Routes.LOGIN}${email ? `?${Params.EMAIL}=${email}` : ''}`}
        label={t('backToLogin')}
        color='dimmed'
        small
      />
    </Card>
  );
};

export default PasswordForgetReset;
