'use client';

import React, {useEffect, useState} from 'react';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import { IconNames } from 'src/assets/icons';
import { Button, Icon } from 'src/components';
import { IAnimal } from 'src/constants/types';

import style from './AnimalCard.module.scss';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import toast from 'react-hot-toast';
import { Routes } from 'src/constants/routes';
import SettingsButton from 'src/components/layout/Settings';
import { ArticlesApi } from 'src/api';
import { useSession } from 'next-auth/react';

const genderIconNames: { [key: string]: IconNames } = {
  male: 'genderMale',
  female: 'genderFemale'
};

type AnimalCardProps = {
  className?: string;
  animal: IAnimal;
  showMap?: boolean;
  isSettingsOpen?: boolean;
  setOpenedCardId?: (id: string | null) => void;
  onToggleSettings?: () => void;
  onDelete?: (id: number) => void;
  onReactionDelete?: (id: number) => void;
  filledButton?: boolean;
};

const AnimalCard = ({ className, animal, setOpenedCardId, onDelete, onReactionDelete, showMap, filledButton }: AnimalCardProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const session = useSession();

  const [reactionId, setReactionId] = useState<number>(0);

  const myId = session.data?.user?.id;

  const isOrganizationAnimalsPage = 
  pathname.startsWith('/organizations/') && 
  searchParams.get('tab') === 'animals';

  console.log("animalanimal: ", animal);

  useEffect(() => {
    const checkReaction = async () => {
      try {
        const res = await ArticlesApi.verifyReactions("animals.animal", animal.id);
        setReactionId(res?.data?.reaction_id ?? 0);
        console.log("verifyReactions res:", res);
      } catch (err) {
        console.error("Błąd przy sprawdzaniu reakcji:", err);
      }
    };

    if (session.status === "authenticated") {
      checkReaction();
    }
  }, [animal.id, session.status]);

  const handleReaction = async () => {
    const isLoggedInUser = session.status === 'authenticated' && !!myId;
    if (!isLoggedInUser) {
      toast.error('Musisz być zalogowany, aby polubić post.');
      return;
    }

    if (reactionId === 0) {
      try {
        const res = await ArticlesApi.AddNewReaction({
          reaction_type: "LIKE",
          reactable_type: "animals.animal",
          reactable_id: animal.id,
        });

        if (res?.status === 201) {
          setReactionId(res.data.id);
        }

        console.log("Add reaction res:", res);
      } catch (err) {
        console.error("Błąd przy dodawaniu reakcji:", err);
      }
    } else {
      try {
        const res = await ArticlesApi.deleteReaction(reactionId);

        if (res?.status === 200 || res?.status === 204) {
          setReactionId(0);
          onReactionDelete?.(animal.id);
        }

        console.log("Delete reaction res:", res);
      } catch (err) {
        console.error("Błąd przy usuwaniu reakcji:", err);
      }
    }
  };

  const t = useTranslations('pages.animals');
  const {push} = useRouter();

  const cardClasses = classNames(
    style.card, 
    className,
    {
      [style['card--map']]: showMap,
    }
  );
  const cardStyles = {
    backgroundImage: `url(${animal.image})`,
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
            <div className={classNames(style.badge, style.age)}>{animal.age >= 1 ? (`${animal.age}+`) : '< 1 rok'}</div>

            {animal.characteristicBoard.find(item => item.bool === true) && (
              <div className={classNames(style.badge, style.characteristics)}>
                {(() => {
                  const firstTrue = animal.characteristicBoard.find(item => item.bool === true);
                  return firstTrue ? firstTrue.title : null;
                })()}
              </div>
            )}
          </div>
          <button className={classNames(style.addBookmark, {
            [style['addBookmark--active']]: reactionId !== 0,
          })} onClick={() => handleReaction()}>
            <Icon name='heart' />
          </button>
          {(
            pathname === Routes.MY_ANIMALS ||
            isOrganizationAnimalsPage
          ) && (
            <div onClick={(e) => e.stopPropagation()} >
              <SettingsButton
                authId={Number(animal.owner)}
                ownerId={animal.organization && Number(animal.organization.user)}
                onEdit={handleUpdateClick}
                onDelete={() => {
                  onDelete?.(animal.id);
                  setOpenedCardId?.(null); 
                }} 
                filledButton={filledButton}
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
            <span>{animal.city ? animal.city.slice(0, 30) : 'brak miasta'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalCard;
