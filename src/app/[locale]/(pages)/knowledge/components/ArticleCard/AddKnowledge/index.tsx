'use client';
import { Button, Card, FileDropzone, Icon, Input, RichTextEditor, Select } from 'src/components';
import style from './addKnowledge.module.scss';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { OptionType } from 'src/components/layout/Forms/Select';
import { ArticlesApi } from 'src/api';
import toast from 'react-hot-toast';
import { IArticle } from 'src/constants/types';
import useCategories from 'src/components/hooks/useCategories';

type AddKnowledgeProps = {
  setIsOpen: (e: boolean) => void;
  initialState?: IArticle;
  refreshKnowledge?: () => void;
  updateArticleInState?: (article: IArticle) => void;
};

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

const TITLE_MAX = 50;

const AddKnowledge = ({ setIsOpen, initialState, refreshKnowledge, updateArticleInState }: AddKnowledgeProps) => {
  const t = useTranslations('pages.knowledge.form');

  const [categoryValue, setCategoryValue] = useState<OptionType | null>(null);
  const [subcategoryValue, setSubcategoryValue] = useState<OptionType | null>(null);
  const [title, setTitle] = useState(initialState?.title ?? '');
  const [descriptions, setDescriptions] = useState(initialState?.content ?? '');
  const [images, setImages] = useState<File[]>([]);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(initialState?.image || null);
  const [loading, setLoading] = useState(false);
  const [initDone, setInitDone] = useState(false);
  const [editorInitialContent] = useState<string | undefined>(initialState?.content ?? undefined);

  console.log("initialStateinitialState: ", initialState);

  const isEditMode = Boolean(initialState);
  const selectedCategoryIds = categoryValue ? [String(categoryValue.value)] : [];
  const { categories, subcategories, subcategoriesLoading } = useCategories(selectedCategoryIds);

  useEffect(() => {
    if (!initialState || categories.length === 0) return;

    const targetSubcategoryId = initialState.categories?.[0];
    if (!targetSubcategoryId) return;

    const allGroupValues = categories.map(c => String(c.value));
    ArticlesApi.getArticlesCategories(allGroupValues).then(res => {
      const allSubs: any[] = res.data.results ?? res.data ?? [];
      const found = allSubs.find((s: any) => s.id === targetSubcategoryId);
      if (!found) return;

      const parentCategory = categories.find(c => String(c.value) === found.group);
      if (parentCategory) setCategoryValue({ label: parentCategory.label, value: parentCategory.value });
      setSubcategoryValue({ label: found.name, value: found.id });
      setInitDone(true);
    }).catch(() => {});
  }, [initialState, categories]);

  useEffect(() => {
    if (isEditMode && !initDone) return;
    setSubcategoryValue(null);
  }, [categoryValue]);

  const previewUrl = images[0]
    ? URL.createObjectURL(images[0])
    : originalImageUrl ?? null;

  const hasImage = Boolean(previewUrl);

  const removeImage = () => {
    setImages([]);
    setOriginalImageUrl(null);
  };

  const hasChanged = () => {
    if (!initialState) return true;
    return (
      title !== initialState.title ||
      descriptions !== initialState.content ||
      String(subcategoryValue?.value) !== String(initialState.categories?.[0]) ||
      images.length > 0 ||
      (!originalImageUrl && Boolean(initialState.image))
    );
  };

  const isFormValid =
    title.trim() !== '' &&
    title.length <= TITLE_MAX &&
    descriptions.trim() !== '' &&
    subcategoryValue !== null &&
    !loading;

  const isDisabled = isEditMode ? !(isFormValid && hasChanged()) : !isFormValid;

  const addKnowledge = async () => {
    if (isDisabled) return;
    setLoading(true);
    try {
      const base64 = images[0] ? await fileToBase64(images[0]) : null;
      const payload = {
        title,
        content: descriptions,
        categories: [subcategoryValue?.value],
        ...(base64 && { image: base64 }),
      };

      if (isEditMode && initialState) {
        const res = await ArticlesApi.updateKnowledge(payload, initialState.slug);
        updateArticleInState?.(res?.data);
        toast.success(t('toast.updated'));
      } else {
        await ArticlesApi.postNewArticle(payload);
        refreshKnowledge?.();
        toast.success(t('toast.added'));
      }

      setTitle('');
      setImages([]);
      setIsOpen(false);
    } catch (err) {
      toast.error(t('toast.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={style.container}>
      <div className={style.postCreate}>

        <div className={style.inputWrapper}>
          <Input
            label={t('titleLabel')}
            name='title'
            placeholder={t('titlePlaceholder')}
            value={title}
            onChangeText={setTitle}
            required
          />
          <span className={`${style.counter} ${title.length > TITLE_MAX ? style.counterError : ''}`}>
            {title.length} / {TITLE_MAX}
          </span>
        </div>

        <div className={style.categoryGroup}>
          <Select
            label={t('categoryLabel')}
            options={categories.map((c: any) => ({ label: c.label, value: c.value }))}
            value={categoryValue}
            onChange={setCategoryValue}
            isSearchable
            isClearable
          />

          {categoryValue && (
            <div className={style.subcategoryWrapper}>
              {subcategoriesLoading ? (
                <div className={style.subcategoryLoading}>{t('subcategoryLoading')}</div>
              ) : (
                <Select
                  label={t('subcategoryLabel')}
                  options={subcategories.map((c: any) => ({ label: c.label, value: c.value }))}
                  value={subcategoryValue}
                  onChange={setSubcategoryValue}
                  isSearchable
                  isClearable
                />
              )}
            </div>
          )}
        </div>

        <RichTextEditor
          placeholder={t('contentPlaceholder')}
          onChange={setDescriptions}
          initialContent={editorInitialContent}
        />

        <div className={style.imageSection}>
          {hasImage ? (
            <div className={style.imagePreview}>
              <img src={previewUrl!} alt='preview' className={style.previewImg} />
              <button className={style.removeBtn} onClick={removeImage} type='button'>
                <Icon name='x' />
              </button>
            </div>
          ) : (
            <FileDropzone files={images} setFiles={setImages} oneImageOnly />
          )}
          <span className={style.caption}>{t('photosCaption')}</span>
        </div>
        
      </div>

      <Button
        type='submit'
        label={isEditMode ? t('saveChanges') : t('publish')}
        isLoading={loading}
        disabled={isDisabled}
        onClick={addKnowledge}
      />
    </Card>
  );
};

export default AddKnowledge;
