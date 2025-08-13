'use client';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Avatar, Button } from 'src/components';
import { IPost } from 'src/constants/types';
import { getDaysAgo } from 'src/utils/helpers';

import PostReactions from './components/PostReactions';
import PostComments from './components/PostComments';
import { useSession } from 'next-auth/react';
import style from './PostCard.module.scss';
import ShareComments from './components/ShareComments';

type PostCardProps = {
  className?: string;
  post: IPost;
};

const PostCard = ({ post, className }: PostCardProps) => {
  const { id, text, created_at, image, author, reactions, comments } = post;
  const [showComments, setShowComments] = useState(false);
  const [showCopyLink, setShowCopyLink] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showCopyLink ? 'hidden' : '';
  }, [showCopyLink]);
  useEffect(() => {
    document.body.style.overflow = showComments ? 'hidden' : '';
  }, [showComments]);

  return (
    <article className={classNames(style.post, className)}>
      {showComments && (
        <div className={style.backdrop} onClick={() => setShowComments(false)} />
      )}
      {showCopyLink && (
        <div className={style.backdrop} onClick={() => setShowCopyLink(false)} />
      )}
      <header className={style.header}>
        <div className={style.author}>
          <Avatar className={style.avatar} profile={author} />
          <h3 className={style.name}>{author.name}</h3>
        </div>

        <Button icon="starFilled" label={'Obserwujesz'} gray />
      </header>

      <p className={style.text}>
        {text}
        {image && (
          <img className={style.image} src={image} alt={text} />
        )}
      </p>

      <footer className={style.footer}>
        <span className={style.time}>
          Opublikowane <time>{getDaysAgo(created_at, true).toLowerCase()}</time>
        </span>
        <div className={style.buttons}>
          <PostReactions
            postId={id}
          />
          <Button
            icon="message"
            gray
            onClick={() => setShowComments(prev => !prev)}
          />
          <Button icon="share" gray  onClick={() => setShowCopyLink(prev => !prev)}/>
        </div>
      </footer>
      {showCopyLink && <ShareComments commentId={id} />}
      {showComments && <PostComments postId={id} comments={comments} />}
    </article>
  );
};

export default PostCard;
