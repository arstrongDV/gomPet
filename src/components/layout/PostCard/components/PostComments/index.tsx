'use client';

import React, { useEffect, useState } from 'react';

import { Card, Comment, CommentInput, Divider, List } from 'components';
import { CommentSubmitData } from 'src/components/layout/Comments/CommentInput';
import { IComment } from 'src/constants/types';
import style from './PostComments.module.scss';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { PostsApi } from 'src/api';

type PostCommentsProps = {
  postId: number;
  comments: IComment[];
  className?: string;
  setComments?: (e: any) => void;
};

const PostComments = ({ postId, className, comments, setComments }: PostCommentsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [updateId, setUpdateId] = useState<number | null>(null);
  
  const handleSubmit = async ({ text, rating }: CommentSubmitData): Promise<void> => {
    try {
      setIsLoading(true);
      if (updateId) {
        if(text !== comments.find((coment: any) => updateId === coment.id)?.body){
          const res_update = await PostsApi.updateComment(updateId, { body: text });
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
      } else {
        const res = await PostsApi.addNewComments({
          content_type: "posts.post",
          object_id: postId,
          body: text
        });
        setComments?.((prev: any) => [res, ...prev]);
        toast.success('Komentarz został dodany');
      }
  
      return Promise.resolve();
    } catch (error) {
      toast.error('Nie udało się dodać komentarza');
      return Promise.reject();
    } finally {
      setIsLoading(false);
    }
  };

  const deleteComment = (commentId: number) => {
    setComments && setComments((prev: any) => prev.filter((comment: IComment) => comment.id !== commentId));
  };

  return (
      <Card className={`${style.container} ${className || ''}`}>
        {updateId && (
          <div className={style.editBanner}>
            <span>✏️ Edytujesz swój komentarz</span>
            <button onClick={() => setUpdateId(null)}>Anuluj</button>
          </div>
        )}
        <CommentInput 
            onSubmit={handleSubmit} 
            value={updateId ? comments.find(c => c.id === updateId)?.body || '' : ''}
          />
        <div className={style.dividerWrapper}>
          <Divider />
        </div>

        <List
          className={style.comments}
          isLoading={isLoading}
          emptyText="Brak komentarzy"
        >
          {comments.map((comment: any) => (
            <Comment 
              key={comment.id} 
              comment={comment} 
              commentDel={deleteComment} 
              setUpdateId={setUpdateId} 
            />
          ))}
        </List>
      </Card>
  );
};


export default PostComments;
