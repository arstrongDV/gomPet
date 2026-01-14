'use client'

import React, { useEffect, useState } from 'react'
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
  const [text, setText] = useState<string>("")
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [addImage, setAddImage] = useState<boolean>(false)

  const createPost = async (): Promise<void> => {
    try {
      setLoading(true);

      const base64 = images.length > 0 ? await fileToBase64(images[0]) : null;

      const res = await PostsApi.addNewOrganizationPost({
        organization: organizationId,
        content: text,
        ...(base64 && { image: base64 }),
      });

      console.log("res::: ", res);
      toast.success("Post został dodany!");

      setText("");
      setImages([]);
      setShowAddPost(false);
      refreshPosts()
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Nie udało się dodać posta");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!addImage){
      setImages([])
    }
  }, [addImage])

  return (
    <OutsideClickHandler onOutsideClick={() => setShowAddPost(false)}>
        <Card className={`${style.container} ${className || ''}`}>
        <header>
            <h2>Dodaj Post</h2>
        </header>
        <div className={style.postCreate}>
            <Textarea
            className={style.textarea}
            placeholder={'Napisz coś...'}
            onChangeText={setText}
            value={text}
            />

          <LabelLink 
            label={!addImage ? "Dodaj zdjecie" : "Usun zdjecie"} 
            icon={!addImage ? 'plus' : 'x'} 
            onClick={() => setAddImage(prev => !prev)}
          />

            {addImage && (
              <div className={style.addImage}>
                <h3>
                    Zaprezentuj <mark>zdjęcia</mark>
                </h3>
  
                <FileDropzone files={images} setFiles={setImages} />
                <PhotosOrganizer photos={images} setPhotos={setImages} />
  
                <span className={style.caption}>
                    Najlepiej na platformie będą wyglądać zdjęcia w formacie 4:3. Zdjęcia nie mogą przekraczać 5 MB. Dozwolone formaty to .png, .jpg, .jpeg
                </span>
              </div>
            )}
        </div>
        <Button
            type="submit"
            label={loading ? "Publikuję..." : "Opublikuj"}
            disabled={loading}
            onClick={createPost}
        />
        </Card>
    </OutsideClickHandler>
  )
};

export default AddPost;
