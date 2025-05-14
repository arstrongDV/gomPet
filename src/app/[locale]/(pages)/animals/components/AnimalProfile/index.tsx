'use client'
import React, { useState } from 'react'
import AnimalInformation from './AnimalInforamtion'
import { IAnimal } from 'src/constants/types';
import style from './AnimalProfile.module.scss'
import AnimalActivity from './AnimalActivity';


type AnimalCardProps = {
    animal: IAnimal;
};

const AnimalProfile = ({ animal }: AnimalCardProps) => {
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
          <AnimalActivity />
        )}
    </div>
  )
}

export default AnimalProfile;
