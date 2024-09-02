import React from 'react';
import classNames from 'classnames';

import { Button, Icon } from 'src/components';
import { Routes } from 'src/constants/routes';
import { IArticle } from 'src/constants/types';
import { Link } from 'src/navigation';

import style from './ArticleCard.module.scss';

type ArticleCardProps = {
  className?: string;
  article: IArticle;
};

const ArticleCard = ({ article, className }: ArticleCardProps) => {
  const { id, title, content, image = null, created_at, slug } = article;

  return (
    <article className={classNames(style.article, className)}>
      <Link
        className={style.cover}
        href={Routes.BLOG_ARTICLE(slug)}
      >
        {image ? (
          <img
            src={image}
            alt={title}
          />
        ) : (
          <Icon
            className={style.placeholderIcon}
            name='camera'
          />
        )}
      </Link>

      <div className={style.body}>
        <Link href={Routes.BLOG_ARTICLE(slug)}>
          <h2 className={style.title}>{title}</h2>
        </Link>
        <p className={style.content}>{content}</p>

        <Button
          label={'Przeczytaj artykuł'}
          href={Routes.BLOG_ARTICLE(slug)}
        />
      </div>
    </article>
  );
};

export default ArticleCard;
