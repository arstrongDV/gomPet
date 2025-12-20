'use client'

import React from 'react'
import style from './Comments.module.scss';
import Image from 'next/image';
import { IAnimal, IComment } from 'src/constants/types';
import { Avatar, StarRating } from 'src/components';
import dayjs from 'dayjs';
import { Comment } from 'components';
import AVATAR from '../../../../../../../../../assets/gompet.png'

type AnimalProfileProps = {
    comment: IComment
}

const Comments = ({ comment }: AnimalProfileProps) => {
    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('DD.MM.YYYY, godz. HH:mm');
      };

    const commentsArray = Array.isArray(comment)
    ? comment
    : comment
    ? [comment]
    : [];
      
  return (
    <div className={style.opinion}>
        <div className={style.opinionTitle}>
            <h3>Opinie o fundacji</h3>
            <p>średnia ocen: 4.3 na 5</p>
        </div>
        {commentsArray.length > 0 ? (
            commentsArray.map((com, i) => (
            <div key={i} className={style.comments}>
                <div className={style.userComInfo}>
                    <Avatar profile={comment.author} />
                    <div className={style.comContainer}>
                        <div className={style.commentWrraper}>
                            <div className={style.userNameData}>
                                <h4>{com.author?.first_name ?? "Anonymous"}</h4>
                                <p>{formatDate(com.created_at)}</p>
                            </div>
                            {com.rating && (  
                                <div className={style.recomendation}>
                                    <StarRating rating={comment.rating !== null ? comment.rating : 0} readonly />
                                </div>
                            )}
                        </div>
                        <div className={style.userComment}>
                            <p>{com.body}</p>
                        </div>
                    </div>
                </div>
            </div>
        ))
    ) : (
      <div>No comments available</div>
    )}

    </div>
  )
}

export default Comments;