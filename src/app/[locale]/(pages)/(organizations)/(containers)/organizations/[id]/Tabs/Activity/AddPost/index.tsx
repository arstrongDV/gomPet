'use client'

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button, Card, FileDropzone, LabelLink, Textarea } from 'src/components'
import style from './AddPost.module.scss'
import PhotosOrganizer from 'src/components/layout/Forms/PhotosOrganizer'
import { PostsApi } from 'src/api'
import toast from 'react-hot-toast'
import OutsideClickHandler from 'react-outside-click-handler'

type AddPostProps = {
  className?: string;
  organizationId: number;
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

const AddPost = ({ className, organizationId, setShowAddPost, refreshPosts }: AddPostProps) => {
  const t = useTranslations('pages.organizations.addPost');
  const tCommon = useTranslations('common');
  const [text, setText] = useState<string>("")
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [addImage, setAddImage] = useState<boolean>(false)

  const createPost = async (): Promise<void> => {
    try {
      setLoading(true);

      const base64 = images.length > 0 ? await fileToBase64(images[0]) : null;

      await PostsApi.addNewOrganizationPost({
        organization: organizationId,
        content: text,
        ...(base64 && { image: base64 }),
      });

      toast.success(t('successToast'));

      setText("");
      setImages([]);
      setShowAddPost(false);
      refreshPosts()
    } catch (err: any) {
      toast.error(err.message || t('errorToast'));
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
            <h3>
              {t('presentImages')}
            </h3>

            <FileDropzone files={images} setFiles={setImages} oneImageOnly />
            <PhotosOrganizer photos={images} setPhotos={setImages} />

            <span className={style.caption}>
              {tCommon('imagesInfo')}
            </span>
          </div>
        )}
      </div>
      <Button
        type="submit"
        label={loading ? t('publishing') : t('publish')}
        disabled={loading || text.length < 2}
        onClick={createPost}
      />
    </Card>
  )
};

export default AddPost;
