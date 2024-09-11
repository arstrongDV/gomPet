import React from 'react';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import { Card } from 'src/components';
import { ILitter } from 'src/constants/types';

import style from './LitterCard.module.scss';

type LitterCardProps = {
  litter: ILitter;
};

const LitterCard = ({ litter }: LitterCardProps) => {
  const t = useTranslations('pages');

  const isAfter = new Date(litter.birth_date) > new Date();

  return (
    <Card className={style.litter}>
      <h3>{litter.title}</h3>

      <div className={style.group}>
        <span className={style.label}>{t(`animals.species.${litter.species}`)}</span>
        <span className={style.text}>{litter.breed}</span>
      </div>

      <div className={style.group}>
        <span className={style.label}>
          {isAfter ? t('organizations.litters.litterDate') : t('organizations.litters.anticipatedDate')}
        </span>
        <span className={style.text}>{new Date(litter.birth_date).toLocaleDateString()}</span>
      </div>

      <div className={classNames(style.status, style[litter.status])}>
        {t(`organizations.litters.status.${litter.status}`)}
      </div>

      <p className={style.description}>{litter.description}</p>
    </Card>
  );
};

export default LitterCard;
