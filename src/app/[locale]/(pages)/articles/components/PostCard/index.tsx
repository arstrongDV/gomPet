'use client';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Avatar, Button, SectionHeader, useWebsocket } from 'src/components';
import { IPost } from 'src/constants/types';
import { getDaysAgo } from 'src/utils/helpers';

import PostReactions from './components/PostReactions';
import PostComments from './components/PostComments';
import { useSession } from 'next-auth/react';
import style from './PostCard.module.scss';
import ShareComments from './components/ShareComments';
import { ArticlesApi, PostsApi } from 'src/api';
import { WebsocketRoutes } from 'src/api/routes';

type PostCardProps = {
  className?: string;
  post: IPost;
};

const PostCard = ({ post, className }: PostCardProps) => {
  const { 
    id, 
    text, 
    slug, 
    title, 
    content, 
    created_at, 
    image, 
    author, 
  } = post;  //comments

  console.log("post:::", post)
  const [showComments, setShowComments] = useState<boolean>(false);
  const [showCopyLink, setShowCopyLink] = useState<boolean>(false);

  const [comments, setComments] = useState<File[]>([]);
  const [reactions, setReactions] = useState<number>(0);

  console.log(post)
  useEffect(() => {
    document.body.style.overflow = showCopyLink ? 'hidden' : '';
  }, [showCopyLink]);
  useEffect(() => {
    document.body.style.overflow = showComments ? 'hidden' : '';
  }, [showComments]);

  const [ready, val, send] = useWebsocket(WebsocketRoutes.GET_REACTIONS_LIST("articles.article", id))
  const fetchComments = async () => {
    try {
      const res_comments = await PostsApi.getComments(id, "articles.article");
      console.log("res::", res_comments)
      setComments(res_comments.results);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    if (val) {
      try {
        let parsedData;
        
        if (typeof val === 'string') {
          try {
            parsedData = JSON.parse(val);
          } catch (e) {
            parsedData = val;
          }
        } else {
          parsedData = val;
        }

        if (parsedData?.total_likes !== undefined) {
          setReactions(parsedData.total_likes);
        }
        
      } catch (error) {
        console.error("WS parse error:", error);
      }
    }
  }, [val]);

useEffect(() => {
  if (ready && send) {
    
    const subscriptionMessage = {
      action: 'subscribe_instance',
      pk: id,
      request_id: Date.now()
    };
    
    send(JSON.stringify(subscriptionMessage));
  }
}, [ready, send, id]); 

  // useEffect(() => {
  //   console.log("=== WebSocket Debug ===");
  //   console.log("Ready:", ready);
  //   console.log("Value:", val);
  //   console.log("Value type:", typeof val);
  //   console.log("=======================");
  // }, [ready, val]);


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
          <h3 className={style.name}>{author.full_name}</h3>
        </div>

        <Button icon="starFilled" label={'Obserwujesz'} gray />
      </header>

      <p className={style.text}>

      {slug && title && (
        <SectionHeader
          title={slug}
          subtitle={title}
          margin
        />
      )}

        <div className={style.postContent}>
          {content || text}

          {image && (
            <img className={style.image} src={image} alt={text} width={300} height={400} />
          )}
        </div>
      </p>

      <footer className={style.footer}>
        <span className={style.time}>
          Opublikowane <time>{getDaysAgo(created_at, true).toLowerCase()}</time>
        </span>
        <div className={style.buttons}>
          <PostReactions
            postId={id}
            reactionsCount={reactions}
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
      {showComments && <PostComments slug={slug}  postId={id} comments={comments} setComments={setComments} />}
    </article>
  );
};

export default PostCard;
