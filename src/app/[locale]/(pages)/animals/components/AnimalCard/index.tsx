'use client';

import React, {useEffect, useState} from 'react';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import { IconNames } from 'src/assets/icons';
import { Button, Icon } from 'src/components';
import { IAnimal } from 'src/constants/types';

import style from './AnimalCard.module.scss';
import { usePathname, useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector, useAppStore } from 'src/lib/store/hooks';
import { addItemToFavorites, deleteItemFromFavorites } from '../../../bookmarks/slice';///
import OutsideClickHandler from 'react-outside-click-handler';
import toast from 'react-hot-toast';
import { Routes } from 'src/constants/routes';
import SettingsButton from 'src/components/layout/Settings';

const genderIconNames: { [key: string]: IconNames } = {
  male: 'genderMale',
  female: 'genderFemale'
};

type AnimalCardProps = {
  className?: string;
  animal: IAnimal;
  isSettingsOpen?: boolean;
  setOpenedCardId?: (id: string | null) => void;
  onToggleSettings?: () => void;
  onDelete?: (id: number) => void;
};

const AnimalCard = ({ className, animal, setOpenedCardId, onDelete }: AnimalCardProps) => {

  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const favorites = useAppSelector((state) => state.bookmarks.favorites);
  const isFavorite = favorites.some((fav) => fav.id === animal.id);

  const t = useTranslations('pages.animals');
  const {push} = useRouter();

  const cardClasses = classNames(style.card, className);
  const cardStyles = {
    backgroundImage: `url(${animal.image})`,
  };

  const toggleFavorite = () => {
    const isFav = favorites.some((fav) => fav.id === animal.id);
    if (isFav) {
      dispatch(deleteItemFromFavorites(animal));
    } else {
      dispatch(addItemToFavorites(animal));
    }
  };

  const handleUpdateClick = () => {
    push(Routes.EDIT(animal.id))
    setOpenedCardId?.(null);
  };

  return (
    <div className={cardClasses} style={cardStyles}>
      <div className={style.gradient}></div>
      <div className={style.content}>
        <div className={style.top}>
          <div className={style.about}>
            <h2 className={classNames(style.badge, style.title)}>{animal.name}</h2>
            {/* {animal.age && ( */}
              <div className={classNames(style.badge, style.age)}>{animal.age >= 1 ? (`${animal.age}+`) : '< 1 rok'}</div>
            {/* )} */}
            {animal.characteristicBoard.find(item => item.bool === true) && (
              <div className={classNames(style.badge, style.characteristics)}>
                {/* {t(`characteristics.${animal.species}.${animal.characteristicBoard[0].title}`)} */}
                {(() => {
                  const firstTrue = animal.characteristicBoard.find(item => item.bool === true);
                  return firstTrue ? firstTrue.title : null;
                })()}
              </div>
            )}
          </div>
          <button className={classNames(style.addBookmark, {
            [style['addBookmark--active']]: isFavorite,
          })} onClick={toggleFavorite}>
            <Icon name='heart' />
          </button>

          {pathname == '/my-animals' && (
            <div onClick={(e) => e.stopPropagation()} className={style.addBookmark}>
              <SettingsButton
                authId={animal.owner}
                onEdit={handleUpdateClick}
                onDelete={() => {
                  onDelete?.(animal.id);
                  setOpenedCardId?.(null); 
              }} 
              />
            </div>

          )}

        </div>

        <div className={style.hoverContent} >
          <div className={style.data}>
            <div className={classNames(style.badge, style.gender)}>
              <span>Płeć:  {t(`gender.${(animal.gender).toLowerCase()}`)}</span>
              <Icon name={genderIconNames[animal.gender]} />
            </div>
            <div className={classNames(style.badge, style.size)}>Wielkość: {t(`size.${animal.size.toLowerCase()}`)}</div>
            <div className={classNames(style.badge, style.ageText)}>Wiek: Dorosły</div>
          </div>
          <Button 
            className={style.buttonCard} 
            label="Poznaj szczegóły" 
            onClick={() => push(`/animals/${animal.id}`)} 
          />
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
