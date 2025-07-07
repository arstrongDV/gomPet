'use client';

import React, { useState } from 'react';
import classNames from 'classnames';

import { Avatar } from 'components';

import { getDaysAgo } from 'src/utils/helpers';

import LabelLink from '../../LabelLink';
import StarRating from '../../StarRating';

import style from './Comment.module.scss';

type CommentProps = {
  className?: string;
  comment: any;
};

const TEXT_LIMIT = 300;

const Comment = ({ className, comment }: CommentProps) => {
  const { id, text, created_at, author, rating } = comment;

  const date = getDaysAgo(created_at, true);
  const [showMore, setShowMore] = useState(false);

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
          {showMore ? text : text?.substring(0, TEXT_LIMIT)}
          {!showMore && text?.length > TEXT_LIMIT && '...'}
        </p>

        {text?.length > TEXT_LIMIT && (
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
