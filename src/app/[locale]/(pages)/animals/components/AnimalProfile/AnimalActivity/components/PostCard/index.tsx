import React from 'react';
import classNames from 'classnames';

import { Avatar, Button } from 'src/components';
import { IPost } from 'src/constants/types';
import { getDaysAgo } from 'src/utils/helpers';

import PostReactions from './components/PostReactions';

import style from './PostCard.module.scss';

type PostCardProps = {
  className?: string;
  post: IPost;
};

const PostCard = ({ post, className }: PostCardProps) => {
  const { id, text, created_at, image, author, reactions } = post;

  return (
    <article className={classNames(style.post, className)}>
      <header className={style.header}>
        <div className={style.author}>
          <Avatar
            className={style.avatar}
            profile={author}
          />
          <h3 className={style.name}>{author.name}</h3>
        </div>

        <Button
          icon='starFilled'
          label={'Obserwujesz'}
          gray
        />
      </header>

      <p className={style.text}>
        {text}

        {image && (
          <img
            className={style.image}
            src={image}
            alt={text}
          />
        )}
      </p>

      <footer className={style.footer}>
        <span className={style.time}>
          Opublikowane <time>{getDaysAgo(created_at, true).toLowerCase()}</time>
        </span>
        <div className={style.buttons}>
          <PostReactions
            postId={id}
            reactions={reactions}
          />
          <Button
            icon='message'
            gray
          />
          <Button
            icon='share'
            gray
          />
        </div>
      </footer>
    </article>
  );
};

export default PostCard;
