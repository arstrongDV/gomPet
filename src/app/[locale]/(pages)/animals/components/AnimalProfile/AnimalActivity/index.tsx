'use client'
import React from 'react'
import { IPost } from 'src/constants/types';
import Image from 'next/image';

import style from './AnimalProfile.module.scss'
import AVATAR from '../images/avatar.png'
import STAR from '../images/star.png'
import NO_COLORED_PAW from '../images/nowcoloredpaw.png'
import SHARE from '../images/share.png'
import MASSAGE from '../images/message.png'


type PostsProfileProps = {
  posts: IPost[];
};

const AnimalActivity = ({posts}: PostsProfileProps) => {
  debugger
  return (
    <div className={style.mainPostContainer}>
      {posts.map(p => (
        <div className={style.commentWrapper} key={p.id}>
          <div className={style.userInfo}>
            <div className={style.aboutUser}>
              <div className={style.avatar}>
                <Image src={AVATAR} alt='user-icon' width={30} height={30} />
              </div>
              <p>RatujemyZwierzaki</p>
            </div>
            <div className={style.observing}>
              <Image src={STAR} alt='star-icon' width={24} height={24} />
              <p>Obserwujesz</p>
            </div>
          </div>
          <div className={style.comment}>
            {p.text}
            {p.image ? <img src={p.image} alt='selected-image' /> : <div></div>}
          </div>
          <div className={style.bottom}>
            <p>Opublikowane {p.created_at}</p>
            <div className={style.icons}>
              <div className={style.comunicateBlock}>
                <Image src={NO_COLORED_PAW} alt='paw-icon' width={24} height={24} />
              </div>
              <div className={style.comunicateBlock}>
                <Image src={MASSAGE} alt='massage-icon' width={24} height={24} />
              </div>
              <div className={style.comunicateBlock}>
                <Image src={SHARE} alt='share-icon' width={24} height={24} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnimalActivity
