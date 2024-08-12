'use client';

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button, List, Pagination } from 'src/components';
import { paginationConfig } from 'src/config/pagination';
import { Params } from 'src/constants/params';
import { IOrganization } from 'src/constants/types';
import { organizationsMock } from 'src/mocks/organizations';
import { useRouter } from 'src/navigation';

import OrganizationCard from '../components/OrganizationCard';
import OrganizationFilters from '../components/OrganizationFilters';

import style from './SheltersPage.module.scss';

const SheltersPage = () => {
  const t = useTranslations('pages.animals');

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [organizations, setOrganizations] = useState<IOrganization[]>([]);
  const [total, setTotal] = useState<number>(1);

  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [showMap, setShowMap] = useState<boolean>(false);

  const changePage = (page: number) => {
    params.set(Params.PAGE, page.toString());
    router.push(`?${params.toString()}`);
  };

  const getShelters = async () => {
    setIsLoading(true);
    try {
      setOrganizations(organizationsMock);
      setTotal(120);
    } catch (error) {
      setOrganizations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getShelters();
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

      <OrganizationFilters className={classNames(style.filters, { [style.show]: showFilters })} />

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

export default SheltersPage;
