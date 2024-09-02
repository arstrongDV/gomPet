'use client';

import React, { useEffect, useState } from 'react';

import { List } from 'src/components';
import { IArticle } from 'src/constants/types';
import { articlesMock } from 'src/mocks/articles';

import ArticleCard from './components/ArticleCard';

import style from './BlogPage.module.scss';

const BlogPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [articles, setArticles] = useState<IArticle[]>([]);

  const getArticles = async () => {
    setIsLoading(true);
    try {
      setArticles(articlesMock);
    } catch (error) {
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <div className={style.container}>
      <List
        isLoading={isLoading}
        className={style.list}
      >
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}
      </List>
    </div>
  );
};

export default BlogPage;
