'use client';

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button, List, Pagination } from 'src/components';
import { paginationConfig } from 'src/config/pagination';
import { Params } from 'src/constants/params';
import { IAnimal } from 'src/constants/types';
import { animalsMock } from 'src/mocks/animals';
import { useRouter } from 'src/navigation';

import AnimalCard from './components/AnimalCard';
import AnimalFilters from './components/AnimalFilters';

import style from './AnimalsPage.module.scss';

const AnimalsPage = () => {
  const t = useTranslations('pages.animals');

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [animals, setAnimals] = useState<IAnimal[]>([]);
  const [total, setTotal] = useState<number>(1);

  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [showMap, setShowMap] = useState<boolean>(false);

  const changePage = (page: number) => {
    params.set(Params.PAGE, page.toString());
    router.push(`?${params.toString()}`);
  };

  const getAnimals = async () => {
    setIsLoading(true);
    try {
      setAnimals(animalsMock);
      setTotal(120);
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
    <div className={style.container}>
      <div className={style.buttons}>
        <Button
          label={showFilters ? t('hideFilters') : t('showFilters')}
          onClick={() => setShowFilters((prev) => !prev)}
          empty={!showFilters}
          icon='filter'
        />
        <Button
          label={showMap ? t('hideMap') : t('showMap')}
          onClick={() => setShowMap((prev) => !prev)}
          empty={!showMap}
          icon='map'
        />
      </div>

      <AnimalFilters className={classNames(style.filters, { [style.show]: showFilters })} />

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

export default AnimalsPage;
