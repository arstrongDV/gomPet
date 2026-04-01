'use client'

import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';

import { IAnimal } from 'src/constants/types';

import 'yet-another-react-lightbox/styles.css';
import style from './AnimalPhotos.module.scss';

// import ImageShow from 'src/components/layout/ImageShow';

type AnimalProfileProps = {
  animal: IAnimal;
}

const AnimalPhotos = ({ animal }: AnimalProfileProps) => {

  const gallerySlides = (animal.gallery || [])
    .map((item: any) => (typeof item === 'string' ? item : item?.image))
    .filter(Boolean)
    .map((src: string) => ({ src }));

  const slides = gallerySlides.length
    ? gallerySlides
    : (animal.image ? [{ src: animal.image }] : []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!slides.length) return <p>No images available</p>;

  return (
    <div className={style.photos}>

      {/* MAIN IMAGE */}
      <div className={style.mainImage}>
        <img
          src={slides[currentIndex].src}
          alt={`${animal.name} photo`}
          onClick={() => setIsOpen(true)}
        />
      </div>

      {/* THUMBNAILS */}
      {slides.length > 1 && (
        <div className={style.imagesList}>
          {slides.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={`${animal.name} photo ${i}`}
              className={style.thumbnail}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      )}

      {/* LIGHTBOX */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={slides}
        index={currentIndex}
        styles={{
          container: {
            backgroundColor: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(6px)'
          },
          button: {
            color: '#B1D800',
          },
          icon: {
            color: '#B1D800',      
            width: '60px',          
            height: '60px',         
            fontSize: '4.5rem',  
            padding: '1rem',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          },
        }}
      />

    </div>
  );
}

export default AnimalPhotos;
