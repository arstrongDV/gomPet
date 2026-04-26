'use client';
import React, { useState } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Avatar, Button, Modal, SectionHeader } from 'src/components';
import { IPost } from 'src/constants/types';
import { getDaysAgo } from 'src/utils/helpers';
import { Routes } from 'src/constants/routes';
import { usePostActions } from 'src/components/hooks/usePostActions';

import PostReactions from './components/PostReactions';
import PostComments from './components/PostComments';
import ShareComments from './components/ShareComments';
import UpdatePostCard from './components/UpdatePost';
import SettingsButton from 'src/components/layout/Settings';
import FollowingButton from './components/FollowingButton';

import style from './PostCard.module.scss';
import usePostReactions from 'src/components/hooks/usePostReactions';

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
  const { id, text, slug, title, content, created_at, updated_at, image, author } = post;

  const animalId = post.animal;
  const followTargetId = post.organization_info ? post.organization_info.id : animalId;
  const [followedAuthors, setFollowedAuthors] = useState<Record<number, number>>({});

  const {
    myId,
    showComments, setShowComments,
    showCopyLink, setShowCopyLink,
    showUpdateCard, setShowUpdateCard,
    deletePost,
    openUpdatePost,
  } = usePostActions({ post, deletePosts });
  const { reactions } = usePostReactions({type, id});

  const { push } = useRouter();
  const t = useTranslations('posts');

  return (
    <article className={classNames(style.post, className)}>
      {showComments && <div className={style.backdrop} onClick={() => setShowComments(false)} />}
      {showCopyLink && <div className={style.backdrop} onClick={() => setShowCopyLink(false)} />}

      <header className={style.header}>
        <div className={style.author}>
          <div
            className={style.avatarClick}
            onClick={() => {
              if (post.organization_info) {
                push(Routes.ORGANIZATION_PROFILE(post.organization_info.id));
                return;
              }
              if (animalId != null) push(Routes.ANIMAL_PROFILE(animalId));
            }}
          >
            <Avatar
              className={style.avatar}
              profile={author}
              src={post.organization_info?.image ?? undefined}
            />
          </div>
          {post.organization_info ? (
            <h3 className={style.name}>
              {post.organization_info.name}
              <span className={style.subAuthor}>{author.full_name ?? 'Unknown'}</span>
            </h3>
          ) : (
            <h3 className={style.name}>
              {post.animal_name ?? author.full_name ?? 'Unknown'}
              <span className={style.subAuthor}>{author.full_name ?? 'Unknown'}</span>
            </h3>
          )}
        </div>
        <div className={style.headerContent}>
          {myId === author.id ? (
            <SettingsButton
              onEdit={openUpdatePost}
              onDelete={deletePost}
              authId={author.id}
            />
          ) : (
            !hideFollowButton && followTargetId != null && (
              <FollowingButton
                authorId={followTargetId}
                followedAuthors={followedAuthors}
                setFollowedAuthors={setFollowedAuthors}
                target_type={post.organization_info ? 'users.organization' : 'animals.animal'}
              />
            )
          )}
        </div>
      </header>

      <div className={style.text}>
        {slug && title && <SectionHeader title={slug} subtitle={title} margin />}
        <div className={style.postContent}>
          {typeof content === 'string' ? content : typeof text === 'string' ? text : ''}
          {image && <img className={style.image} src={image} alt={text} width={300} height={400} />}
        </div>
      </div>

      <footer className={style.footer}>
        {created_at && updated_at ? (
          getDaysAgo(created_at, true).toLowerCase() === getDaysAgo(updated_at, true).toLowerCase() ? (
            <span className={style.time}>
              {t('published')} <time>{getDaysAgo(created_at, true).toLowerCase()}</time>
            </span>
          ) : (
            <span className={style.time}>
              {t('edited')} <time>{getDaysAgo(updated_at, true).toLowerCase()}</time>
            </span>
          )
        ) : <div>----</div>}
        <div className={style.buttons}>
          <PostReactions postId={id} reactionsCount={reactions} type={type} />
          <Button icon="message" gray onClick={() => setShowComments(prev => !prev)} />
          <Button icon="share" gray onClick={() => setShowCopyLink(prev => !prev)} />
        </div>
      </footer>

      <Modal
        className={style.modaPostUpdatelWin}
        isOpen={showUpdateCard}
        closeModal={() => setShowUpdateCard(false)}
        title={t('editPost')}
      >
        <UpdatePostCard SetShowUpdateCard={setShowUpdateCard} post={post} updatePosts={updatePosts} />
      </Modal>

      <Modal
        className={style.modaSharinglWin}
        isOpen={showCopyLink}
        closeModal={() => setShowCopyLink(false)}
        title={t('shareLabel')}
      >
        <ShareComments commentId={id} />
      </Modal>

      <Modal
        className={style.modaCommentslWin}
        isOpen={showComments}
        closeModal={() => setShowComments(false)}
        title={t('Comments.commentsLabel')}
      >
        <PostComments postId={id} type={type} />
      </Modal>
    </article>
  );
};

export default PostCard;
