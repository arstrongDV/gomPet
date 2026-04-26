import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Card, LabelLink } from 'src/components';
import { Routes } from 'src/constants/routes';
import { Locale } from 'src/navigation';

import SignUpForm from './form';

import style from './SignUp.module.scss';

const SignUp = async ({ params }: Readonly<{ params: Promise<{ locale: string }> }>) => {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('pages.auth.signup');

  return (
    <div className={style.container}>
      <Card className={style.card}>
        <header className={style.header}>
          <h1 className={style.title}>{t('title')}</h1>
          <span className={style.subtitle}>{t('subtitle')}</span>
        </header>
        <SignUpForm />
        <LabelLink
          className={style.labelLink}
          href={Routes.LOGIN}
          label={t('hasAccount')}
          color='accent'
          small
        />
      </Card>
    </div>
  );
};

export default SignUp;
