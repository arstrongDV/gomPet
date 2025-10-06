'use client';

import React, { useState } from 'react';

import { Card, Comment, CommentInput, Divider, List } from 'components';
import { CommentSubmitData } from 'src/components/layout/Comments/CommentInput';
import { IComment } from 'src/constants/types';
import style from './PostComments.module.scss';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { PostsApi } from 'src/api';

type PostCommentsProps = {
  postId: number;
  comments: IComment[];
  className?: string;

  setComments?: () => void; ////////
};

const PostComments = ({ postId, className, comments, setComments }: PostCommentsProps) => {
  const dispatch = useDispatch();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const myId = session.data?.user?.id;

  // const comments = useSelector((state: RootState) => {
  //   const post = state.posts.posts.find((p) => p.id === postId);
  //   return post?.comments || [];
  // });

  // const [isOpen, setIsOpen] = useState<boolean>(false);
  // const handleNotificationClick = () => {
  //   setIsOpen((prev) => !prev);
  // };
  console.log("postId:::", postId)
  const handleSubmit = async ({ text, rating }: CommentSubmitData): Promise<void> => {

    const isLoggedInUser = session.status === 'authenticated' && !!myId;
    if (!isLoggedInUser) {
      toast.error('Musisz być zalogowany, aby napisac comentarz.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await PostsApi.addNewComments({
        content_type: "articles.article",
        object_id: postId,
        body: text
      });
      setComments(prev => [res, ...prev]); /////////
      console.log("res:::", res);
      toast.success('Komentarz został dodany');
      return Promise.resolve();
    } catch (error) {
      toast.error('Nie udało się dodać komentarza');
      console.log("error: ", error)
      return Promise.reject();
    } finally {
      setIsLoading(false);
    }

    // try {
    //   setIsLoading(true);
    //   const newComment: IComment = {
    //     id: Date.now(),
    //     text,
    //     created_at: new Date().toISOString(),
    //     updated_at: new Date().toISOString(),
    //     author: session.status === 'authenticated'
    //       ? {
    //           id: session.data?.user.id,
    //           first_name: session.data?.user.first_name,
    //           email: session.data?.user.email,
    //           image: session.data?.user.image
    //         }
    //       : {
    //           id: 1,
    //           first_name: 'Anonim',
    //           image: null
    //         }
    //   };

    //   dispatch(addComment({ postId, comment: newComment }));
    //   toast.success('Komentarz został dodany');
    //   return Promise.resolve();
    // } catch (error) {
    //   toast.error('Nie udało się dodać komentarza');
    //   return Promise.reject();
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    // <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
      <Card className={`${style.container} ${className || ''}`}>
        <CommentInput onSubmit={handleSubmit} />
        <div className={style.dividerWrapper}>
          <Divider />
        </div>

        <List
          className={style.comments}
          isLoading={isLoading}
          emptyText="Brak komentarzy"
        >
          {comments.map((comment: any) => (
           <Comment key={comment.id} comment={comment} /> 
          ))}
        </List>
      </Card>
    // </OutsideClickHandler>
  );
};


export default PostComments;
