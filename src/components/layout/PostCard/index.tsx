'use client';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Avatar, Button, SectionHeader, useWebsocket } from 'src/components';
import { IComment, IPost } from 'src/constants/types';
import { getDaysAgo } from 'src/utils/helpers';

import PostReactions from './components/PostReactions';
import PostComments from './components/PostComments';
import ShareComments from './components/ShareComments';
import { useSession } from 'next-auth/react';
import style from './PostCard.module.scss';

import { PostsApi } from 'src/api';
import { WebsocketRoutes } from 'src/api/routes';
import UpdatePostCard from './components/UpdatePost';
import SettingsButton from 'src/components/layout/Settings';

type PostCardProps = {
  className?: string;
  post: IPost;
  updatePosts?: (value: any) => void ; //// 
  deletePosts?: (id: number) => void
};

const PostCard = ({ post, className, updatePosts, deletePosts }: PostCardProps) => {
  const { 
    id, 
    text, 
    slug, 
    title, 
    content, 
    created_at, 
    updated_at,
    image, 
    author, 
  } = post;  

  console.log("post:::", post)
  const [showComments, setShowComments] = useState<boolean>(false);
  const [showCopyLink, setShowCopyLink] = useState<boolean>(false);
  const [comments, setComments] = useState<IComment[]>([]);
  const [reactions, setReactions] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showUpdateCard, SetShowUpdateCard] = useState<boolean>(false);

  const session = useSession();
  const myId = Number(session.data?.user.id);

  useEffect(() => {
    document.body.style.overflow = showCopyLink ? 'hidden' : '';
  }, [showCopyLink]);
  useEffect(() => {
    document.body.style.overflow = showComments ? 'hidden' : '';
  }, [showComments]);

  const deletePost = async() => {
    if(myId === post.author.id){
      try{
        const delete_res = await PostsApi.deletePost(id);
        if(deletePosts) deletePosts(id);
        console.log("delete_res:: ", delete_res)
        setIsOpen(false)
      }catch(err){
        console.log(err)
      }
    }
  }

  const updatePost = async() => {
    if(myId === post.author.id){
      SetShowUpdateCard(true)
      setIsOpen(false)
    }
  }

  const [ready, val, send] = useWebsocket(WebsocketRoutes.GET_REACTIONS_LIST("posts.post", id))
  const fetchComments = async () => {
    try {
      const res_comments = await PostsApi.getComments(id, "posts.post");
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
        <div className={style.headerContent}>

        {myId == author.id ? (
          <SettingsButton 
            onEdit={updatePost} 
            onDelete={deletePost}
            authId={author.id}
          />
          ) : (
            <Button icon="starFilled" label={'Obserwujesz'} gray />
        )}
        </div>
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
        {created_at && updated_at ? (
          getDaysAgo(created_at, true).toLowerCase() == getDaysAgo(updated_at, true).toLowerCase() ? (
            <span className={style.time}>
              Opublikowane <time>{getDaysAgo(created_at, true).toLowerCase()}</time>
            </span>
          ) : (
            <span className={style.time}>
              Aktualizowane <time>{getDaysAgo(updated_at, true).toLowerCase()}</time>
            </span>
          )
        ) : <div>----</div>}
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
      {showUpdateCard && <UpdatePostCard SetShowUpdateCard={SetShowUpdateCard} post={post} updatePosts={updatePosts} />}
      {showCopyLink && <ShareComments commentId={id} />}
      {showComments && <PostComments postId={id} comments={comments} setComments={setComments}  />} 
    </article>
  );
};
//slug={slug} 
export default PostCard;
