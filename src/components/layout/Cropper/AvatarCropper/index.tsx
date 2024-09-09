'use client';

import React, { useEffect, useState } from 'react';

import { getBase64File } from 'src/utils/helpers';

import Modal from '../../Modal';
import ImageCropper from '../ImageCropper';

import style from './AvatarCropper.module.scss';

type AvatarCropperProps = {
  className?: string;
  src: File | null;
  filename?: string;
  type?: string;
  isOpen: boolean;
  closeModal: () => void;
  onCropSuccess: (file: File) => void;
};

const AvatarCropper = (props: AvatarCropperProps) => {
  const { className, src, isOpen, closeModal, onCropSuccess, filename, type } = props;

  const [srcBase64, setSrcBase64] = useState<string | null>(null);

  const urlToFile = async (url: string, filename: string, mimeType: string) => {
    const result = await fetch(url);
    const buffer = await result.arrayBuffer();
    return new File([buffer], filename, { type: mimeType });
  };

  useEffect(() => {
    if (!src) return;
    getBase64File(src).then((res) => setSrcBase64(res));
  }, [src]);

  const onClose = () => {
    closeModal();
  };

  const onCropImage = async (imageBase64: string) => {
    try {
      const newFilename = filename || src?.name || 'image.png';
      const newType = type || 'image/png';

      const file = await urlToFile(imageBase64, newFilename, newType);
      onCropSuccess(file);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      className={style.modal}
      isOpen={isOpen}
      closeModal={onClose}
    >
      {srcBase64 && (
        <ImageCropper
          image={srcBase64}
          isLoading={false}
          onSubmit={onCropImage}
          onCancel={onClose}
          showRound={false}
        />
      )}
    </Modal>
  );
};

export default AvatarCropper;
