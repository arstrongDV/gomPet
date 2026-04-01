'use client';

import React, { Ref, useState } from 'react';
import classNames from 'classnames';
import { Avatar } from 'components';
import { getDaysAgo } from 'src/utils/helpers';

import LabelLink from '../../LabelLink';
import StarRating from '../../StarRating';

import style from './Comment.module.scss';
import { PostsApi } from 'src/api';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import SettingsButton from '../../Settings';

type CommentProps = {
  className?: string;
  comment: any;
  noEditAllowed?: boolean;

  commentDel?: (id: any) => void;
  setUpdateId?: (id: number | null) => void;
  inputFieldRef?: any;
};

const TEXT_LIMIT = 300;
const Comment = ({ className, comment, noEditAllowed, commentDel, setUpdateId, inputFieldRef }: CommentProps) => {
  const { id, body, created_at, author, rating } = comment;   //text
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDisable, setIsDisable]= useState<boolean>(false);

  console.log("commentcomment: ", comment)
  const date = getDaysAgo(created_at, true);
  const [showMore, setShowMore] = useState(false);

  const session = useSession();
  const myId = Number(session.data?.user.id);

  const deleteComment = async() => {
    if(myId === author.id){
      try{
        const res_delete = await PostsApi.deleteComment(comment.id)
        if(commentDel) commentDel(comment.id);
        setIsOpen(false);
        toast.success("Commentarz zostal usuńięty");
        console.log(res_delete)
      }catch(err){
        console.log(err)
      }
    }
  }

  return (
    <div className={classNames(style.comment, className)}>
      <Avatar
        className={style.image}
        profile={comment.author}
        src={comment.author?.image ? comment.author.image : undefined}
      />

      <div className={style.header}>
        <div className={style.info}>
          <span className={style.name}>{author?.first_name || '-'}</span> 
          <span className={style.date}>{date}</span>
        </div>
        {rating && (
          <StarRating
            rating={rating}
            readonly
          />
        )}
      </div>

      <div className={style.content}>
        <div className={style.text}>
          {showMore ? body : body?.substring(0, TEXT_LIMIT)}
          {!showMore && body?.length > TEXT_LIMIT && '...'}
          
          {!noEditAllowed && (
            <SettingsButton 
              onEdit={() => {
                setUpdateId?.(comment.id);
                setIsOpen(false);
                if (inputFieldRef?.current) {
                  inputFieldRef.current.scrollIntoView({
                    behavior: 'smooth',
                  });
                }
              }}
              onDelete={deleteComment}
              authId={author.id}
              isDisabled={isDisable}
              align="right"
            />
          )}

        </div>

        {body?.length > TEXT_LIMIT && (
          <LabelLink
            className={style.showToggle}
            onClick={() => setShowMore((prev) => !prev)}
            label={showMore ? 'Pokaż mniej' : 'Pokaż więcej'}
          />
        )}
      </div>
    </div>
  );
};

export default Comment;
