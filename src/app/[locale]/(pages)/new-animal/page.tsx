'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { AnimalsApi } from 'src/api';
import {
  Button,
  Card,
  Checkbox,
  FileDropzone,
  Icon,
  Input,
  InputWrapper,
  Modal,
  RichTextEditor,
  SectionHeader,
  Tag,
} from 'src/components';
import useAnimalInfo from 'src/components/hooks/useAnimalInfo';
import PhotosOrganizer from 'src/components/layout/Forms/PhotosOrganizer';
import { OptionType } from 'src/components/layout/Forms/Select';
import AnimalSelect from 'src/components/layout/Forms/Select/AnimalSelect';
import { Routes } from 'src/constants/routes';
import { AnimalSize, Gender } from 'src/constants/types';

import AddAnimalParents from './components/AddAnimalParents';
import SelectMyOrganizations from './components/SelectOrganizatio';

import style from './NewAnimalPage.module.scss';

type Parent = {
  name: string;
  animal_id: number
  relation?: string | number;
  photos?: string;
};

const genderMap: Record<string, string> = {
  male: 'MALE',
  female: 'FEMALE'
};

const NewAnimalPage = () => {
  const t = useTranslations();

  const [name, setName] = useState<string>('');
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [size, setSize] = useState<AnimalSize>(AnimalSize.SMALL);
  const [price, setPrice] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [status, setStatus] = useState<string>('AVAILABLE');
  const [hasMetrics, setHasMetrics] = useState<boolean>(false);
  const [hasPrice, setHasPrice] = useState<boolean>(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [selectSpeciesValue, setSelectSpeciesValue] = useState<OptionType>(null);
  const [selectRaceValue, setSelectRaceValue] = useState<OptionType>(null);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>([]);
  const [descriptions, setDescriptions] = useState<string>('');
  const [isParentsAdd, setIsParentsAdd] = useState<boolean>(false);
  const [parents, setParents] = useState<Parent[]>([]);

  const [organization, setOrganization] = useState<number | null>();
  const [owner, setOwner] = useState<number | null>();
  const session = useSession();
  const user = session.data?.user;

  const router = useRouter();
  const { push } = router;

  const selectedSpecies = selectSpeciesValue?.value
    ? selectSpeciesValue.label.toUpperCase()
    : undefined;
  const { characteristics } = useAnimalInfo(selectedSpecies);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleApiError = (error: any) => {
    const data = error?.response?.data;

    if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
      toast.error(t('error.mainErrors.somethingWentWrong'));
      return;
    }

    if (typeof data === 'string') {
      toast.error(data);
      return;
    }

    if (data.detail) {
      toast.error(data.detail);
      return;
    }

    if (typeof data === 'object') {
      let hasAnyMessage = false;

      Object.entries(data).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach((msg) => {
            toast.error(`${field}: ${msg}`);
            hasAnyMessage = true;
          });
        } else if (typeof messages === 'string') {
          toast.error(`${field}: ${messages}`);
          hasAnyMessage = true;
        }
      });

      if (!hasAnyMessage) {
        toast.error(t('error.mainErrors.somethingWentWrong'));
      }
    }
  };

  const getCreateAnimalErrorPayload = (error: any) => {
    const data = error?.response?.data;
    if (data && (typeof data !== 'object' || Object.keys(data).length > 0)) {
      return data;
    }

    return {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      message: error?.message
    };
  };

  const isBtnDisabled =
    !name ||
    !birthDate ||
    !selectSpeciesValue?.label ||
    !selectRaceValue?.label ||
    photos.length === 0 ||
    !status;

  const handleChange = (field: string, value: string, label?: string) => {
    if (field === 'breed') {
      setSelectRaceValue({ value, label } as OptionType);
    } else if (field === 'species') {
      setSelectSpeciesValue({ value, label } as OptionType);
    }
  };

  const handleSubmit = async () => {
    if (!user?.location && !organization) {
      toast.error(t('pages.newAnimal.toast.noLocation'));
      return;
    }

    const formData = new FormData();

    try {
      const galleryWithBase64 = await Promise.all(
        photos.map(async (photo) => {
          const base64 = await fileToBase64(photo);
          return { image: base64 };
        })
      );

      formData.append('name', name);
      formData.append('species', String(selectSpeciesValue?.value ?? ''));
      formData.append('breed', String(selectRaceValue?.value ?? ''));
      formData.append('gender', genderMap[gender]);
      formData.append('size', size);
      formData.append('birth_date', birthDate);
      formData.append('status', status);
      formData.append('descriptions', descriptions);

      if (organization !== null && organization !== undefined) {
        formData.append('organization_id', String(organization));
      } else {
        formData.append('organization_id', '');
      }

      if (owner !== null && owner !== undefined) {
        formData.append('owner_id', String(owner));
      } else {
        formData.append('owner_id', '');
      }

      if (hasMetrics) {
        formData.append('hasMetrics', 'true');
      }

      if (!hasPrice || price === '') {
        setPrice('0');
        formData.append('price', '0');
      } else {
        formData.append('price', price);
      }

      if (photos.length > 0) {
        const base64 = await fileToBase64(photos[0]);
        formData.append('image', base64);
      }
      galleryWithBase64.forEach((item, index) => {
        formData.append(`gallery[${index}][image]`, item.image);
      });

      const characteristicsBoard = characteristics.map((char) => ({
        title: char.value,
        bool: selectedCharacteristics.includes(String(char.id))
      }));
      characteristicsBoard.forEach((char, index) => {
        formData.append(`characteristicBoard[${index}][title]`, char.title);
        formData.append(`characteristicBoard[${index}][bool]`, char.bool.toString());
      });

      const animals_res = await AnimalsApi.createNewAnimal(formData);

      if (animals_res.status === 201 || animals_res.statusText === 'Created') {
        const animalId = animals_res.data?.id;
        if (animalId && parents.length > 0) {
          const parentsToAdd = parents.slice(0, 2);
          let successCount = 0;

          for (const [index, parent] of parentsToAdd.entries()) {
            try {
              await AnimalsApi.addAnimalParents({
                animal: animalId,
                parent: parent.animal_id,
                relation: parent.relation
              });
              successCount++;
            } catch (parentError) {
              toast.error(t('pages.newAnimal.toast.addParentError'));
            }
          }

          if (successCount === 0) {
            toast.error(t('pages.newAnimal.toast.createdButParentsFailed'));
          } else if (successCount < parentsToAdd.length) {
            toast.error(t('pages.newAnimal.toast.createdWithSomeParents', { success: successCount, total: parentsToAdd.length }));
          } else {
            toast.success(t('pages.newAnimal.toast.createdWithAllParents'));
          }
        }
      }

      toast.success(t('pages.newAnimal.toast.created'));
      push(Routes.ANIMAL_PROFILE(animals_res.data.id));

      setName('');
      setGender(Gender.MALE);
      setSize(AnimalSize.SMALL);
      setBirthDate('');
      setPrice('');
      setStatus('AVAILABLE');
      setHasMetrics(false);
      setPhotos([]);
      setSelectSpeciesValue(null);
      setSelectRaceValue(null);
      setSelectedCharacteristics([]);
      setParents([]);
      setIsParentsAdd(false);
      setDescriptions('');
    } catch (err: any) {
      console.error('Failed to create animal:', getCreateAnimalErrorPayload(err));
      handleApiError(err);
    }
  };

  useEffect(() => {
    if (parents.length >= 2) {
      setIsParentsAdd(false);
    }
  }, [parents]);

  return (
    <>
      <SectionHeader
        title={t('pages.newAnimal.addNew')}
        subtitle={t('pages.newAnimal.RegisterNewAnimal')}
        margin
      />

      <div className={style.container}>
        {/* BASIC DATA */}
        <Card className={style.section}>
          <h3>
            {t.rich('pages.newAnimal.basicInfo', {
              mark: (chunks) => <mark>{chunks}</mark>,
            })}
          </h3>

          <div className={style.fullWidth}>
            <Input
              id='animal-name'
              name='animal-name'
              label={t('pages.newAnimal.inputAnimalName')}
              placeholder={t('pages.newAnimal.animalsName')}
              value={name}
              onChangeText={setName}
              required
            />
          </div>

          <div className={style.flexRow}>
            <AnimalSelect handleChange={handleChange} isAdding />

            <Input
              label={t('pages.newAnimal.birthDate')}
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>

          <InputWrapper label={t('pages.animals.genderLabel')}>
            <div className={style.genderSelect}>
              <Tag
                selected={gender === Gender.MALE}
                onClick={() => setGender(Gender.MALE)}
              >
                {t('pages.animals.gender.male')}
                <Icon name='genderMale' />
              </Tag>
              <Tag
                selected={gender === Gender.FEMALE}
                onClick={() => setGender(Gender.FEMALE)}
              >
                {t('pages.animals.gender.female')}
                <Icon name='genderFemale' />
              </Tag>
            </div>
          </InputWrapper>

          <InputWrapper label={t('pages.animals.sizeLabel')}>
            <div className={style.genderSelect}>
              <Tag
                selected={size === AnimalSize.SMALL}
                onClick={() => setSize(AnimalSize.SMALL)}
              >
                {t('pages.animals.size.small')}
              </Tag>
              <Tag
                selected={size === AnimalSize.MEDIUM}
                onClick={() => setSize(AnimalSize.MEDIUM)}
              >
                {t('pages.animals.size.medium')}
              </Tag>
              <Tag
                selected={size === AnimalSize.LARGE}
                onClick={() => setSize(AnimalSize.LARGE)}
              >
                {t('pages.animals.size.large')}
              </Tag>
            </div>
          </InputWrapper>

          <SelectMyOrganizations setOrganization={setOrganization} setOwner={setOwner} />

          <Checkbox
            id='animal-has-prise'
            label={t('pages.newAnimal.addPrice')}
            checked={hasPrice}
            onClick={() => setHasPrice((prev) => !prev)}
          />

          {hasPrice && (
            <Input
              id='animal-price'
              name='animal-price'
              label={t('pages.newAnimal.price')}
              placeholder={t('pages.newAnimal.inputPrice')}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="1"
            />
          )}

          <Checkbox
            id='animal-has-metrics'
            label={t('pages.newAnimal.hasMetrics')}
            checked={hasMetrics}
            onClick={() => setHasMetrics((prev) => !prev)}
          />
        </Card>
        {/* BASIC DATA */}

        {/* IMAGES */}
        <Card className={style.section}>
          <h3>
            {t.rich('pages.newAnimal.addImages', {
              mark: (chunks) => <mark>{chunks}</mark>,
            })}
          </h3>

          <FileDropzone files={photos} setFiles={setPhotos} />
          <PhotosOrganizer photos={photos} setPhotos={setPhotos} />

          <span className={style.caption}>
            {t('common.imagesInfo')}
          </span>
        </Card>
        {/* IMAGES */}

        {/* CHARACTERISTICS */}
        <Card className={style.section}>
          <h3>
            {t.rich('pages.newAnimal.characteristics', {
              mark: (chunks) => <mark>{chunks}</mark>,
            })}
          </h3>

          <div className={style.characteristics}>
            {(!selectSpeciesValue || characteristics.length === 0) ? (
              <p>{t('pages.newAnimal.selectSpeciesFirst')}</p>
            ) : (
              characteristics.map(({ id, label }) => (
                <Checkbox
                  key={id}
                  id={String(id)}
                  className={style.checkbox}
                  checked={selectedCharacteristics.includes(String(id))}
                  onChange={() => {
                    setSelectedCharacteristics((prev) =>
                      prev.includes(String(id))
                        ? prev.filter((item) => item !== String(id))
                        : [...prev, String(id)]
                    );
                  }}
                  label={label}
                />
              ))
            )}
          </div>
        </Card>
        {/* CHARACTERISTICS */}

        {/* DESCRIPTION */}
        <Card className={style.section}>
          <h3>
            {t.rich('pages.newAnimal.animalsDescription', {
              mark: (chunks) => <mark>{chunks}</mark>,
            })}
          </h3>
          <RichTextEditor placeholder={t('pages.newAnimal.writeSth')} onChange={setDescriptions} />
          <span className={style.caption}>{t('pages.newAnimal.descriptionVisibleInfo')}</span>
        </Card>
        {/* DESCRIPTION */}

        {/* STATUS */}
        <Card className={style.section}>
          <h3>
            {t.rich('pages.newAnimal.activeStatus', {
              mark: (chunks) => <mark>{chunks}</mark>,
            })}
          </h3>

          <div className={style.statusSelect}>
            <Tag
              onClick={() => setStatus('ADOPTED')}
              selected={status === 'ADOPTED'}
            >
              {t('pages.newAnimal.ADOPTED')}
            </Tag>
            <Tag
              onClick={() => setStatus('RESERVED')}
              selected={status === 'RESERVED'}
            >
              {t('pages.newAnimal.RESERVED')}
            </Tag>
            <Tag
              onClick={() => setStatus('AVAILABLE')}
              selected={status === 'AVAILABLE'}
            >
              {t('pages.newAnimal.AVAILABLE')}
            </Tag>
          </div>

          <span className={style.caption}>{t('pages.newAnimal.statusVisibleInfo')}</span>
        </Card>
        {/* STATUS */}

        {/* PARENTS */}
        <Card className={style.section}>
          <h3>
            {t.rich('pages.newAnimal.findAnimalParents', {
              mark: (chunks) => <mark>{chunks}</mark>,
            })}
          </h3>

          <div className={style.familyTreeBlock}>
            {parents.length < 2 && (
              <div
                className={style.addParents}
                onClick={() => setIsParentsAdd((prev) => !prev)}
                aria-disabled={parents.length === 2}
              >
                <Icon name='plus' />
              </div>
            )}

            {parents.map((p, index) => (
              <div key={index} className={style.parent}>
                <Icon
                  className={style.deleteIcon}
                  name='x'
                  onClick={() => {
                    setParents(prev => prev.filter((_, i) => i !== index));
                  }}
                />
                <img
                  className={style.image}
                  src={p.photos ? p.photos : ''}
                  draggable={false}
                  alt="parent_photo"
                />
                <p>{p.name}</p>
              </div>
            ))}
          </div>

          <Modal
            className={style.modaParentsAddlWin}
            isOpen={isParentsAdd}
            closeModal={() => setIsParentsAdd(false)}
            title={t('pages.newAnimal.parentsAdd')}
          >
            <AddAnimalParents
              className={classNames(style.cardAddParents)}
              setIsParentsAdd={setIsParentsAdd}
              parents={parents}
              onAddParent={(parent) => {
                setParents((prev) => [...prev, parent]);
                setIsParentsAdd(false);
              }}
            />
          </Modal>

          <span className={style.caption}>{t('pages.newAnimal.familyTreeInfo')}</span>
        </Card>
        {/* PARENTS */}

        <Button
          className={style.submit}
          disabled={isBtnDisabled}
          label={t('pages.newAnimal.addAnimal')}
          onClick={handleSubmit}
        />
      </div>
    </>
  );
};

export default NewAnimalPage;
