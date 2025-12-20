'use client';

import { useEffect, useState } from 'react';
import Modal from '../Modal';
import style from './ImageShow.module.scss';

type ImageShowProps = {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  currentPhoto: number;
};

const ImageShow = ({ images, isOpen, onClose, currentPhoto }: ImageShowProps) => {
  const imageUrls = images.map((item) => item.image);
  const [currentIndex, setCurrentIndex] = useState<number>(currentPhoto || 0);

  // Sync currentIndex when modal opens or currentPhoto changes
  useEffect(() => {
    if (isOpen && currentPhoto !== undefined) {
      setCurrentIndex(currentPhoto);
    }
  }, [isOpen, currentPhoto]);

  if (!imageUrls.length) return null;

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  };

  return (
    <Modal
      className={style.modal}
      isOpen={isOpen}
      closeModal={onClose}
    >
      <div className={style.slider}>
        {/* LEFT ARROW */}
        <button
          className={`${style.arrow} ${style.left}`}
          onClick={prevImage}
          aria-label="Previous image"
        >
          ‹
        </button>

        {/* IMAGE */}
        <img
          src={imageUrls[currentIndex]}
          alt={`animal-${currentIndex}`}
          className={style.image}
        />

        {/* RIGHT ARROW */}
        <button
          className={`${style.arrow} ${style.right}`}
          onClick={nextImage}
          aria-label="Next image"
        >
          ›
        </button>
      </div>
    </Modal>
  );
};

export default ImageShow;
