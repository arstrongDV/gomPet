'use client';

import React, { useMemo } from 'react';
import { useSession } from 'next-auth/react';

import { Icon, useOrganization } from 'src/components';
import { IOrganization, IUser } from 'src/constants/types';

import style from './PostReactions.module.scss';

type PostReactionsProps = {
  postId: number;
  reactions: {
    author: IUser | IOrganization;
    author_type: 'user' | 'organization';
    type: 'like' | 'dislike';
  }[];
  onReaction?: (type: 'like' | 'dislike' | null) => void;
};

const PostReactions = ({ postId, reactions, onReaction }: PostReactionsProps) => {
  const { isOrgAuth, ...organization } = useOrganization();
  const session = useSession();

  const isLikedByMe = useMemo(() => {
    if (session.status === 'unauthenticated') return false;

    let reaction;
    if (isOrgAuth) {
      reaction = reactions.find(
        (reaction) => reaction.author.id === organization.id && reaction.author_type === 'organization'
      );
    } else if (session.status === 'authenticated') {
      reaction = reactions.find(
        (reaction) => reaction.author.id === session.data?.user.id && reaction.author_type === 'user'
      );
    }

    return reaction?.type === 'like';
  }, [reactions]);

  const handleReaction = () => {
    onReaction?.(null);
  };

  return (
    <button
      className={style.button}
      onClick={handleReaction}
    >
      <Icon
        className={style.icon}
        name={isLikedByMe ? 'pawFilled' : 'paw'}
      />
      <span className={style.label}>{reactions.length > 0 ? reactions.length : 'brak'}</span>
    </button>
  );
};

export default PostReactions;