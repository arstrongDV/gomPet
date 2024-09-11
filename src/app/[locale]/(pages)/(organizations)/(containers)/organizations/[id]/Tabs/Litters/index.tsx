'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import BusinessCard from 'src/app/[locale]/(pages)/(organizations)/components/BusinessCard';
import LitterCard from 'src/app/[locale]/(pages)/(organizations)/components/LitterCard';
import OrganizationOnMap from 'src/app/[locale]/(pages)/(organizations)/components/OrganizationOnMap';
import { List } from 'src/components';
import { ILitter, IOrganization } from 'src/constants/types';
import { littersMock } from 'src/mocks/litters';

import style from './Litters.module.scss';

type LittersProps = {
  organization: IOrganization;
};

const Litters = ({ organization }: LittersProps) => {
  const t = useTranslations();

  const [isLoading, setIsLoading] = useState(true);
  const [currentLitters, setCurrentLitters] = useState<ILitter[]>([]);
  const [previousLitters, setPreviousLitters] = useState<ILitter[]>([]);

  const getLitters = async () => {
    try {
      setIsLoading(true);
      const data = littersMock;

      const current = data.filter((item) => new Date(item.birth_date) > new Date());
      const previous = data.filter((item) => new Date(item.birth_date) <= new Date());

      setPreviousLitters(previous);
      setCurrentLitters(current);
    } catch (error) {
      setCurrentLitters([]);
      setPreviousLitters([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLitters();
  }, [organization.id]);

  if (!organization) return null;
  return (
    <div className={style.container}>
      <div className={style.row}>
        <BusinessCard organization={organization} />
        <OrganizationOnMap organization={organization} />
      </div>

      <section className={style.section}>
        <h2 className={style.title}>
          <mark>Planowane</mark> mioty
        </h2>

        <List
          isLoading={isLoading}
          className={style.list}
        >
          {currentLitters.map((litter) => (
            <LitterCard
              key={litter.id}
              litter={litter}
            />
          ))}
        </List>
      </section>

      <section className={style.section}>
        <h2 className={style.title}>
          <mark>Poprzednie</mark> mioty
        </h2>

        <List
          isLoading={isLoading}
          className={style.list}
        >
          {previousLitters.map((litter) => (
            <LitterCard
              key={litter.id}
              litter={litter}
            />
          ))}
        </List>
      </section>
    </div>
  );
};

export default Litters;
