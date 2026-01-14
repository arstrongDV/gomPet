'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import BusinessCard from 'src/app/[locale]/(pages)/(organizations)/components/BusinessCard';
import LitterCard from 'src/app/[locale]/(pages)/(organizations)/components/LitterCard';
import OrganizationOnMap from 'src/app/[locale]/(pages)/(organizations)/components/OrganizationOnMap';
import { Button, List } from 'src/components';
import { ILitter, IOrganization } from 'src/constants/types';
import { littersMock } from 'src/mocks/litters';

import style from './Litters.module.scss';
import { OrganizationsApi } from 'src/api';
import AddLitters from './LittersAdd';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Routes } from 'src/constants/routes';

type LittersProps = {
  organization: IOrganization;
};

const Litters = ({ organization }: LittersProps) => {
  const t = useTranslations();
  const session = useSession();
  const myId = session.data?.user.id

  const router = useRouter();
  const { push } = router;

  const [isLoading, setIsLoading] = useState(true);
  const [currentLitters, setCurrentLitters] = useState<ILitter[]>([]);
  const [previousLitters, setPreviousLitters] = useState<ILitter[]>([]);

  // const [litters, setLitters] = useState<ILitter[]>([]);

  const [addLitter, setAddLitter] = useState<boolean>(false);

  const getLitters = async () => {
    try {
      setIsLoading(true);
      const res_litters = await OrganizationsApi.getOrganizationLitters(organization.id);
      console.log('res_litters:: ', res_litters);
      const data = res_litters.data.results;
      // const data = littersMock;
      // setLitters(data);
      const current = data.filter((item: ILitter) => new Date(item.birth_date) > new Date());
      const previous = data.filter((item: ILitter) => new Date(item.birth_date) <= new Date());

      setPreviousLitters(previous);
      console.log('previous:: ', previous);
      setCurrentLitters(current);
      console.log('current:: ', current);
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
  const onLitterAdded = (newLitter: any) => {
    setCurrentLitters(prev => [...prev, newLitter]);
    setAddLitter(false);
  }

  const onDelete = (id: number) => {
    setLitters(prev => prev.filter(l => l.id !== id));
    setCurrentLitters(prev => prev.filter(l => l.id !== id));
    setPreviousLitters(prev => prev.filter(l => l.id !== id));
  };

  if (!organization) return null;
  return (
    <div className={style.container}>
      <div className={style.row}>
        <BusinessCard organization={organization} />
        <div className={style.mapWrraper}>
          <OrganizationOnMap className={style.map} organizations={[organization]} />
        </div>
      </div>

      {organization.user == myId && (
      <Button label="Dodaj miot" icon='plus' width="200px" onClick={() => push(Routes.NEW_LITTER(organization.id))} />
      )}

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
              organizationUser={organization.user}
              onDelete={onDelete}
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
              organizationUser={organization.user}
              onDelete={onDelete}
            />
          ))}
        </List>
      </section>

      {/* {addLitter && (
        <AddLitters setAddLitter={setAddLitter} organization={organization} onLitterAdded={onLitterAdded} />
      )} */}
    </div>
  );
};

export default Litters;
