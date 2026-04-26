import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Button, Card } from 'src/components';
import { Routes } from 'src/constants/routes';
import { Locale } from 'src/navigation';

import style from './VerifyEmail.module.scss';

const VerifyEmail = async ({ params }: Readonly<{ params: Promise<{ locale: string }> }>) => {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('pages.auth.verifyEmail');

  return (
    <Card className={style.card}>
      <header className={style.header}>
        <h1 className={style.title}>{t('title')}</h1>
        <span className={style.subtitle}>{t('subtitle')}</span>
      </header>

      <Button
        href={Routes.LOGIN}
        label={t('backToLogin')}
        empty
      />
    </Card>
  );
};

export default VerifyEmail;
