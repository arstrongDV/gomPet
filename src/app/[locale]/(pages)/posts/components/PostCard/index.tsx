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

  const { data: session, status } = useSession();
  const myId = session?.user?.id;
  const [postReactions, setPostReactions] = useState(reactions);

  useEffect(() => {
    document.body.style.overflow = showCopyLink ? 'hidden' : '';
  }, [showCopyLink]);
  useEffect(() => {
    document.body.style.overflow = showComments ? 'hidden' : '';
  }, [showComments]);

  const handleReaction = (type: 'like' | 'dislike' | null) => {
    const existing = postReactions.find(r => r.author.id === myId);

    if (existing && existing.type === type) {
      // Kliknięto tę samą reakcję — usuń
      setPostReactions(prev => prev.filter(r => r.author.id !== myId));
    } else if (existing) {
      // Zmieniamy typ reakcji
      setPostReactions(prev =>
        prev.map(r =>
          r.author.id === myId ? { ...r, type } : r
        )
      );
    } else if (type !== null) {
      // Dodajemy nową reakcję
      setPostReactions(prev => [
        ...prev,
        {
          type,
          author_type: 'user',
          author: { id: myId, name: 'You' } as any, 
        },
      ]);
    }
  };

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
            reactions={postReactions}
            onReaction={handleReaction}
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
