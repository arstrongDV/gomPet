'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import { Icon } from 'src/components';

import style from './FileDropzone.module.scss';

type FileDropzoneProps = {
  files: File[];
  setFiles: (photos: File[]) => void;
  oneImageOnly?: boolean;
};

const FileDropzone = ({ files, setFiles, oneImageOnly }: FileDropzoneProps) => {
  const t = useTranslations('common.ui.dropzone');

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles([...files, ...acceptedFiles]);
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (oneImageOnly && files.length >= 1) {
    return;
  }

  return (
    <div
      className={classNames(style.dropzone, {
        [style.dragOver]: isDragActive
      })}
      {...getRootProps()}
    >
      <input {...getInputProps()} />

      {isDragActive ? (
        <>
          <Icon
            className={style.animateArrow}
            name='arrowDown'
          />
          <span className={style.text}>{t('drop')}</span>
        </>
      ) : (
        <>
          <Icon name='upload' />
          <span className={style.text}>{t('dragAndDrop')}</span>
        </>
      )}
    </div>
  );
};

export default FileDropzone;
