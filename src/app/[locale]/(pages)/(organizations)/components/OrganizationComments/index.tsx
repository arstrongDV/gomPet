'use client';

import React, { useEffect, useState } from 'react';

import { Card, Comment, CommentInput, Divider, List } from 'components';

import { CommentSubmitData } from 'src/components/layout/Comments/CommentInput';

import style from './OrganizationComments.module.scss';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

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

  const createComment = async ({ id, text, rating }: CommentSubmitData): Promise<void> => {
    try {
      setIsLoading(true);
      if (id) {
      } else {
      }

      getComments();
      onComment && onComment();
      return Promise.resolve();
    } catch (error) {
      toast.error('Nie udało się przesłać komentarza');
      return Promise.reject();
    } finally {
      setIsLoading(false);
    }
  };

  const getComments = async () => {
    try {
      setIsLoading(true);
    } catch (error) {
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getComments();
  }, [organizationId]);

  return (
    <Card className={style.comments}>
      <header className={style.header}>
        <h3 className={style.title}>{title || 'Opinie'}</h3>
        {averageRating && <span className={style.averageRating}>średnia ocen: 4.3 na 5</span>}
      </header>
      <div className={style.container}>
        <CommentInput
          onSubmit={createComment}
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
            />
          ))}
        </List>
      </div>
    </Card>
  );
};

export default OrganizationComments;
