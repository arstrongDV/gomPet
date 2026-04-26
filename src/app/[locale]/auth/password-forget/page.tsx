import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Card, LabelLink } from 'src/components';
import { Routes } from 'src/constants/routes';
import { Locale } from 'src/navigation';

import PasswordForgetForm from './form';

import style from './PasswordForget.module.scss';

const PasswordForget = async ({ params }: Readonly<{ params: Promise<{ locale: string }> }>) => {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('pages.auth.passwordForget');

  return (
    <Card className={style.card}>
      <header className={style.header}>
        <h1 className={style.title}>{t('title')}</h1>
        <span className={style.subtitle}>{t('subtitle')}</span>
      </header>
      <PasswordForgetForm />
      <LabelLink
        className={style.labelLink}
        href={Routes.LOGIN}
        label={t('backToLogin')}
        color='dimmed'
        small
      />
    </Card>
  );
};

export default PasswordForget;
