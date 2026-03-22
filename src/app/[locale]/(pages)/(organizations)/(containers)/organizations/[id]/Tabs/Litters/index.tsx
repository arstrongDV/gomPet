'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { OrganizationsApi } from 'src/api';
import BusinessCard from 'src/app/[locale]/(pages)/(organizations)/components/BusinessCard';
import LitterCard from 'src/app/[locale]/(pages)/(organizations)/components/LitterCard';
import OrganizationOnMap from 'src/app/[locale]/(pages)/(organizations)/components/OrganizationOnMap';
import { Button, List, Pagination } from 'src/components';
import { Params } from 'src/constants/params';
import { Routes } from 'src/constants/routes';
import { ILitter, IOrganization } from 'src/constants/types';

import style from './Litters.module.scss';
import { paginationConfig } from 'src/config/pagination';

type LittersProps = {
  organization: IOrganization;
};

const Litters = ({ organization }: LittersProps) => {
  const t = useTranslations();
  const session = useSession();
  const myId = session.data?.user.id;

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const router = useRouter();
  const { push } = router;

  const [isLoading, setIsLoading] = useState(true);
  const [currentLitters, setCurrentLitters] = useState<ILitter[]>([]);
  const [previousLitters, setPreviousLitters] = useState<ILitter[]>([]);
  const [total, setTotal] = useState<number>(1);

  const changePage = (page: number) => {
    params.set(Params.PAGE, page.toString());
    router.push(`?${params.toString()}`);
  };

  const currentPage = Number(searchParams.get('page')) || 1;

  const getLitters = async () => {
    try {
      setIsLoading(true);
      const res_litters = await OrganizationsApi.getOrganizationLitters(organization.id, {
        page: currentPage
      });
      console.log('res_litters:: ', res_litters);
      const data = res_litters.data.results;
      // const data = littersMock;
      // setLitters(data);
      setTotal(res_litters.data.count);
      const current = data.filter((item: ILitter) => new Date(item.birth_date) > new Date());
      const previous = data.filter((item: ILitter) => new Date(item.birth_date) <= new Date());

      setPreviousLitters(previous);
      console.log('previous:: ', previous);
      setCurrentLitters(current);
      console.log('current:: ', current);
    } catch (error) {
      setCurrentLitters([]);
      setTotal(0);
      setPreviousLitters([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getLitters();
  }, [currentPage, organization.id]);
  // const onLitterAdded = (newLitter: any) => {
  //   setCurrentLitters(prev => [...prev, newLitter]);
  //   setAddLitter(false);
  // }

  const onDelete = (id: number) => {
    // setLitters((prev: any) => prev.filter((l: any) => l.id !== id)); ////////
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


      <Pagination
          className={style.pagination}
          totalCount={total}
          pageSize={paginationConfig.posts}
          currentPage={params.get(Params.PAGE) ? Number(params.get(Params.PAGE)) : 1}
          onPageChange={changePage}
      />
    </div>
  );
};

export default Litters;
