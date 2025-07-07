import React from 'react'
import style from './Comments.module.scss';
import Image from 'next/image';
import { IAnimal, IComment } from 'src/constants/types';
import { StarRating } from 'src/components';
import dayjs from 'dayjs';
import { Comment } from 'components';
import AVATAR from '../../../../../../../../../assets/gompet.png'

type AnimalProfileProps = {
    animal: IAnimal & {
      comments: IComment[]; 
    }
}

const Comments = ({ animal }: AnimalProfileProps) => {
    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('DD.MM.YYYY, godz. HH:mm');
      };
  return (
    <div className={style.opinion}>
        <div className={style.opinionTitle}>
            <h3>Opinie o fundacji</h3>
            <p>średnia ocen: 4.3 na 5</p>
        </div>
        {animal.comments.map((com, i) => (
            <div key={i} className={style.comments}>
                <div className={style.userComInfo}>
                    <Image 
                        className={style.avatar} 
                        src={com.author.image === null ? AVATAR : com.author.image} 
                        alt='user-icon' 
                        width={24}
                        height={24} 
                    />
                    <div className={style.comContainer}>
                        <div className={style.commentWrraper}>
                            <div className={style.userNameData}>
                                <h4>{com.author.first_name}</h4>
                                <p>{formatDate(com.created_at)}</p>
                            </div>
                            <div className={style.recomendation}>
                                <StarRating
                                    rating={com.rating}
                                    readonly
                                />
                            </div>
                        </div>
                        <div className={style.userComment}>
                                <p>{com.comment}</p>
                        </div>
                    </div>
                </div>
            </div>
            // <Comment key={item.id} comment={item} />
        ))}
    </div>
  )
}

export default Comments;