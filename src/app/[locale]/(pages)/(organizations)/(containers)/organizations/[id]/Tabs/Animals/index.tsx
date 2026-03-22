'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { OrganizationsApi } from 'src/api';
import BusinessCard from 'src/app/[locale]/(pages)/(organizations)/components/BusinessCard';
import OrganizationOnMap from 'src/app/[locale]/(pages)/(organizations)/components/OrganizationOnMap';
import AnimalCard from 'src/app/[locale]/(pages)/animals/components/AnimalCard';
import { List, Pagination } from 'src/components';
import { paginationConfig } from 'src/config/pagination';
import { Params } from 'src/constants/params';
import { IAnimal, IOrganization } from 'src/constants/types';

import style from './Animals.module.scss';

type AnimalsProps = {
  organization: IOrganization;
};

const Animals = ({ organization }: AnimalsProps) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [animals, setAnimals] = useState<IAnimal[]>([]);
  const [total, setTotal] = useState<number>(1);

  const changePage = (page: number) => {
    params.set(Params.PAGE, page.toString());
    router.push(`?${params.toString()}`);
  };

  const currentPage = Number(searchParams.get('page')) || 1;

  const getAnimals = async () => {
    try {
      setIsLoading(true);
      const res_animals = await OrganizationsApi.getOrganizationAnimals(organization.id, {
        page: currentPage
      });
      console.log(res_animals);
      setAnimals(res_animals.data.results);
      setTotal(res_animals.data.count);
    } catch (error) {
      setAnimals([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAnimals();
  }, [currentPage, organization.id]);

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
            filledButton
          />
        ))}
      </List>

      <Pagination
          className={style.pagination}
          totalCount={total}
          pageSize={paginationConfig.animals}
          currentPage={params.get(Params.PAGE) ? Number(params.get(Params.PAGE)) : 1}
          onPageChange={changePage}
      />
    </div>
  );
};

export default Animals;
