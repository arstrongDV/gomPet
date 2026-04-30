'use client';

import React, { useEffect, useState } from 'react';

import { Button, List, Modal, Pagination } from 'src/components';
import { IArticle } from 'src/constants/types';

import style from './BlogPage.module.scss';
import { ArticlesApi } from 'src/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { Params } from 'src/constants/params';
import { paginationConfig } from 'src/config/pagination';
import AddKnowledge from './components/ArticleCard/AddKnowledge';
import { useSession } from 'next-auth/react';
import KnowledgeCard from './components/ArticleCard';
import { useTranslations } from 'next-intl';
import CategoriesFilter from './components/CategoriesFilter';

interface categoryGroupResponse {
    id: number;
    group: string;
    name: string;
    slug: string;
    description: string;
}

const BlogPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [knowladge, setKnowledge] = useState<IArticle[]>([]);
  
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();
  const [total, setTotal] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const t = useTranslations('pages.knowledge');

  const session = useSession();

  const changePage = (page: number) => {
    params.set(Params.PAGE, page.toString());
    router.push(`?${params.toString()}`);
    };

  const currentPage = Number(searchParams.get('page')) || 1;

  const getKnowledge = async (hasCategoryParam?: string) => {
    setIsLoading(true);
    try {
      const res = await ArticlesApi.getArticlesList(currentPage, hasCategoryParam);
      setKnowledge(res.data.results);
      setTotal(res.data.count);
    } catch (error) {
      setKnowledge([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const categoryGroup = searchParams.get('category');
    const hasCategoryParam = categoryGroup ? `category=${categoryGroup}` : undefined;
    getKnowledge(hasCategoryParam);
  }, [currentPage, searchParams]);

  return (
    <div className={style.container}>
      {session.status === 'authenticated' && !isLoading &&(
        <Button className={style.btnAdd} label={t('addKnowledge')} icon='plus' onClick={() => setIsOpen(prev => !prev)} />
      )}

      <List
        isLoading={isLoading}
        className={style.list}
      >
        {knowladge.map((k) => (
          <KnowledgeCard
            key={k.id}
            article={k}
            setKnowledge={setKnowledge}
          />
        ))}
      </List>

      <Pagination
            className={style.pagination}
            totalCount={total}
            pageSize={paginationConfig.articles}
            currentPage={params.get(Params.PAGE) ? Number(params.get(Params.PAGE)) : 1}
            onPageChange={changePage}
        />

        <Modal 
          className={style.modalAddWin} 
          isOpen={isOpen} 
          closeModal={() => setIsOpen(false)}
          title={t('addKnowledge')}
        >
          <AddKnowledge setIsOpen={setIsOpen} refreshKnowledge={() => getKnowledge()} />
        </Modal>
    </div>
  );
};

export default BlogPage;
