'use client'

import { useState } from 'react'
import { IAnimal } from 'src/constants/types';
import style from './AnimalPhotos.module.scss';

type AnimalProfileProps = {
  animal: IAnimal & {
    gallery?: { id: number; image: string; ordering: number }[];
  }
}

const AnimalPhotos = ({ animal }: AnimalProfileProps) => {
  // НЕ кодуємо URL - вони вже закодовані!
  const images = (animal.gallery || []).map(item => item.image);
  const [mainPhoto, setMainPhoto] = useState(images[0] || '');
  
  console.log("Original images: ", images);

  return (
    <div className={style.photos}>
      <div className={style.mainImage}>
        {mainPhoto ? (
          <img 
            src={mainPhoto} 
            alt={`${animal.name} photo`}
            onError={(e) => {
              console.error('Failed to load main image:', mainPhoto);
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <p>No image available</p>
        )}
      </div>
      
      {images.length > 0 && (
        <div className={style.imagesList}>
          {images.map((img, i) => (
            <img 
              key={i} 
              src={img} 
              alt={`${animal.name} photo ${i}`} 
              className={style.thumbnail}
              onClick={() => setMainPhoto(img)}
              onError={(e) => {
                console.error('Failed to load thumbnail:', img);
                e.currentTarget.style.display = 'none';
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default AnimalPhotos;