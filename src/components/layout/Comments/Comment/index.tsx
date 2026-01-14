'use client';

import React, { useState } from 'react';
import classNames from 'classnames';

import { Avatar, Icon } from 'components';

import { getDaysAgo } from 'src/utils/helpers';

import LabelLink from '../../LabelLink';
import StarRating from '../../StarRating';

import style from './Comment.module.scss';
import { PostsApi } from 'src/api';
import { useSession } from 'next-auth/react';
import OutsideClickHandler from 'react-outside-click-handler';
import toast from 'react-hot-toast';
import Settings from '../../Settings';
import SettingsButton from '../../Settings';

type CommentProps = {
  className?: string;
  comment: any;

  commentDel?: (id: any) => void;
  setUpdateId?: (id: number | null) => void;
};

const TEXT_LIMIT = 300;

const Comment = ({ className, comment, commentDel, setUpdateId }: CommentProps) => {
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
        <p className={style.text}>
          {showMore ? body : body?.substring(0, TEXT_LIMIT)}
          {!showMore && body?.length > TEXT_LIMIT && '...'}
          

          <SettingsButton 
            onEdit={() => {
              setUpdateId?.(comment.id);
              setIsOpen(false);
              // setIsDisable(true);
            }}
            onDelete={deleteComment}
            authId={author.id}
            isDisabled={isDisable}
            align="right"
          />
          {/* {myId === author.id && (
            <div className={style.settingsWrapper}>
              <div
                className={style.settingsToggle}
                onClick={() => setIsOpen(prev => !prev)}
                >
                <Icon name="list" />
              </div>

              {isOpen && (
                <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
                  <Settings
                    onEdit={() => {
                      setUpdateId?.(comment.id);
                      setIsOpen(false);
                    }}
                    onDelete={deleteComment}
                  />
                </OutsideClickHandler>
              )}
            </div>
          )} */}

        </p>

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
