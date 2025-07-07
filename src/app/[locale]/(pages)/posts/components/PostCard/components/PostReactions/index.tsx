'use client';

import React, { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';

import { Icon, useOrganization } from 'src/components';
import { RootState } from 'src/lib/store';
import { addReaction } from '../../../../slice';

import style from './PostReactions.module.scss';

type PostReactionsProps = {
  postId: number;
};

const PostReactions = ({ postId }: PostReactionsProps) => {
  const dispatch = useDispatch();
  const session = useSession();
  const { isOrgAuth, ...organization } = useOrganization();

  const myId = session.data?.user?.id;

  const reactions = useSelector((state: RootState) =>
    state.posts.posts.find((post) => post.id === postId)?.reactions || []
  );

  const isLikedByMe = useMemo(() => {
    if (session.status !== 'authenticated') return false;

    return reactions.some((reaction) =>
      isOrgAuth
        ? reaction.author_type === 'organization' && reaction.author.id === organization.id
        : reaction.author_type === 'user' && reaction.author.id === myId
    );
  }, [reactions, session.status, isOrgAuth, organization.id, myId]);

  const handleReaction = () => {
    const isLoggedInUser = session.status === 'authenticated' && !!myId;
    const isLoggedInOrg = isOrgAuth && !!organization.id;
  
    if (!isLoggedInUser && !isLoggedInOrg) {
      // opcjonalnie: pokaż komunikat
      alert('Musisz być zalogowany, aby polubić post.');
      return;
    }
  

    dispatch(
      addReaction({
        postId,
        reaction: {
          type: isLikedByMe ? 'dislike' : 'like',
          author_type: isOrgAuth ? 'organization' : 'user',
          author: isOrgAuth
            ? { id: organization.id, name: organization.name }
            : { id: myId!, name: session.data?.user?.first_name || 'You' },
        },
      })
    );
  };

  return (
    <button className={style.button} onClick={handleReaction}>
      <Icon
        className={style.icon}
        name={isLikedByMe ? 'pawFilled' : 'paw'}
        key={isLikedByMe ? 'pawFilled' : 'paw'}
      />
      <span className={style.label}>
        {reactions.length > 0 ? reactions.length : 'brak'}
      </span>
    </button>
  );
};

export default PostReactions;
