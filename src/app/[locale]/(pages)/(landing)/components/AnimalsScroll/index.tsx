'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { HorizontalScroll, LabelLink, Loader } from 'src/components';
import { Routes } from 'src/constants/routes';
import { IAnimal } from 'src/constants/types';
import { animalsMock } from 'src/mocks/animals';

import AnimalCard from '../../../animals/components/AnimalCard';

import style from './AnimalsScroll.module.scss';

const AnimalsScroll = () => {
  const t = useTranslations('pages.landing');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [animals, setAnimals] = useState<IAnimal[]>([]);

  const getAnimals = async () => {
    setIsLoading(true);
    try {
      setAnimals(animalsMock);
    } catch (error) {
      setAnimals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAnimals();
  }, []);

  return (
    <section className={style.container}>
      <header className={style.header}>
        <h3 className={style.title}>
          {t.rich('animalsScroll.title', {
            highlight: (chunks) => <span className={style.highlight}>{chunks}</span>
          })}
        </h3>
        <LabelLink
          href={Routes.ANIMALS}
          label={t('animalsScroll.seeAll')}
          color='dimmed'
        />
      </header>

      <HorizontalScroll className={style.list}>
        {isLoading && <Loader />}
        {animals.map((animal) => (
          <AnimalCard
            className={style.animal}
            key={animal.id}
            animal={animal}
          />
        ))}
      </HorizontalScroll>
    </section>
  );
};

export default AnimalsScroll;
