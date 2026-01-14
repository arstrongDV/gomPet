'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { Icon, useOrganization } from 'src/components';
import style from './PostReactions.module.scss';
import { ArticlesApi } from 'src/api';
import toast from 'react-hot-toast';

type PostReactionsProps = {
  postId: number;
  reactionsCount: number;
};

const PostReactions = ({ postId, reactionsCount }: PostReactionsProps) => {
  const session = useSession();
  const { isOrgAuth, ...organization } = useOrganization();

  const [reactionId, setReactionId] = useState<number>(0); // 0 = brak reakcji
  const [likeCount, setLikeCount] = useState<number>();

  const myId = session.data?.user?.id;

  useEffect(() => {
    setLikeCount(reactionsCount);
  }, [reactionsCount])

  // ✅ sprawdzamy czy user polubił post
  useEffect(() => {
    const checkReaction = async () => {
      try {
        const res = await ArticlesApi.verifyReactions("articles.article", postId);
        setReactionId(res?.data?.reaction_id ?? 0);
        console.log("verifyReactions res:", res);
      } catch (err) {
        console.error("Błąd przy sprawdzaniu reakcji:", err);
      }
    };

    if (session.status === "authenticated") {
      checkReaction();
    }
  }, [postId, session.status]);

  // ✅ obsługa polubienia
  const handleReaction = async () => {
    const isLoggedInUser = session.status === 'authenticated' && !!myId;
    if (!isLoggedInUser) {
      toast.error('Musisz być zalogowany, aby polubić post.');
      return;
    }

    if (reactionId === 0) {
      // ➕ dodanie reakcji
      try {
        const res = await ArticlesApi.AddNewReaction({
          reaction_type: "LIKE",
          reactable_type: "articles.article", // upewnij się że backend oczekuje stringa a nie 26
          reactable_id: postId,
        });

        if (res?.status === 201) {
          setReactionId(res.data.id);
          setLikeCount(prev => prev + 1);
        }

        console.log("Add reaction res:", res);
      } catch (err) {
        console.error("Błąd przy dodawaniu reakcji:", err);
      }
    } else {
      // ➖ usunięcie reakcji
      try {
        const res = await ArticlesApi.deleteReaction(reactionId);

        if (res?.status === 200 || res?.status === 204) {
          setReactionId(0);
          setLikeCount(prev => Math.max(prev - 1, 0));
        }

        console.log("Delete reaction res:", res);
      } catch (err) {
        console.error("Błąd przy usuwaniu reakcji:", err);
      }
    }
  };

  return (
    <button className={style.button} onClick={handleReaction}>
      <Icon
        className={style.icon}
        name={reactionId !== 0 ? 'pawFilled' : 'paw'}
      />
      <span className={style.label}>
        {likeCount > 0 ? likeCount : 'brak'}
      </span>
    </button>
  );
};

export default PostReactions;
