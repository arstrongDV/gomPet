'use client';

import React, { useEffect, useState } from 'react';

import { Button, Checkbox, List, Modal, Pagination } from 'src/components';
import { IArticle } from 'src/constants/types';

import style from './BlogPage.module.scss';
import { ArticlesApi } from 'src/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { Params } from 'src/constants/params';
import { paginationConfig } from 'src/config/pagination';
import AddKnowledge from './components/ArticleCard/AddKnowledge';
import { useSession } from 'next-auth/react';
import useCategories from 'src/components/hooks/useCategories';
import KnowledgeCard from './components/ArticleCard';

const BlogPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [knowladge, setKnowledge] = useState<IArticle[]>([]);
  
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();
  const [total, setTotal] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const { categories, loading } = useCategories();

  const session = useSession();

  console.log("knowladge::", knowladge);

  const changePage = (page: number) => {
    params.set(Params.PAGE, page.toString());
    router.push(`?${params.toString()}`);
    };

  const currentPage = Number(searchParams.get('page')) || 1;

  const hasCategoryParam = selectedCategories.length == 0 ? 'has-category=true' : `category=${selectedCategories.join(',')}`;

  const getKnowledge = async () => {
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
    getKnowledge();
  }, [currentPage, selectedCategories]);

  return (
    <div className={style.container}>
      <div className={style.categories}>
        {categories.map(cat => (
          <Checkbox
            key={cat.id}
            id={`category-${cat.id}`}
            className={style.checkbox}
            checked={selectedCategories.includes(cat.id)}
            onChange={() => {
              setSelectedCategories(prev =>
                prev.includes(cat.id)
                  ? prev.filter(id => id !== cat.id)
                  : [...prev, cat.id]
              );
            }}
            label={cat.label}
          />
        ))}
      </div>
      {session.status === 'authenticated' && !isLoading &&(
        <Button className={style.btnAdd} label="Dodaj wiedze" icon='plus' onClick={() => setIsOpen(prev => !prev)} />
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
          title='Dodaj Wiedze'
        >
          <AddKnowledge setIsOpen={setIsOpen} refreshKnowledge={() => getKnowledge()} />
        </Modal>
    </div>
  );
};

export default BlogPage;
