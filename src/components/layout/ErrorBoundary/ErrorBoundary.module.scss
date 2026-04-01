import React from 'react';
import { useTranslations } from 'next-intl';

import { Icon } from 'components';

import style from './ErrorBoundary.module.scss';

const ErrorBoundaryFallback = () => {
  const t = useTranslations('error');

  return (
    <div className={style.errorBoundary}>
      <h4>{t('errorBoundaries:somethingWentWrong')}</h4>
      <p>{t('errorBoundaries:tryRefresh')}</p>
      <div
        role='button'
        className={style.refresh}
        onClick={() => {
          window.location.reload();
        }}
      >
        <Icon name={'reload'} />
      </div>
    </div>
  );
};

export default ErrorBoundaryFallback;
