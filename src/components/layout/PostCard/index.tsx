'use client';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Avatar, Button, Modal, SectionHeader, useWebsocket } from 'src/components';
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
import FollowingButton from './components/FollowingButton';
import toast from 'react-hot-toast';
import { redirect, useRouter } from 'next/navigation';
import { Routes } from 'src/constants/routes';

type PostCardProps = {
  className?: string;
  post: IPost;
  type: string;
  updatePosts?: (value: any) => void;
  deletePosts?: (id: number) => void;
  hideFollowButton?: boolean;
};

const PostCard = ({ 
    post, 
    className, 
    type, 
    updatePosts, 
    deletePosts,
    hideFollowButton
}: PostCardProps) => {
  const animalId = post.animal;
  const followTargetId = post.organization_info ? post.organization_info.id : animalId;

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

  const [followedAuthors, setFollowedAuthors] = useState<Record<number, number>>({});

  const [reactions, setReactions] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showUpdateCard, SetShowUpdateCard] = useState<boolean>(false);
  const { push } = useRouter();

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
        await PostsApi.deletePost(id);
        if(deletePosts) deletePosts(id);
        toast.success("Post zostal usunienty!");
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

  const [ready, val, send] = useWebsocket(WebsocketRoutes.GET_REACTIONS_LIST(type, id))

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
          <div 
            className={style.avatarClick}
            onClick={() => {
              if (post.organization_info) {
                push(Routes.ORGANIZATION_PROFILE(post.organization_info.id));
                return;
              }

              if (animalId != null) {
                push(Routes.ANIMAL_PROFILE(animalId));
              }
            }}
          >
            <Avatar 
              className={style.avatar} 
              profile={author}
              src={post.organization_info?.image ?? undefined}  
            />
          </div>
          {post.organization_info ? (
            <h3 className={style.name}>{post.organization_info.name} 
              <span className={style.subAuthor}>{author.full_name ?? 'Unknown'}</span>
            </h3>
          ) : (
            <h3 className={style.name}>{post.animal_name ?? author.full_name ?? 'Unknown'} 
              <span className={style.subAuthor}>{author.full_name ?? 'Unknown'}</span>
            </h3>
            // <h3 className={style.name}>{author.full_name}</h3>
          )}
        </div>
        <div className={style.headerContent}>
          {myId == author.id ? (
            <SettingsButton 
              onEdit={updatePost} 
              onDelete={deletePost}
              authId={author.id}
            />
            ) : (
              !hideFollowButton && followTargetId != null && (
                <FollowingButton 
                  authorId={followTargetId} 
                  followedAuthors={followedAuthors}
                  setFollowedAuthors={setFollowedAuthors}
                  target_type={post.organization_info ? "users.organization" : "animals.animal"}
                />
              )
            )}
        </div>
      </header>

      <div className={style.text}>

        {slug && title && (
          <SectionHeader
            title={slug}
            subtitle={title}
            margin
          />
        )}

        <div className={style.postContent}>
          {typeof content === "string"
            ? content
            : typeof text === "string"
            ? text
            : ""}

          {image && (
            <img className={style.image} src={image} alt={text} width={300} height={400} />
          )}
        </div>
      </div>
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
            type={type}
          />
          <Button
            icon="message"
            gray
            onClick={() => setShowComments(prev => !prev)}
          />
          <Button icon="share" gray  onClick={() => setShowCopyLink(prev => !prev)}/>
        </div>
      </footer>

      <Modal 
        className={style.modaPostUpdatelWin} 
        isOpen={showUpdateCard} 
        closeModal={() => SetShowUpdateCard(false)}
        title='Actualizuj Post'
      >
        <UpdatePostCard SetShowUpdateCard={SetShowUpdateCard} post={post} updatePosts={updatePosts} />
      </Modal>

      <Modal 
          className={style.modaSharinglWin} 
          isOpen={showCopyLink} 
          closeModal={() => setShowCopyLink(false)}
          title='Podzieli sie postem'
        >
          <ShareComments commentId={id} />
        </Modal>

      <Modal 
        className={style.modaCommentslWin} 
        isOpen={showComments} 
        closeModal={() => setShowComments(false)}
        title='Komentarzy'
      >
        <PostComments postId={id} type={type} />
      </Modal>
      {/* {showComments && }   */}
    </article>
  );
};
export default PostCard;
