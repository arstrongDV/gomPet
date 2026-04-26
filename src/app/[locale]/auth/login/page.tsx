import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Card, LabelLink } from 'src/components';
import { Routes } from 'src/constants/routes';
import { Locale } from 'src/navigation';

import LoginForm from './form';

import style from './Login.module.scss';

const Login = async ({ params }: Readonly<{ params: Promise<{ locale: string }> }>) => {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('pages.auth.login');

  return (
    <Card className={style.card}>
      <header className={style.header}>
        <h1 className={style.title}>{t('title')}</h1>
        <span className={style.subtitle}>{t('subtitle')}</span>
      </header>
      <LoginForm />
      <div className={style.footer}>
        <LabelLink
          className={style.labelLink}
          href={Routes.SIGNUP}
          label={t('noAccount')}
          color='accent'
          small
        />
        <LabelLink
          className={style.labelLink}
          href={Routes.PASSWORD_FORGET}
          label={t('forgotPassword')}
          color='dimmed'
          small
        />
      </div>
    </Card>
  );
};

export default Login;
