'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { HorizontalScroll, LabelLink, Loader } from 'src/components';
import { Routes } from 'src/constants/routes';
import { IOrganization } from 'src/constants/types';
import { organizationsMock } from 'src/mocks/organizations';

import OrganizationCard from '../../../(organizations)/components/OrganizationCard';

import style from './OrganizationsScroll.module.scss';

const OrganizationsScroll = () => {
  const t = useTranslations('pages.landing');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [organizations, setOrganizations] = useState<IOrganization[]>([]);

  const getAnimals = async () => {
    setIsLoading(true);
    try {
      setOrganizations(organizationsMock);
    } catch (error) {
      setOrganizations([]);
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
          {t.rich('organizationsScroll.title', {
            highlight: (chunks) => <span className={style.highlight}>{chunks}</span>
          })}
        </h3>
        <LabelLink
          href={Routes.ANIMALS}
          label={t('organizationsScroll.seeAll')}
          color='dimmed'
        />
      </header>

      <HorizontalScroll className={style.list}>
        {isLoading && <Loader />}
        {organizations.map((organization) => (
          <OrganizationCard
            key={organization.id}
            className={style.item}
            organization={organization}
          />
        ))}
      </HorizontalScroll>
    </section>
  );
};

export default OrganizationsScroll;
