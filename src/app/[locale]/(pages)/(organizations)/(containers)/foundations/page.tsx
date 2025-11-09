'use client';

import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button, List, Pagination } from 'src/components';
import { paginationConfig } from 'src/config/pagination';
import { Params } from 'src/constants/params';
import { IOrganization } from 'src/constants/types';
import { organizationsMock } from 'src/mocks/organizations';
import { useRouter } from 'src/navigation';

import OrganizationCard from '../../components/OrganizationCard';
import OrganizationFilters from '../../components/OrganizationFilters';

import style from './SheltersPage.module.scss';
import OrganizationOnMap from '../../components/OrganizationOnMap';
import { OrganizationsApi } from 'src/api';

const FundationPage = () => {
  const t = useTranslations('pages.animals');

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [organizations, setOrganizations] = useState<IOrganization[]>([]);
  const [total, setTotal] = useState<number>(1);

  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [showMap, setShowMap] = useState<boolean>(false);

  const changePage = (page: number) => {
    params.set(Params.PAGE, page.toString());
    router.push(`?${params.toString()}`);
  };
  const currentPage = Number(searchParams.get('page')) || 1;
  const itemsPerPage = 10; 


  const getFoundations = useCallback(async (filters?: any) => {
    setIsLoading(true);
    try {
      const res = await OrganizationsApi.getOrganizations(filters);
      const organizationData = res.data?.results || [];
      setOrganizations(organizationData);
      setTotal(res.data?.count || 0);
    } catch (error) {
      setOrganizations([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const filters: Record<string, string> = {};
  
    filters.limit = String(itemsPerPage);
    filters.page = String(currentPage);
    filters['organization-type'] = 'FUND'; 
  
    searchParams.forEach((value, key) => {
      if (key !== Params.PAGE) {
        // якщо параметр вже є (наприклад organization-type), то додаємо через кому
        if (filters[key]) {
          filters[key] = `${filters[key]},${value}`;
        } else {
          filters[key] = value;
        }
      }
    });
  
    getFoundations(filters);
  }, [searchParams, getFoundations]);

  useEffect(() => {
    if('/foundations' !== pathname) setShowMap(false);
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
          id="button"
          label={showFilters ? t('hideFilters') : t('showFilters')}
          onClick={() => setShowFilters((prev) => !prev)}
          empty={!showFilters}
          icon='filter'
        />
        <Button
          id="button"
          label={showMap ? t('hideMap') : t('showMap')}
          onClick={() => setShowMap((prev) => !prev)}
          empty={!showMap}
          icon='map'
          disabled={organizations.every(o => o.address === null)}
        />
      </div>

      <OrganizationFilters className={classNames(style.filters, { [style.show]: showFilters })} />

      <div id='map'>
          <div className={style.content}>
          <List
            isLoading={isLoading}
            className={style.list}
          >
            {organizations.map((organization) => (
              <OrganizationCard
                key={organization.id}
                organization={organization}
              />
            ))}
          </List>

          <OrganizationOnMap
            organizations={organizations}
            className={classNames(style.map, { [style.show]: showMap })}
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

export default FundationPage;
