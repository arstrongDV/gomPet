'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

import { PostsApi } from 'src/api';
import { IPost } from 'src/constants/types';

type UsePostActionsProps = {
  post: IPost;
  deletePosts?: (id: number) => void;
};

export const usePostActions = ({ post, deletePosts }: UsePostActionsProps) => {
  const [showComments, setShowComments] = useState(false);
  const [showCopyLink, setShowCopyLink] = useState(false);
  const [showUpdateCard, setShowUpdateCard] = useState(false);

  const session = useSession();
  const myId = Number(session.data?.user.id);
  const t = useTranslations('posts');

  const deletePost = async () => {
    if (myId !== post.author.id) return;
    try {
      await PostsApi.deletePost(post.id);
      deletePosts?.(post.id);
      toast.success(t('deleted'));
    } catch (err) {
      toast.error(t('deleteError'));
    }
  };

  const openUpdatePost = () => {
    if (myId !== post.author.id) return;
    setShowUpdateCard(true);
  };

  return {
    myId,
    showComments,
    setShowComments,
    showCopyLink,
    setShowCopyLink,
    showUpdateCard,
    setShowUpdateCard,
    deletePost,
    openUpdatePost,
  };
};
