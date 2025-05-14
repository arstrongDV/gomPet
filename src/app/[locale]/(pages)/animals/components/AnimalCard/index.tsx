'use client';

import React from 'react';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import { IconNames } from 'src/assets/icons';
import { Icon } from 'src/components';
import { IAnimal } from 'src/constants/types';

import style from './AnimalCard.module.scss';
import { useRouter } from 'next/navigation';

const genderIconNames: { [key: string]: IconNames } = {
  male: 'genderMale',
  female: 'genderFemale'
};

type AnimalCardProps = {
  className?: string;
  animal: IAnimal;
};

const AnimalCard = ({ className, animal }: AnimalCardProps) => {
  const t = useTranslations('pages.animals');
  const {push} = useRouter();
  const cardClasses = classNames(style.card, className);
  const cardStyles = {
    backgroundImage: `url(${animal.image})`
  };

  return (
    <div
      className={cardClasses}
      style={cardStyles}
    >
      <div className={style.gradient}></div>
      <div className={style.content} onClick={() => {push(`/animals/${animal.id}`)}}>
        <div className={style.top}>
          <div className={style.about}>
            <h2 className={classNames(style.badge, style.title)}>{animal.name}</h2>
            <div className={classNames(style.badge, style.age)}>+{animal.age}</div>
            {animal.characteristics.length > 0 && (
              <div className={classNames(style.badge, style.characteristics)}>
                {t(`characteristics.${animal.species}.${animal.characteristics[0]}`)}
              </div>
            )}
          </div>
          <button className={style.addBookmark}>
            <Icon name='heart' />
          </button>
        </div>

        <div className={style.hoverContent} >
          <div className={style.data}>
            <div className={classNames(style.badge, style.gender)}>
              <span>Płeć: {t(`gender.${animal.gender}`)}</span>
              <Icon name={genderIconNames[animal.gender]} />
            </div>
            <div className={classNames(style.badge, style.size)}>Wielkość: {t(`size.${animal.size}`)}</div>
            <div className={classNames(style.badge, style.ageText)}>Wiek: Dorosły</div>
          </div>
        </div>

        <div className={style.bottom}>
          <div className={style.location}>
            <Icon name='mapPin' />
            <span>{animal.owner.address.city}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalCard;
