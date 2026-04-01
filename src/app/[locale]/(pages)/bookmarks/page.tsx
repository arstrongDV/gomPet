'use client';

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { AnimalsApi } from 'src/api';
import { List, Pagination } from 'src/components';
import { paginationConfig } from 'src/config/pagination';
import { Params } from 'src/constants/params';
import { IAnimal } from 'src/constants/types';
import { useRouter } from 'src/navigation';

import AnimalCard from '../animals/components/AnimalCard';

import style from './Bookmarks.module.scss';

const Bookmarks = () => {
  const t = useTranslations('pages.animals');
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [animals, setAnimals] = useState<IAnimal[]>([]);

  const session = useSession();
  const myId = session.data?.user.id;
  const [total, setTotal] = useState<number>(1);

  const changePage = (page: number) => {
    params.set(Params.PAGE, page.toString());
    router.push(`?${params.toString()}`);
  };

  const currentPage = Number(searchParams.get('page')) || 1;

  const postReaction = async () => {
    setIsLoading(true);
    try {
      const res = await AnimalsApi.getUserBookmarks(Number(myId), {
        limit: 10,
        page: currentPage,
      });
      console.log(res);
      setAnimals(res.data?.results)
      setTotal(res.data.count || 0);
    } catch {
      setAnimals([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!myId) return;
    postReaction();
  }, [currentPage, myId]);

  const onReactionDelete = (deletedAnimal: number) => {
    setAnimals(animals.filter(animal => animal.id !== deletedAnimal));
  };

  return (
    <div className={style.bookmarksWrapper}>
      <List
        isLoading={isLoading}
        className={classNames(style.list)}
      >
          {animals.map((animal: any) => (
            <AnimalCard key={animal.id} animal={animal} onReactionDelete={onReactionDelete} />
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

export default Bookmarks;