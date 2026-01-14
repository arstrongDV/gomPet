'use client'
import React, { useEffect, useState } from 'react'
import { Button, Card, FileDropzone, LabelLink, Textarea } from 'src/components'
import style from './updatePostCard.module.scss'
import PhotosOrganizer from 'src/app/[locale]/(pages)/new-animal/components/PhotosOrganizer'
import { PostsApi } from 'src/api'
import toast from 'react-hot-toast'
import OutsideClickHandler from 'react-outside-click-handler'
import { IPost } from 'src/constants/types'

type UpdatePostCardData = {
    className?: string;
    post: IPost;
    updatePosts?: (value: any) => void;
    // updatePosts: ((updatedPost: IPost) => null | undefined) | undefined
    SetShowUpdateCard?: (e: any) => void;
};

const urlToFile = async (url: string, filename: string): Promise<File> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      console.error('Error converting URL to File:', error);
      throw error;
    }
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
};

  const UpdatePostCard = ({ className, post, SetShowUpdateCard, updatePosts }: UpdatePostCardData) => {
    const [text, setText] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false);

    const [addImage, setAddImage] = useState<boolean>(false)

    const [images, setImages] = useState<File[]>([]);
    const [formData, setFormData] = useState({
        content: '',
        image: ''
    });

    useEffect(() => {
        setFormData({
          content: post.content || '',
          image: post.image || ''
        });

        const loadExistingImages = async () => {
          if (post.image) {
            try {
              const url_image = await urlToFile(post.image, 'main-image.jpg');
              setImages([url_image]); // must be array, not single file
              setAddImage(true);
            } catch (err) {
              console.error("Failed to load image:", err);
            }
          }
        };

        loadExistingImages();
      }, [post]);

      const updatePost = async (): Promise<void> => {
        setLoading(true);
        try {
            let imageBase64: string | null = null;
        
            if (images.length > 0) {
              imageBase64 = await fileToBase64(images[0]);
            }
            const payload = { ...formData, image: imageBase64 };
            const { data: updatedPost } = await PostsApi.updatePost(post.id, payload);
            if(updatePosts) updatePosts(updatedPost);
          toast.success("Post zaktualizowany!");
          if(SetShowUpdateCard)
          SetShowUpdateCard(false);
          console.log(updatedPost);
          // SetShowUpdateCard(); 
        } catch (err: any) {
          console.error(err);
          toast.error(err.message || "Nie udało się zaktualizować posta");
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
      <OutsideClickHandler onOutsideClick={() => SetShowUpdateCard && SetShowUpdateCard(false)}>
          <Card className={`${style.container} ${className || ''}`}>
          <header>
              <h2>Actualizuj Post</h2>
          </header>
          <div className={style.postCreate}>
              <Textarea
              className={style.textarea}
              placeholder={'Napisz coś...'}
              value={formData.content}
              onChangeText={(val) => setFormData((prev: any) => ({ ...prev, content: val }))}
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
              label={loading ? "Aktualizuję..." : "Aktualizuj"}
              disabled={loading}
              onClick={updatePost}
          />
          </Card>
      </OutsideClickHandler>
    )
  };

export default UpdatePostCard
