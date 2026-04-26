'use client';

import React, { useEffect,useState } from 'react';
import toast from 'react-hot-toast';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
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
  Loader,
  Modal,
  RichTextEditor,
  SectionHeader,
  Tag } from 'src/components';
import useAnimalInfo from 'src/components/hooks/useAnimalInfo';
import AnimalSelect from 'src/components/layout/Forms/Select/AnimalSelect';
import { AnimalSize, Gender, IAnimal, IOrganization } from 'src/constants/types';

import AddAnimalParents from '../../../new-animal/components/AddAnimalParents';
import PhotosOrganizer from '../../../new-animal/components/PhotosOrganizer';
import SelectMyOrganizations from '../../../new-animal/components/SelectOrganizatio';

import style from './updateAnimal.module.scss'

type Parent = {
  id?: number;
  animal_id: number;
  name: string;
  relation?: string;
  gender?: string;
  photos?: string;
  isNew?: boolean;
}

interface AnimalUpdateFormProps {
  animal: IAnimal;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface CharacteristicItem {
  id: number;
  title: string;
  label: string;
  bool: boolean;
}

type SelectLikeValue =
  | string
  | number
  | null
  | undefined
  | {
      id?: string | number;
      value?: string | number;
      label?: string;
    };

type GalleryLikeItem =
  | string
  | {
      id?: string | number;
      image?: string;
    };

type AnimalUpdateFormData = {
  name: string;
  species: string;
  breed: string;
  gender: string;
  birth_date: string;
  image: string;
  size: string;
  descriptions: string;
  status: string;
  parents: Parent[];
  price: string;
  organization: null;
  owner: null;
};

const getSelectId = (value: SelectLikeValue): string => {
  if (value && typeof value === 'object') {
    const raw = value.id ?? value.value;
    return raw === undefined || raw === null ? '' : String(raw);
  }
  return value === undefined || value === null ? '' : String(value);
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

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });


const AnimalUpdateForm: React.FC<AnimalUpdateFormProps> = ({ 
  animal, 
  onSuccess, 
  onCancel 
}) => {
  const t = useTranslations('pages.newAnimal');
  const tCommon = useTranslations('common');

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AnimalUpdateFormData>({
    name: '',
    species: '',
    breed: '',
    gender: "MALE",
    birth_date: '',
    image: '',
    size: '',
    descriptions: '',
    status: 'AVAILABLE',
    parents: [],
    price: '',
    organization: null,
    owner: null
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [initialPhotos, setInitialPhotos] = useState<File[]>([]);
  const [characteristics, setCharacteristics] = useState<CharacteristicItem[]>([]);
  const [description, setDescriptions] = useState<string>('');
  const [initialDescription, setInitialDescription] = useState<string | null>(null);
  const [isParentsAdd, setIsParentsAdd] = useState<boolean>(false);
  const [parents, setParents] = useState<Parent[]>([]);
  const [oldParents, setOldParents] = useState<Parent[]>([]);
  const [price, setPrice] = useState<string>('');
  const [hasPrice, setHasPrice] = useState<boolean>(false);

  const [initialOrganization, setInitialOrganization] = useState<IOrganization | null>(null);
  const [organization, setOrganization] = useState<number | null>(null);
  const [owner, setOwner] = useState<number | null>();

  const { characteristics: animalCharacteristics, isLoading: characteristicsLoading } = useAnimalInfo(formData.species);

  useEffect(() => {
      if (animal) {
        const normalizedPrice = Number(animal.price ?? 0);

        setFormData({
          name: animal.name ?? '',
          species: getSelectId(animal.species as SelectLikeValue),
          breed: getSelectId(animal.breed as SelectLikeValue),
          // breeds: {
          //   value: animal.breed.value ?? '',
          //   label: animal.breed.label ?? '',
          // },
          // species: {
          //   value: animal.species.value ?? '',
          //   label: animal.species.label ?? '',
          // },
          gender: animal.gender ?? "MALE",
          birth_date: animal.birth_date ?? '',
          size: animal.size ?? AnimalSize.SMALL,
          status: animal.status ?? 'AVAILABLE',
          // city: animal.city ?? '',
          price: normalizedPrice > 0 ? String(normalizedPrice) : '',
          descriptions: animal.descriptions ?? '',
          image: '',
          // organization: animal?.organization && animal?.organization.id,
          // owner: animal.owner,
          parents: [],
          organization: null,
          owner: null,
        });

        setInitialOrganization(animal.organization ?? null);

        setInitialDescription(animal.descriptions ?? '');

        if (normalizedPrice > 0) {
          setHasPrice(true);
          setPrice(String(normalizedPrice));
        } else {
          setHasPrice(false);
          setPrice(''); 
        }

        if (animal.owner) {
          if (typeof animal.owner === 'number') {
            setOwner(animal.owner);
          } else if (typeof animal.owner === 'object' && 'id' in animal.owner) {
            setOwner(Number(animal.owner.id));
          }
        }

        if (animal.organization) {
          setOrganization(animal.organization.id);
        }

        // setSelectSpeciesValue(animal.species);
        // setSelectRaceValue(animal.breed);

      const loadExistingImages = async () => {
        const imageFiles: File[] = [];

        if (animal.image) {
          try {
            const mainImageFile = await urlToFile(animal.image, 'main-image.jpg');
            imageFiles.push(mainImageFile);
          } catch {
            console.error("Failed to load main image");
          }
        }

        if (animal.gallery?.length) {
          const animalSlice = (animal.gallery as GalleryLikeItem[]).slice(1);
          for (const galleryItem of animalSlice) {
            const galleryImage = typeof galleryItem === 'string' ? galleryItem : galleryItem.image;
            const galleryId = typeof galleryItem === 'string' ? 'legacy' : String(galleryItem.id ?? 'legacy');
            if (galleryImage) {
              try {
                const galleryFile = await urlToFile(galleryImage, `gallery-${galleryId}.jpg`);
                imageFiles.push(galleryFile);
              } catch {
                console.error(`Failed to load gallery image ${galleryId}`);
              }
            }
          }
        }

        setPhotos(imageFiles);
        setInitialPhotos(imageFiles);
      }
      loadExistingImages();

      if (animal.parents) {
        // Mark existing parents as not new
        const existingParents: Parent[] = (animal.parents as any[]).map(parent => ({
          ...parent,
          id: parent.id ?? parent.animal_id,
          animal_id: parent.animal_id ?? parent.id,
          photos: parent.photos ?? parent.image,
          isNew: false
        }));
        setParents(existingParents);
        setOldParents(existingParents);
      } else {
        setParents([]);
      }
      console.log(animal)
      console.log(parents)
    };

  }, [animal]);

  useEffect(() => {
    if (!animal || !animalCharacteristics?.length) return;
    const boardByName = Object.fromEntries(
      (animal.characteristicBoard ?? []).map(item => [item.title, item.bool])
    );
    setCharacteristics(
      animalCharacteristics.map((char) => ({
        id: char.id,
        title: char.name,
        label: char.label,
        bool: boardByName[char.name] ?? boardByName[char.value] ?? false,
      }))
    );
  }, [animalCharacteristics]);

  // const handleChange = (field: string, value: string, label?: string) => {
  //   if(field === 'breed'){
  //     setFormData({ value, label } as OptionType);
  //   } else if(field === 'species'){
  //     setFormData({ value, label } as OptionType);
  //   }
  // };
console.log(formData);
  const handleInputChange = (field: string, value: string | number | Gender) => {
    const normalizedValue = String(value);

    setFormData((prev) => {
      switch (field) {
        case 'name':
          return { ...prev, name: normalizedValue };
        case 'species':
          return { ...prev, species: normalizedValue };
        case 'breed':
          return { ...prev, breed: normalizedValue };
        case 'gender':
          return { ...prev, gender: normalizedValue };
        case 'birth_date':
          return { ...prev, birth_date: normalizedValue };
        case 'size':
          return { ...prev, size: normalizedValue };
        case 'status':
          return { ...prev, status: normalizedValue };
        case 'image':
          return { ...prev, image: normalizedValue };
        default:
          return prev;
      }
    });
  };


  const hasChanged = () => {
    if (!animal) return false;
  
    const basicChanged =
      formData.name !== (animal.name ?? '') ||
      formData.species !== getSelectId(animal.species as SelectLikeValue) ||
      formData.breed !== getSelectId(animal.breed as SelectLikeValue) ||
      formData.gender !== (animal.gender ?? "MALE") ||
      formData.birth_date !== (animal.birth_date ?? '') ||
      formData.size !== animal.size ||
      formData.status !== animal.status ||
      (initialOrganization?.id ?? null) !== organization ||
      description !== (animal.descriptions ?? '');
  
    const priceChanged =
      Number(hasPrice ? price : 0) !== Number(animal.price ?? 0);
  
    const parentsChanged =
      JSON.stringify(
        parents
          .map(p => ({
            id: p.animal_id ?? p.id,
            relation: p.relation
          }))
          .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
      ) !==
      JSON.stringify(
        ((animal.parents ?? []) as unknown as Parent[])
          .map(p => ({
            id: p.animal_id ?? p.id,
            relation: p.relation
          }))
          .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
      );
  
    const photosChanged =
      photos.length !== initialPhotos.length ||
      photos.some((p, i) => p !== initialPhotos[i]);

    const originalBools = Object.fromEntries(
      (animal.characteristicBoard ?? []).map(item => [item.title, item.bool])
    );
    const characteristicsChanged = characteristics.some(
      char => char.bool !== (originalBools[char.title] ?? false)
    );

    return basicChanged || priceChanged || parentsChanged || photosChanged || characteristicsChanged;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);


    try {
      if (photos.length === 0) {
        toast.error(t('mustAddPhotos'));
        setLoading(false);
        return;
      }

      const submitData = new FormData();

      submitData.append('name', formData.name);
      submitData.append('species', formData.species);
      submitData.append('breed', formData.breed);
      submitData.append('gender', formData.gender);
      submitData.append('birth_date', formData.birth_date);
      submitData.append('size', formData.size);
      submitData.append('status', formData.status);
      submitData.append('descriptions', description || initialDescription || '');
      submitData.append('price', hasPrice && price !== '' ? price : '0');
      submitData.append('organization_id', String(organization ?? ''));

      const photosChanged =
        photos.length !== initialPhotos.length ||
        photos.some((p, i) => p !== initialPhotos[i]);

      if (photosChanged) {
        const imageBase64 = await fileToBase64(photos[0]);
        submitData.append('image', imageBase64);

        for (let i = 0; i < photos.length; i++) {
          const base64 = await fileToBase64(photos[i]);
          submitData.append(`gallery[${i}][image]`, base64);
        }
      }

      characteristics.forEach((char, i) => {
        submitData.append(`characteristicBoard[${i}][title]`, char.title);
        submitData.append(`characteristicBoard[${i}][bool]`, char.bool.toString());
      });

      const animals_res = await AnimalsApi.updateAnimal(animal.id, submitData);

      if (animals_res.status === 200) {
        try {
          for (const p of oldParents) {
            if (p.id) {
              await AnimalsApi.clearAnimalParents(p.id);
            }
          }
          if (parents.length > 0) {
            for (const parent of parents) {
              const parentData = {
                animal: animal.id,  
                parent: parent.animal_id,  
                relation: parent.relation ? parent.relation : (parent.gender == "FEMALE" ? "MOTHER" : "FATHER")
              };
              console.log("Adding parent:", parentData);
              await AnimalsApi.addAnimalParents(parentData);
            }
          }
        } catch (err) {
          console.error("Failed to update parents", err);
          toast.error(t('updateParentsError'));
        }
      }
      toast.success(t('updated'));
      onSuccess?.();
      // router.refresh();
    } catch (error) {
      console.error('Error updating animal:', error);
      toast.error(t('updateError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCharacteristicChange = (title: string, bool: boolean) => {
    setCharacteristics(prev =>
      prev.map(char =>
        char.title === title ? { ...char, bool } : char
      )
    );
  };
  // const currentBreedOptions = formData.species 
  //   ? breedOptions[formData.species as keyof typeof breedOptions] || breedOptions.other
  //   : breedOptions.other;

    console.log("formDataformData: ", formData);


  if (!animal) {
    return (
      <div className={style.loadingContainer}>
        <p>{t('noAnimalData')}</p>
        <Button onClick={onCancel} label={t('goBack')} />
      </div>
    );
  }
  return (
    <div className={style.animalUpdateForm}>
        <SectionHeader
          title={t('editTitle')}
          subtitle={t('editSubtitle', { name: animal.name })}
          margin
        />
        <div className={style.container}>
          <Card className={style.section}>
            <h3>
              {t.rich('basicInfo', { mark: (chunks) => <mark>{chunks}</mark> })}
            </h3>
            <div className={style.fullWidth}>
              <Input
                label={t('nameLabel')}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div className={style.flexRow}>
              {/* <Select
                label="Species"
                options={speciesOptions}
                value={speciesOptions.find(opt => opt.value === formData.species) || null}
                onChange={(option: OptionType | null) => {
                  handleInputChange('species', option?.value || '')
                }
                }
              />
              
              <Select
                label="Breed"
                options={currentBreedOptions}
                value={currentBreedOptions.find(opt => opt.value === formData.breed) || null}
                onChange={(option: OptionType | null) => 
                  handleInputChange('breed', option?.value || '')
                }
              /> */}

              <AnimalSelect 
                // initialState={{
                //   speciesOpt: formData?.species && { value: formData?.species },
                //   breedOpt: formData?.breed && { value: formData?.breed }
                // }}
                // initialState={{
                //   speciesOpt: formData.species
                //     ? { value: formData.species, label: formData.species }
                //     : null,
                //   breedOpt: formData.breed
                //     ? { value: formData.breed, label: formData.breed }
                //     : null
                // }}
                initialState={{
                  speciesOpt: formData.species ? { value: formData.species, label: formData.species } : undefined,
                  breedOpt: formData.breed ? { value: formData.breed, label: formData.breed } : undefined
                }}
                handleChange={handleInputChange} 
                isAdding
              />

              <Input
                label={t('birthDate')}
                type="date"
                value={formData.birth_date}
                onChange={(e) => handleInputChange('birth_date', e.target.value)}
              />
            </div>

            {/* <div className={style.formRow}>
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
            </div> */}

            <InputWrapper label={t('genderLabel')}>
              <div className={style.genderSelect}>
                <Tag
                  selected={formData.gender === "MALE"}
                  onClick={() => handleInputChange('gender', "MALE")}
                >
                  {t('male')}
                  <Icon name="genderMale" />
                </Tag>
                <Tag
                  selected={formData.gender === "FEMALE"}
                  onClick={() => handleInputChange('gender', "FEMALE")}
                >
                  {t('female')}
                  <Icon name="genderFemale" />
                </Tag>
              </div>
            </InputWrapper>

            <InputWrapper label={t('sizeLabel')}>
              <div className={style.genderSelect}>
                <Tag
                  selected={formData.size === AnimalSize.SMALL}
                  onClick={() => handleInputChange('size', AnimalSize.SMALL)}
                >
                  {t('small')}
                </Tag>
                <Tag
                  selected={formData.size === AnimalSize.MEDIUM}
                  onClick={() => handleInputChange('size', AnimalSize.MEDIUM)}
                >
                  {t('medium')}
                </Tag>
                <Tag
                  selected={formData.size === AnimalSize.LARGE}
                  onClick={() => handleInputChange('size', AnimalSize.LARGE)}
                >
                  {t('large')}
                </Tag>
              </div>
            </InputWrapper>

            {/* {organization !== null && ( */}
              <SelectMyOrganizations 
              initialOrganization={initialOrganization ? {
                label: initialOrganization.name, 
                value: initialOrganization.id
              } : null} 
              setOrganization={setOrganization} 
              setOwner={setOwner}
            />
            {/* )} */}

          <Checkbox
            id='animal-has-prise'
            label={t('addPrice')}
            checked={hasPrice}
            onClick={() => setHasPrice((prev) => !prev)}
          />

          {hasPrice && (
            <Input
              id='animal-price'
              name='animal-price'
              label={t('price')}
              placeholder={t('inputPrice')}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="1"
            />
          )}

            {/* <Input
              id='animal-price'
              name='animal-price'
              label={'Cena'}
              placeholder='Napisz cennę...'
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
              min="1"
            /> */}
          </Card> 

          <Card className={style.section}>
            <h3>
              {t.rich('addImages', { mark: (chunks) => <mark>{chunks}</mark> })}
            </h3>

            <FileDropzone
              files={photos}
              setFiles={setPhotos}
            />
            <PhotosOrganizer
              photos={photos}        
              setPhotos={setPhotos}  
            />

            <span className={style.caption}>
              {tCommon('imagesInfo')}
            </span>
          </Card>
          <Card className={style.section}>
            <h3>
              {t.rich('characteristics', { mark: (chunks) => <mark>{chunks}</mark> })}
            </h3>
              <div className={style.characteristics}>
                {characteristicsLoading
                  ? <Loader />
                  : characteristics.map((char) => (
                    <Checkbox
                      key={char.id}
                      id={String(char.id)}
                      label={char.label}
                      checked={char.bool}
                      onChange={(e) => handleCharacteristicChange(char.title, e.target.checked)}
                    />
                  ))
                }
              </div>
          </Card>
          <Card className={style.section}>
            <h3>
              {t.rich('animalsDescription', { mark: (chunks) => <mark>{chunks}</mark> })}
            </h3>
            {initialDescription !== null && (
              <RichTextEditor
                initialContent={initialDescription}
                placeholder={t('writeSth')}
                onChange={setDescriptions}
              />
            )}
            <span className={style.caption}>{t('descriptionVisibleInfo')}</span>
          </Card>
        
        <Card className={style.section}>
          <h3>
            {t.rich('activeStatus', { mark: (chunks) => <mark>{chunks}</mark> })}
          </h3>
          <div className={style.statusSelect}>
            <Tag
              selected={formData.status === "ADOPTED"}
              onClick={() => handleInputChange('status', "ADOPTED")}
            >
              {t('statusOwned')}
            </Tag>

            <Tag
              selected={formData.status === "RESERVED"}
              onClick={() => handleInputChange('status', "RESERVED")}
            >
              {t('statusQuarantine')}
            </Tag>

            <Tag
              selected={formData.status === "AVAILABLE"}
              onClick={() => handleInputChange('status', "AVAILABLE")}
            >
              {t('statusAvailable')}
            </Tag>
          </div>
        </Card>
        <Card className={style.section}>
          <h3>
            {t.rich('findAnimalParents', { mark: (chunks) => <mark>{chunks}</mark> })}
          </h3>
          <div className={style.familyTreeBlock}>
            <div 
              className={style.addParents} 
              onClick={() => setIsParentsAdd((prev) => !prev)} aria-disabled={parents.length == 2}
            >
              <Icon name='plus' />
            </div>

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
                  src={p.photos
                    ? p.photos
                    : ''} 
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
          title={t('parentsAdd')}
        >
            <AddAnimalParents 
              className={classNames(style.cardAddParents, { [style.show]: isParentsAdd })} 
              parents={parents}
              childAnimal={animal}
              setIsParentsAdd={setIsParentsAdd}
              onAddParent={(parent) => {
                const newParent = { ...parent, isNew: true };
                setParents((prev) => [...prev, newParent as Parent]);
                setIsParentsAdd(false); 
              }}
            />
        </Modal>
          <span className={style.caption}>{t('familyTreeInfo')}</span>
        </Card>

        <form onSubmit={handleSubmit} className={style.formContainer}>
            <div className={style.formActions}>
              <Button
                type="button"
                className={style.submit}
                onClick={onCancel}
                disabled={loading}
                label={t('cancelButton')}
              />

              <Button
                type="submit"
                className={style.submit}
                disabled={loading || characteristicsLoading || !hasChanged()}
                label={t('updateButton')}
              />
            </div>
          </form>
        </div>
    </div>
  );
};

export default AnimalUpdateForm;
