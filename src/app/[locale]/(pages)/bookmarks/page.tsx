'use client';

import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'src/lib/store/hooks';
import { addItemToFavorites, deleteItemFromFavorites } from './slice';
import { useRouter } from 'next/navigation';

import style from './Bookmarks.module.scss';
import classNames from 'classnames';
import { Icon } from 'src/components';
import { useTranslations } from 'next-intl';
import { IconNames } from 'src/assets/icons';
import { IAnimal } from 'src/constants/types';

const genderIconNames: { [key: string]: IconNames } = {
  male: 'genderMale',
  female: 'genderFemale'
};

const Bookmarks = () => {
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.bookmarks.favorites);
  const t = useTranslations('pages.animals');
  const { push } = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleCardClick = (event: React.MouseEvent, id: string) => {
    const target = event.target as HTMLElement;
    if (!target.closest('button')) {
      push(`/animals/${id}`);
    }
  };

  const toggleFavorite = (animal: IAnimal) => {
    const isFav = favorites.some((fav) => fav.id === animal.id);
    if (isFav) {
      dispatch(deleteItemFromFavorites(animal));
    } else {
      dispatch(addItemToFavorites(animal));
    }
  };

  if (favorites.length === 0) return <div>No Favorites Now</div>;

  return (
    <div className={style.bookmarksWrapper}>
      {favorites.map((animal) => {
        const isFavorite = favorites.some((fav) => fav.id === animal.id);
        const cardClasses = classNames(style.card);
        const cardStyles = {
          backgroundImage: `url(${animal.image})`
        };

        return (
          <div
            key={animal.id}
            className={cardClasses}
            style={cardStyles}
          >
            <div className={style.gradient}></div>
            <div className={style.content} onClick={(e) => handleCardClick(e, animal.id.toString())}>
              <div className={style.top}>
                <div className={style.about}>
                  <h2 className={classNames(style.badge, style.title)}>{animal.name}</h2>
                  <div className={classNames(style.badge, style.age)}>+{animal.age}</div>
                  {animal.characteristicsBoard?.length > 0 && (
                    <div className={classNames(style.badge, style.characteristics)}>
                      {t(`characteristics.${animal.species}.${animal.characteristicsBoard[0]}`)}
                    </div>
                  )}
                </div>
                <button
                  id='#button'
                  className={classNames(style.addBookmark, {
                    [style['addBookmark--active']]: isFavorite,
                  })}
                  onClick={() => toggleFavorite(animal)}
                >
                  <Icon name='heart' />
                </button>
              </div>

              <div className={style.hoverContent}>
                <div className={style.data}>
                  <div className={classNames(style.badge, style.gender)}>
                    <span>Płeć: {t(`gender.${animal.gender}`)}</span>
                    <Icon name={genderIconNames[animal.gender]} />
                  </div>
                  <div className={classNames(style.badge, style.size)}>
                    Wielkość: {t(`size.${animal.size}`)}
                  </div>
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
      })}
    </div>
  );
};

export default Bookmarks;
