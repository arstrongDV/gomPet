'use client'

import { useState } from 'react'
import { IAnimal } from 'src/constants/types';
import style from './AnimalPhotos.module.scss';

type AnimalProfileProps = {
  animal: IAnimal & {
    images: string[];
  }
}

const AnimalPhotos = ({ animal }: AnimalProfileProps) => {
  const [mainPhoto, setMainPhoto] = useState(animal.image)

  return (
    <div className={style.photos}>
      <div className={style.mainImage}>
          {animal.image ? (
          <img src={`${mainPhoto}`} alt={`${animal.name} photo`} />
          ) : (
          <p>No image available</p>
          )}
      </div>
      <div className={style.imagesList}>
          {animal.images.map((image, i) => (
              <img 
                  key={i} 
                  src={image} 
                  alt={`${animal.name} photo`} 
                  className={style.thumbnail}
                  onClick={() => setMainPhoto(image)}
              />
          ))}
      </div>
    </div>
  )
}

export default AnimalPhotos