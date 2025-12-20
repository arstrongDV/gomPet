'use client';

import React, { useEffect, useState } from 'react';

import { Card, Comment, CommentInput, Divider, List } from 'components';

import { CommentSubmitData } from 'src/components/layout/Comments/CommentInput';

import style from './OrganizationComments.module.scss';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, setComments } from '../slice';
import { RootState } from 'src/lib/store';
import { useSession } from 'next-auth/react';
import { PostsApi } from 'src/api';

type OrganizationCommentsProps = {
  className?: string;
  title?: string;
  organizationId: number;
  onComment?: () => void;
  averageRating?: number;
};

const OrganizationComments = ({
  className,
  title,
  organizationId,
  onComment,
  averageRating
}: OrganizationCommentsProps) => {
  const t = useTranslations();

  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updateId, setUpdateId] = useState<number | null>(null);

  const session = useSession();
  const createComment = async ({ id, text, rating=0 }: CommentSubmitData): Promise<void> => {
    try {
      setIsLoading(true);
      if (updateId) {
        const current = comments.find(c => c.id === updateId);
        if (!current) return;

        if (text !== current.body || rating !== current.rating) {
          const res_update = await PostsApi.updateComment(updateId, { body: text, rating });
          console.log(res_update)
          toast.success("Komentarz zaktualizowany!");
          setUpdateId(null);
          setComments?.((prev: any) =>
            prev.map((c: any) =>
              c.id === updateId ? { ...c, body: text, rating} : c
            )
          );
        }
        else{
          setUpdateId(null);
        }
      } else {
      const res = await PostsApi.addNewComments({
        content_type: "users.organization",
        object_id: organizationId,
        body: text,
        rating
      });
        getComments(organizationId);
        setComments?.((prev: any) => [res, ...prev]);
        toast.success('Komentarz został dodany');
        onComment && onComment();
      }
  
      return Promise.resolve();
    }
    catch (error) {
      console.log(error)
      toast.error('Nie udało się przesłać komentarza');
      return Promise.reject();
    } finally {
      setIsLoading(false);
    }
  };

  const getComments = async (organizationId: number) => {
    try {
      setIsLoading(true);
      const res = await PostsApi.getComments(organizationId, "users.organization")
      setComments(res.results);
    } catch (error) {
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getComments(organizationId);
  }, [organizationId]);

  const deleteComment = (commentId: number) => {
    setComments((prev: any) => prev.filter((comment: any) => comment.id !== commentId));
  };

  const editedComment = updateId ? comments.find(c => c.id === updateId) : null;

  return (
    <Card className={style.comments}>
      <header className={style.header}>
        <h3 className={style.title}>{title || 'Opinie'}</h3>
        {averageRating && <span className={style.averageRating}>średnia ocen: {averageRating} na 5</span>}
      </header>
      {updateId && (
          <div className={style.editBanner}>
            <span>✏️ Edytujesz swój komentarz</span>
            <button onClick={() => setUpdateId(null)}>Anuluj</button>
          </div>
        )}
      <div className={style.container}>
        {/* <CommentInput
          onSubmit={createComment}
          withRating
        /> */}
        <CommentInput 
          onSubmit={createComment} 
          value={editedComment?.body || ''}
          ratingValue={editedComment?.rating ?? 0}
          withRating
        />
        <Divider />
        <List
          className={style.comments}
          emptyText={'Brak komentarzy'}
          isLoading={isLoading}
        >
          {comments?.map((item) => (
            <Comment
              key={item.id}
              comment={item}
              commentDel={deleteComment}
              setUpdateId={setUpdateId} 
            />
          ))}
        </List>
      </div>
    </Card>
  );
};

export default OrganizationComments;
