'use client';
import { Button, Card, FileDropzone, ImageInput, Input, LabelLink, RichTextEditor, Select } from 'src/components';
import PhotosOrganizer from 'src/components/layout/Forms/PhotosOrganizer';
import style from './addKnowledge.module.scss';
import { useEffect, useState } from 'react';
import { OptionType } from 'src/components/layout/Forms/Select';
import { ArticlesApi } from 'src/api';
import toast from 'react-hot-toast';
import OutsideClickHandler from 'react-outside-click-handler';
import { IArticle } from 'src/constants/types';
import useCategories from 'src/components/hooks/useCategories';

type AddKnowledgeProps = {
  setIsOpen: (e: boolean) => void;
  initialState?: IArticle;
  refreshKnowledge?: () => void;
  updateArticleInState?: (article: IArticle) => void;
  // categoriesProps: {
  //   id: number;
  //   label: string;
  // }[];
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

const AddKnowledge = ({ setIsOpen, initialState, refreshKnowledge, updateArticleInState }: AddKnowledgeProps) => {
  const [selectValue, setSelectValue] = useState<OptionType | null>(null);
  const [title, setTitle] = useState<string>('');
  const [descriptions, setDescriptions] = useState<string>('');
  const [images, setImages] = useState<File | null>(null);
  const [addImage, setAddImage] = useState<boolean>(false);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  // const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(true);

  const isEditMode = Boolean(initialState);
  const { categories } = useCategories();
  // const categories = categoriesProps ?? [];
  console.log('categoriescategoriescategories::: ', categories);

  const loadExistingImage = async () => {
    // const imageFiles: File[] = [];
    try {
      if (initialState?.image) {
        const mainImageFile = await urlToFile(initialState.image, 'main-image.jpg');
        // imageFiles.push(mainImageFile);
        setImages(mainImageFile);
      }
      // console.log("Converted images:", imageFiles);
    } catch (error) {
      console.error('Failed to load existing images:', error);
      toast.error('Could not load existing images');
    }
  };

  useEffect(() => {
    if (!initialState || categories.length === 0) return;

    const categoryId = initialState.categories[0];

    const category = categories.find((c: any) => c.id === categoryId);

    if (category) {
      setSelectValue({
        label: category.label,
        value: category.id
      });
    }

    setTitle(initialState?.title);
    setDescriptions(initialState?.content);
    setAddImage(Boolean(initialState.image));
    setOriginalImageUrl(initialState.image ?? null);

    loadExistingImage();
  }, [initialState, categories]);

  const hasChanged = () => {
    if (!initialState) return true;

    const titleChanged = title !== initialState.title;
    const contentChanged = descriptions !== initialState.content;
    const categoryChanged = selectValue?.value !== initialState.categories?.[0];

    // image logic
    const imageRemoved = !images && originalImageUrl;
    const imageAdded = images && !originalImageUrl;
    const imageReplaced = images instanceof File && originalImageUrl !== null;

    return titleChanged || contentChanged || categoryChanged || imageRemoved || imageAdded || imageReplaced;
  };

  // const getCategories = async() => {
  // setLoading(true)
  //   try{
  //     const res = await ArticlesApi.getArticlesCategories();
  //     setLoading(false)
  //     setCategories(res.data.results)
  //   }catch(err){
  //     toast.error("Nie udalo sie pobrac kategorii")
  //     setLoading(false)
  //     setCategories([])
  //   }
  // }

  useEffect(() => {
    const isFormValid =
      title.trim() !== '' && descriptions.trim() !== '' && selectValue !== null && title.length <= 50 && !loading;

    if (!isEditMode) {
      setIsDisabledButton(!isFormValid);
      return;
    }

    if (!initialState) {
      setIsDisabledButton(true);
      return;
    }

    setIsDisabledButton(!(isFormValid && hasChanged()));
  }, [title, descriptions, selectValue, loading, images, initialState]);

  const addKnowledge = async () => {
    if (isDisabledButton) {
      toast.error('Wypelnij wszystkie pola');
      return;
    }
    setLoading(true);
    try {
      const base64 = images ? await fileToBase64(images) : null;

      if (isEditMode && initialState) {
        const res = await ArticlesApi.updateKnowledge(
          {
            title: title,
            ...(base64 && { image: base64 }),
            content: descriptions,
            categories: [selectValue?.value]
          },
          initialState.slug
        );
        if (updateArticleInState) updateArticleInState(res?.data);
        toast.success('Wiedza została zaktualizowana!');
      } else {
        await ArticlesApi.postNewArticle({
          title: title,
          ...(base64 && { image: base64 }),
          content: descriptions,
          categories: [selectValue?.value]
        });
        if (refreshKnowledge) refreshKnowledge();
        toast.success('Wiedza została dodana!');
      }
      setTitle('');
      setImages(null);
      setIsOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error('Nie udało się dodać posta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={style.container}>
      <div className={style.postCreate}>
        <Input
          label='Title'
          name='title'
          placeholder={'Title...'}
          value={title}
          onChangeText={setTitle}
          required
        />

        <Select
          label='Kategoria'
          options={categories.map((c: any) => ({
            label: c.label,
            value: c.id
          }))}
          value={selectValue}
          onChange={setSelectValue}
          isSearchable
          isClearable
          isLoading={loading}
        />

        <RichTextEditor
          placeholder={'Napisz coś...'}
          onChange={setDescriptions}
          initialContent={descriptions}
        />

        <LabelLink
          label={!addImage ? 'Dodaj zdjecie' : 'Usun zdjecie'}
          icon={!addImage ? 'plus' : 'x'}
          onClick={() => setAddImage((prev) => !prev)}
        />

        {addImage && (
          <div className={style.addImage}>
            <h3>
              Zaprezentuj <mark>zdjęcia</mark>
            </h3>

            {/* <FileDropzone files={images} setFiles={setImages} />
                <PhotosOrganizer photos={images} setPhotos={setImages} /> */}
            <ImageInput
              className={style.addImage}
              file={images}
              setFile={(file) => setImages(file)}
              onClear={() => setImages(null)}
            />

            <span className={style.caption}>
              Najlepiej na platformie będą wyglądać zdjęcia w formacie 4:3. Zdjęcia nie mogą przekraczać 5 MB. Dozwolone
              formaty to .png, .jpg, .jpeg
            </span>
          </div>
        )}
      </div>
      <Button
        type='submit'
        // label={loading ? "Publikuję..." : "Opublikuj"}
        label={loading ? 'Zapisywanie...' : isEditMode ? 'Zapisz zmiany' : 'Opublikuj'}
        disabled={isDisabledButton}
        onClick={addKnowledge}
      />
    </Card>
  );
};

export default AddKnowledge;
