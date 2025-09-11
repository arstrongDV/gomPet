'use client';

import React, {useEffect, useState} from 'react';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import { IconNames } from 'src/assets/icons';
import { Icon } from 'src/components';
import { IAnimal } from 'src/constants/types';

import style from './AnimalCard.module.scss';
import { useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector, useAppStore } from 'src/lib/store/hooks';
import { addItemToFavorites, deleteItemFromFavorites } from '../../../bookmarks/slice';///

const genderIconNames: { [key: string]: IconNames } = {
  male: 'genderMale',
  female: 'genderFemale'
};

type AnimalCardProps = {
  className?: string;
  animal: IAnimal;
};

const AnimalCard = ({ className, animal }: AnimalCardProps) => {

  const dispatch = useAppDispatch();//////////////
  
  // const {favorites, isFavorites} = useAppSelector((state) => state.bookmarks);
  const favorites = useAppSelector((state) => state.bookmarks.favorites);
  const isFavorite = favorites.some((fav) => fav.id === animal.id);

  const t = useTranslations('pages.animals');
  const {push} = useRouter();
  const cardClasses = classNames(style.card, className);
  const cardStyles = {
    backgroundImage: `url(${animal.image})`,
  };
  console.log('image:', animal.image);
  const handleCardClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    // Nie przekierowuj jeśli kliknięto w button
    if (!target.closest('button')) {
      push(`/animals/${animal.id}`);
    }
  };

  const toggleFavorite = () => {
    const isFav = favorites.some((fav) => fav.id === animal.id);
    if (isFav) {
      dispatch(deleteItemFromFavorites(animal));
    } else {
      dispatch(addItemToFavorites(animal));
    }
  };

  // useEffect(() => {
  //   const stored = localStorage.getItem('bookmarks');
  //   if (stored) {
  //     const parsed = JSON.parse(stored);
  //     parsed.forEach((animal: IAnimal) => {
  //       dispatch(addItemToFavorites(animal));
  //     });
  //   }
  // }, []);


  console.log(useAppStore().getState().bookmarks);

  return (
    <div
      className={cardClasses}
      style={cardStyles}
    >
      <div className={style.gradient}></div>
      <div className={style.content} onClick={handleCardClick}>
        <div className={style.top}>
          <div className={style.about}>
            <h2 className={classNames(style.badge, style.title)}>{animal.name}</h2>
            <div className={classNames(style.badge, style.age)}>+{animal.age}</div>
            {animal.characteristics?.length > 0 && (
              <div className={classNames(style.badge, style.characteristics)}>
                {t(`characteristics.${animal.species}.${animal.characteristics[0]}`)}
              </div>
            )}
          </div>
          <button id='#button'   className={classNames(style.addBookmark, {
            [style['addBookmark--active']]: isFavorite,
          })} onClick={toggleFavorite}>
            <Icon name='heart' />
          </button>
        </div>

        <div className={style.hoverContent} >
          <div className={style.data}>
            <div className={classNames(style.badge, style.gender)}>
              <span>Płeć:  {t(`gender.${animal.gender}`)}</span>
              <Icon name={genderIconNames[animal.gender]} />
            </div>
            <div className={classNames(style.badge, style.size)}>Wielkość: {t(`size.${animal.size}`)}</div>
            <div className={classNames(style.badge, style.ageText)}>Wiek: Dorosły</div>
          </div>
        </div>

        <div className={style.bottom}>
          <div className={style.location}>
            <Icon name='mapPin' />
            <span>{animal.city}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalCard;
