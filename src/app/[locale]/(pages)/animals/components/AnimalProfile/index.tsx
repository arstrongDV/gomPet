'use client'
import React, { useState } from 'react'
import AnimalInformation from './AnimalInforamtion'
import { IAnimal, IPost } from 'src/constants/types';
import style from './AnimalProfile.module.scss'
import AnimalActivity from './AnimalActivity';


type AnimalCardProps = {
    animal: IAnimal;
    posts: IPost[]; 
};

const AnimalProfile = ({ animal, posts }: AnimalCardProps) => {
  const [isInfoPageActive, setActivePage] = useState(true);
  return (
    <div>
      <div className={style.head}>
        <div className={style.name}>
            <p className={style.hello}>Hej!</p>
            <p>Nazywam się <span>{animal.name}</span></p>
        </div>
        <div className={style.tags}>
    <p 
        onClick={() => setActivePage(true)} 
        className={isInfoPageActive ? style.active : ""}
    >
        Informacje
    </p>
    <p 
        onClick={() => setActivePage(false)} 
        className={!isInfoPageActive ? style.active : ""}
    >
        Aktywność
    </p>
    <div className={`${style.underline} ${isInfoPageActive ? style.left : style.right}`} />
</div>

    </div>
    {isInfoPageActive ? (
      <AnimalInformation animal={animal} />
    ):(
      <AnimalActivity posts={posts} />
    )}
    </div>
  )
}

export default AnimalProfile;
