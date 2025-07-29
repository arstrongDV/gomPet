'use client'

import { useState } from 'react'
import { IAnimal } from 'src/constants/types';
import style from './AnimalPhotos.module.scss';

type AnimalProfileProps = {
  animal: IAnimal & {
    images?: string[]; // Make images optional
  }
}

const AnimalPhotos = ({ animal }: AnimalProfileProps) => {
  const [mainPhoto, setMainPhoto] = useState(animal.image || '');
  const images = animal.images || []; // Provide fallback empty array

  return (
    <div className={style.photos}>
      <div className={style.mainImage}>
        {mainPhoto ? (
          <img src={mainPhoto} alt={`${animal.name} photo`} />
        ) : (
          <p>No image available</p>
        )}
      </div>
      
      {/* Only render if there are images */}
      {images.length > 0 && (
        <div className={style.imagesList}>
          {images.map((image, i) => (
            <img 
              key={i} 
              src={image} 
              alt={`${animal.name} photo ${i}`} 
              className={style.thumbnail}
              onClick={() => setMainPhoto(image)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default AnimalPhotos;