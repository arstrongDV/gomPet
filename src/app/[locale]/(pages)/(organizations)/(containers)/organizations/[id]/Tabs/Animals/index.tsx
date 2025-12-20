'use client';

import React, { useEffect, useState } from 'react';

import BusinessCard from 'src/app/[locale]/(pages)/(organizations)/components/BusinessCard';
import OrganizationOnMap from 'src/app/[locale]/(pages)/(organizations)/components/OrganizationOnMap';
import AnimalCard from 'src/app/[locale]/(pages)/animals/components/AnimalCard';
import { List } from 'src/components';
import { IAnimal, IOrganization } from 'src/constants/types';
import { animalsMock } from 'src/mocks/animals';

import style from './Animals.module.scss';
import { OrganizationsApi } from 'src/api';

type AnimalsProps = {
  organization: IOrganization;
};

const Animals = ({ organization }: AnimalsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [animals, setAnimals] = useState<IAnimal[]>([]);

  const getAnimals = async () => {
    try {
      setIsLoading(true);
      const res_animals = await OrganizationsApi.getOrganizationAnimals(organization.id);
      console.log(res_animals)
      setAnimals(res_animals.data.results);
    } catch (error) {
      setAnimals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAnimals();
  }, [organization.id]);

  if (!organization) return null;
  return (
    <div className={style.container}>
      <div className={style.row}>
        <BusinessCard organization={organization} />
        <div className={style.mapWrraper}>
          <OrganizationOnMap className={style.map} organizations={[organization]} />
        </div>
      </div>

      <List
        isLoading={isLoading}
        className={style.list}
      >
        {animals.map((animal) => (
          <AnimalCard
            key={animal.id}
            animal={animal}
          />
        ))}
      </List>
    </div>
  );
};

export default Animals;
