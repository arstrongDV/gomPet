'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';

import { Icon } from 'src/components';

import style from './FileDropzone.module.scss';

type FileDropzoneProps = {
  files: File[];
  setFiles: (photos: File[]) => void;
};

const FileDropzone = ({ files, setFiles }: FileDropzoneProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles([...files, ...acceptedFiles]);
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
          <span className={style.text}>Upuść pliki tutaj</span>
        </>
      ) : (
        <>
          <Icon name='upload' />
          <span className={style.text}>Przeciągnij i upuść pliki lub kliknij tutaj, aby je dodać</span>
        </>
      )}
    </div>
  );
};

export default FileDropzone;
