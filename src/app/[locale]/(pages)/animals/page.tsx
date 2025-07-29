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
import OrganizationOnMap from '../(organizations)/components/OrganizationOnMap';
import { IOrganization } from 'src/constants/types';
import { organizationsMock } from 'src/mocks/organizations';
import { useAppSelector } from 'src/lib/store/hooks';
import { AnimalsApi } from 'src/api';

const AnimalsPage = () => {
  const t = useTranslations('pages.animals');

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [animals, setAnimals] = useState<IAnimal[]>([]);
  const [total, setTotal] = useState<number>(1);

  const [organizations, setOrganizations] = useState<IOrganization[]>([]);

  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [showMap, setShowMap] = useState<boolean>(false);

  const changePage = (page: number) => {
    params.set(Params.PAGE, page.toString());
    router.push(`?${params.toString()}`);
  };

  const getAnimals = React.useCallback(async (filters?: any) => {
    setIsLoading(true);
    try {
      const response = await AnimalsApi.getAnimalsFilter(filters);
      console.log('API Response:', response); // Debug logging
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
      species: searchParams.getAll('species'),
      organizationType: searchParams.getAll('organization-type'),
      characteristics: searchParams.getAll('characteristics'),
      gender: searchParams.getAll('gender'),
      size: searchParams.getAll('size'),
      name: searchParams.getAll('name'),
      location: searchParams.getAll('location'),
      age: searchParams.getAll('age').map(Number),
      range: searchParams.getAll('range').map(Number),
      organization_id: searchParams.getAll('organization-id').map(Number),
      breed_groups: searchParams.getAll('breed-groups')
    };
    getAnimals(filters);
  }, [searchParams, getAnimals]);

  useEffect(() => {
    setOrganizations(organizationsMock);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        showMap &&
        target &&
        !target.closest('#map') &&  
        !target.closest('#button')   
      ) {
        setShowMap(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMap]);

  return (
    <div className={style.container}>
      <div className={style.buttons}>
        <Button
          id='button'
          label={showFilters ? t('hideFilters') : t('showFilters')}
          onClick={() => setShowFilters((prev) => !prev)}
          empty={showFilters}
          icon='filter'
        />
        <Button
          id='button'
          label={showMap ? t('hideMap') : t('showMap')}
          onClick={() => setShowMap((prev) => !prev)}
          empty={!showMap}
          icon='map'
        />
      </div>

      <AnimalFilters className={classNames(style.filters, { [style.show]: showFilters })} />

        <div id='map'>
          <div className={style.content}>
            <List
                isLoading={isLoading}
                className={classNames(style.list, {
                  [style.fullWidthList]: !showMap
                })}
              >
                {animals.map((animal) => (
                  <AnimalCard key={animal.id} animal={animal} />
                ))}
            </List>

            <OrganizationOnMap
                organizations={organizations}
                className={classNames(style.map, {
                  [style.show]: showMap
                })}
              />
          </div>

          <Pagination
            className={style.pagination}
            totalCount={total}
            pageSize={paginationConfig.animals}
            currentPage={params.get(Params.PAGE) ? Number(params.get(Params.PAGE)) : 1}
            onPageChange={changePage}
          />
        </div> 
    </div>
  );
};

export default AnimalsPage;
