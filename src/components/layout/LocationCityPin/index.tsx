'use client';

import React from 'react';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import { Icon } from 'components';

import style from './LocationCityPin.module.scss';

type LocationCityPinProps = {
  className?: string;
  city?: string | null;
};

const LocationCityPin = ({ city, className }: LocationCityPinProps) => {
  const t = useTranslations('common');

  return (
    <div className={classNames(style.locationCity, className)}>
      <Icon
        className={style.icon}
        name='mapPin'
      />
      <span className={style.text}>{city || t('noLocation')}</span>
    </div>
  );
};

export default LocationCityPin;
