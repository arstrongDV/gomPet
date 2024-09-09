'use client';

import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import { Icon, InputWrapper } from 'src/components';
import { getUrlFile } from 'src/utils/helpers';

import { getWrapperProps } from '../InputWrapper';

import style from './ImageInput.module.scss';

type ImageInputProps = {
  className?: string;
  src?: string | null;
  file: File | null;
  label?: string;
  setFile: (file: File | null) => void;
  onClear?: () => void;
  disabled?: boolean;
  fileTypes?: string[];
  fileMaxSize?: number;
};

const DEFAULT_ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const DEFAULT_MAX_SIZE = 10000000;

const ImageInput = (props: ImageInputProps) => {
  const wrapperProps = getWrapperProps(props);

  const {
    className,
    src,
    file,
    setFile,
    onClear,
    disabled = false,
    fileTypes = DEFAULT_ALLOWED_TYPES,
    fileMaxSize = DEFAULT_MAX_SIZE
  } = props;

  const t = useTranslations();

  const fileInput = React.useRef<HTMLInputElement>(null);
  const handleLoadFile = () => fileInput.current?.click();

  const clearFile = () => {
    setFile(null);
    if (onClear) onClear();
    if (!fileInput.current) return;
    // fileInput.current!.files = null;
    // fileInput.current!.value = '';
  };

  const validateFile = (file: File | null) => {
    if (!file) return;

    if (!fileTypes.includes(file.type)) {
      toast.error(
        t('notifications:error.allowedFileTypes', {
          types: fileTypes.map((type: string) => type.split('/')[1]).join(', ')
        })
      );
      return false;
    }

    if (file.size > fileMaxSize) {
      toast.error(t('notifications:error.maxFileSize', { size: fileMaxSize / 1000000 }));
      return false;
    }

    return true;
  };

  useEffect(() => {
    const getFile = async () => {
      if (!src) return;
      const file = await getUrlFile(src);
      setFile(file);
    };

    getFile();
  }, [src]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (!validateFile(file)) {
      e.target.files = null;
      e.target.value = '';
      return;
    }

    setFile(file);
    e.target.files = null;
  };

  return (
    <InputWrapper {...wrapperProps}>
      <div className={classNames(style.imageInput, className)}>
        {file && !disabled && (
          <button
            className={style.remove}
            onClick={clearFile}
          >
            <Icon
              name='x'
              className={style.icon}
            />
          </button>
        )}
        <div className={style.image}>
          {!file && (
            <input
              type='file'
              onChange={handleFileChange}
              ref={fileInput}
              className={style.fileInput}
              accept={fileTypes.join(',')}
              hidden
            />
          )}
          {!file && (
            <div
              className={style.placeholder}
              onClick={handleLoadFile}
            >
              <Icon name='camera' />
              <span className={style.info}>Kliknij, aby dodać zdjęcie</span>
            </div>
          )}
          {file && (
            <a
              href={src ? src : undefined}
              target='_blank'
              rel='noreferrer'
            >
              <img
                src={URL.createObjectURL(file)}
                alt='image'
                draggable={false}
              />
            </a>
          )}
        </div>
      </div>
    </InputWrapper>
  );
};

export default ImageInput;
