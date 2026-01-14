'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { HorizontalScroll, LabelLink, Loader } from 'src/components';
import { Routes } from 'src/constants/routes';
import { IAnimal } from 'src/constants/types';
import { animalsMock } from 'src/mocks/animals';

import AnimalCard from '../../../animals/components/AnimalCard';

import style from './OrganizationAnimals.module.scss';
import { OrganizationsApi } from 'src/api';

type OrganizationAnimalsProps = {
  organizationId: number;
};

const OrganizationAnimals = ({ organizationId }: OrganizationAnimalsProps) => {
  const t = useTranslations();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [animals, setAnimals] = useState<IAnimal[]>([]);

  const getAnimals = async () => {
    setIsLoading(true);
    try {
      const res_animals = await OrganizationsApi.getOrganizationAnimals(organizationId);
      setAnimals(res_animals.data.results);
    } catch (error) {
      setAnimals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAnimals();
  }, [organizationId]);

  return (
    <section className={style.container}>
      <header className={style.header}>
        <h3 className={style.title}>
          <span className={style.highlight}>Podopieczni</span> organizacji
        </h3>
        <LabelLink
          href={Routes.ANIMALS}
          label={t('common.action.seeAll')}
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

export default OrganizationAnimals;
