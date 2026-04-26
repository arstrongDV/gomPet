'use client'

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl';
import { Button, Card, FileDropzone, LabelLink, Textarea } from 'src/components'
import style from './AddPost.module.scss'
import PhotosOrganizer from 'src/components/layout/Forms/PhotosOrganizer'
import { PostsApi } from 'src/api'
import toast from 'react-hot-toast'

type AddPostProps = {
  className?: string;
  animalId?: number;
  organizationId?: number;
  setShowAddPost: React.Dispatch<React.SetStateAction<boolean>>;
  refreshPosts: () => void;
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const AddPostComponent = ({ className, animalId, organizationId, setShowAddPost, refreshPosts }: AddPostProps) => {
  const t = useTranslations('posts');
  const tCommon = useTranslations('common');

  const [text, setText] = useState<string>("")
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [addImage, setAddImage] = useState<boolean>(false)

  const createPost = async (): Promise<void> => {
    try {
      setLoading(true);

      const base64 = images.length > 0 ? await fileToBase64(images[0]) : null;

      const payloadId = animalId ? { animal: animalId } : { organization: organizationId };

      await PostsApi.addNewAnimalPost({
        payload: {
          ...payloadId,
          content: text,
          ...(base64 && { image: base64 })
        }
      });

      toast.success(t('toast.added'));
      setText("");
      setImages([]);
      setShowAddPost(false);
      refreshPosts()
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || t('toast.addError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!addImage) {
      setImages([])
    }
  }, [addImage])

  return (
    <Card className={`${style.container} ${className || ''}`}>
      <div className={style.postCreate}>
        <Textarea
          className={style.textarea}
          placeholder={t('placeholder')}
          onChangeText={setText}
          value={text}
        />

        <LabelLink
          label={!addImage ? t('addImage') : t('removeImage')}
          icon={!addImage ? 'plus' : 'x'}
          onClick={() => setAddImage(prev => !prev)}
        />

        {addImage && (
          <div className={style.addImage}>
            <h3><mark>{t('presentPhotos')}</mark></h3>

            <FileDropzone files={images} setFiles={setImages} oneImageOnly />
            <PhotosOrganizer photos={images} setPhotos={setImages} />

            <span className={style.caption}>{tCommon('imagesInfo')}</span>
          </div>
        )}
      </div>
      <Button
        type="submit"
        label={loading ? t('publishing') : tCommon('action.publish')}
        disabled={loading}
        onClick={createPost}
      />
    </Card>
  )
};

export default AddPostComponent;
