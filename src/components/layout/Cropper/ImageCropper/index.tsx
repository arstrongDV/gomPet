'use client';

import React, { useCallback, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import classNames from 'classnames';

import { Button } from 'components';

import getCroppedImg from './functions';

import 'react-easy-crop/react-easy-crop.css';
import style from './ImageCropper.module.scss';

const ImageCropper = ({ image, onSubmit, isLoading, showRound, onCancel }: any) => {
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleOnCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSubmit = async () => {
    const cropped = await getCroppedImg(image, croppedAreaPixels);
    onSubmit(cropped);
  };

  return (
    <div className={style.container}>
      <div className={classNames(style.wrapper, { cropAreaRound: showRound })}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropComplete={handleOnCropComplete}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          disableAutomaticStylesInjection
        />
      </div>
      <div className={style.control}>
        <Button
          label={'Zapisz zdjęcie'}
          onClick={() => handleSubmit()}
          isLoading={isLoading}
        />
        <Button
          label={'Anuluj'}
          onClick={onCancel}
          gray
        />
      </div>
    </div>
  );
};

export default ImageCropper;
