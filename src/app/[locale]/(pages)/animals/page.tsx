'use client';

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button, List, Pagination } from 'src/components';
import { paginationConfig } from 'src/config/pagination';
import { Params } from 'src/constants/params';
import { IAnimal } from 'src/constants/types';
import { useRouter } from 'src/navigation';

import AnimalCard from './components/AnimalCard';
import AnimalFilters from './components/AnimalFilters';

import style from './AnimalsPage.module.scss';

import { AnimalsApi } from 'src/api';
import AnimalsOnMap from './components/AnimalsOnMap';

const AnimalsPage = () => {
  const t = useTranslations('pages.animals');

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [animals, setAnimals] = useState<IAnimal[]>([]);
  const [total, setTotal] = useState<number>(1);

  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [showMap, setShowMap] = useState<boolean>(false);

  const changePage = (page: number) => {
    params.set(Params.PAGE, page.toString());
    router.push(`?${params.toString()}`);
  };

  const currentPage = Number(searchParams.get('page')) || 1;
  console.log(searchParams);
  const getAnimals = React.useCallback(async (filters?: any) => {
    setIsLoading(true);
    try {
      const response = await AnimalsApi.getAnimalsFilter(filters);
      console.log('API Response:', response); 
      setAnimals(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Error fetching animals:', error);
      setAnimals([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const filters = {
      // limit: itemsPerPage,
      page: currentPage,
      species: searchParams.getAll('species'),
      breed: searchParams.getAll('breed'),
      organizationType: searchParams.getAll('organization-type'),
      characteristics: searchParams.getAll('characteristics'),
      gender: searchParams.getAll('gender'),
      size: searchParams.getAll('size'),
      name: searchParams.getAll('name'),

      city: searchParams.getAll('city'),
      // age: searchParams.getAll('age').map(Number),
      minAge: searchParams.getAll('age-min').map(Number),
      maxAge: searchParams.getAll('age-max').map(Number),

      location: searchParams.get('location') || undefined,
      range: searchParams.get('range')
        ? Number(searchParams.get('range'))
        : undefined,

      organization_id: searchParams.getAll('organization-id').map(Number),
      breed_groups: searchParams.getAll('breed-groups')
    };
    getAnimals(filters);
  }, [searchParams, getAnimals]);

  return (
    <div className={style.container}>
      <div className={style.buttons}>
        <Button
          label={showFilters ? t('hideFilters') : t('showFilters')}
          onClick={() => setShowFilters((prev) => !prev)}
          empty={showFilters}
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

      {/* <div> */}
        <div className={style.content}>
          <AnimalsOnMap
              animals={animals}
              className={classNames(style.map, {
                [style.show]: showMap
              })}
            />

          <List
            isLoading={isLoading}
            className={classNames(style.list, {
              [style.fullWidthList]: !showMap,
              [style.withMap]: showMap,
            })}
          >
              {animals.map((animal) => (
                <AnimalCard key={animal.id} animal={animal} showMap={showMap} />
              ))}
          </List>
        </div>

        <Pagination
          className={style.pagination}
          totalCount={total}
          pageSize={paginationConfig.animals}
          currentPage={params.get(Params.PAGE) ? Number(params.get(Params.PAGE)) : 1}
          onPageChange={changePage}
        />
      </div> 
    // </div>
  );
};

export default AnimalsPage;