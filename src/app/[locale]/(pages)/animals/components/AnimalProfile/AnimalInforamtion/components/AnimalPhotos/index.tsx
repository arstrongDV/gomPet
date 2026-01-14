'use client'

import { useState } from 'react'
import { IAnimal } from 'src/constants/types';
import style from './AnimalPhotos.module.scss';
import ImageShow from 'src/components/layout/ImageShow';

type AnimalProfileProps = {
  animal: IAnimal;
}

const AnimalPhotos = ({ animal }: AnimalProfileProps) => {
  const images = (animal.gallery || []).map((item: any) => item.image);
  const [currentIndex, setCurrentIndex] = useState(0); // domyślnie 0
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (!images.length) return <p>No images available</p>;

  return (
    <div className={style.photos}>
      {/* Główne zdjęcie */}
      <div className={style.mainImage}>
        <img
          src={images[currentIndex]}
          alt={`${animal.name} photo`}
          onClick={() => setIsOpen(true)}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Miniaturki */}
      {images.length > 1 && (
        <div className={style.imagesList}>
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${animal.name} photo ${i}`}
              className={style.thumbnail}
              onClick={() => setCurrentIndex(i)}
              onError={(e) => {
                console.error('Failed to load thumbnail:', img);
                e.currentTarget.style.display = 'none';
              }}
            />
          ))}
        </div>
      )}

      {/* Modal ze sliderem */}
      <ImageShow
        images={animal.gallery || []}
        currentPhoto={currentIndex}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}

export default AnimalPhotos;
