'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Card, Comment, CommentInput, Divider, List } from 'components';
import { CommentSubmitData } from 'src/components/layout/Comments/CommentInput';
import { PostsApi } from 'src/api';
import toast from 'react-hot-toast';
import style from './PostComments.module.scss';
import { useTranslations } from 'next-intl';

type PostCommentsProps = {
  postId: number;
  type: string;
  slug?: string;
  className?: string;
  setComments?: (e: any) => void;
  isOrganizationPage?: {
    title?: string;
    averageRating?: number;
  }
};

const PostComments = ({ postId, className, type, isOrganizationPage }: PostCommentsProps) => {
  const t = useTranslations('error');

  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateId, setUpdateId] = useState<number | null>(null);

  const currentPageRef = useRef(1);
  const guardRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const isFetchingMoreRef = useRef(false);
  const hasNextPageRef = useRef(true);

  const getComments = async (postId: number, page = 1) => {
    try {
      const res = await PostsApi.getComments(postId, type, { page });
      return res ?? { results: [], next: null };
    } catch (error) {
      console.error(error);
      return { results: [], next: null };
    }
  };

  useEffect(() => {
    currentPageRef.current = 1;
    setComments([]);
    setIsLoading(true);
    hasNextPageRef.current = true;

    const loadInitial = async () => {
      const data = await getComments(postId, 1);
      setComments(data.results ?? []);
      hasNextPageRef.current = !!data.next;
      setIsLoading(false);
    };

    loadInitial();
  }, [postId]);

  const getMoreComments = useCallback(async () => {
    if (isFetchingMoreRef.current || !hasNextPageRef.current) return;

    isFetchingMoreRef.current = true;

    const nextPage = currentPageRef.current + 1;
    const data = await getComments(postId, nextPage);

    if (!data.results.length) {
      hasNextPageRef.current = false;
      isFetchingMoreRef.current = false;
      return;
    }

    currentPageRef.current = nextPage;
    setComments(prev => [...prev, ...data.results]);
    hasNextPageRef.current = !!data.next;
    isFetchingMoreRef.current = false;
  }, [postId]);

  useEffect(() => {
    if (comments.length === 0) return;
    const guardEl = guardRef.current;
    if (!guardEl) return;
  
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) getMoreComments();
    }, { root: listRef.current || null, rootMargin: '200px', threshold: 0 });
  
    observer.observe(guardEl);
    return () => observer.disconnect();
  }, [comments, getMoreComments]);

  const createComment = async ({ id, text, rating = 0 }: CommentSubmitData) => {
    setIsLoading(true);
    try {
      if (updateId) {
        const current = comments.find(c => c.id === updateId);
        if (!current) return;

        if(isOrganizationPage){
          if (text !== current.body || rating !== current.rating) {
            await PostsApi.updateComment(updateId, { 
              body: text, 
              rating: rating !== 0 ? rating : undefined
            });
            setComments(prev => prev.map(c => (c.id === updateId ? { ...c, body: text, rating } : c)));
          }
        }else{
          if (updateId) {
            if(text !== current.body){
              await PostsApi.updateComment(updateId, { body: text });
              toast.success("Komentarz zaktualizowany!");
              setUpdateId(null);
              setComments?.((prev: any) =>
                prev.map((c: any) =>
                  c.id === updateId ? { ...c, body: text } : c
                )
              );
            }
            else{
              setUpdateId(null);
            }
        }
        setUpdateId(null);

        }
      } else {
        const payload: any = {
          content_type: type,
          object_id: postId,
          body: text
        };
        
        if (isOrganizationPage) {
          payload.rating = rating || null;
        }
        
        const res = await PostsApi.addNewComments(payload);
        setComments(prev => [res, ...prev]);
        toast.success('Komentarz zostal dodany');
      }
    } catch (err: any) {
      if(err.response.data.error)(
        toast.error(t(`comments.${err.response.data.error.code}`))
      )
      else{
        toast.error(t("mainErrors.unexpectedError"));
      }
      console.error(err.response.data.error.code);
    } finally {
      setIsLoading(false);
      setUpdateId(null);
    }
  };

  const deleteComment = (commentId: number) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const editedComment = updateId ? comments.find(c => c.id === updateId) : null;

  return (
    <Card className={`${isOrganizationPage ? style.commentsContainer : style.container } ${className || ''}`}>
      {isOrganizationPage && (
        <header className={style.header}>
          <h3 className={style.title}>{isOrganizationPage.title || 'Opinie'}</h3>
          {isOrganizationPage.averageRating && 
            <span className={style.averageRating}>średnia ocen: {isOrganizationPage.averageRating} na 5</span>
          }
        </header>
      )}

      {updateId && (
        <div className={style.editBanner}>
          <span>✏️ Edytujesz swój komentarz</span>
          <button onClick={() => setUpdateId(null)}>Anuluj</button>
        </div>
      )}

        <CommentInput 
          onSubmit={createComment} 
          value={editedComment?.body || ''} 
          {...(isOrganizationPage && { ratingValue: editedComment?.rating ?? 0 })}
          withRating={!!isOrganizationPage}
        />

        <Divider />

        <List 
          ref={listRef}
          className={style.comments}
          emptyText="Brak komentarzy"
          isLoading={isLoading}
          isEmpty={!isLoading && comments.length === 0}
        >
          {comments.length === 0 ? null : comments.map(comment => (
            <Comment 
              key={comment.id}
              comment={comment}
              commentDel={deleteComment}
              setUpdateId={setUpdateId}
              {...(isOrganizationPage ? { inputFieldRef: null } : {})}
            />
          ))}

          {comments.length > 0 && (
            <div ref={guardRef} style={{ height: '1px' }} />
          )}
        </List>
    </Card>
  );
};

export default PostComments;