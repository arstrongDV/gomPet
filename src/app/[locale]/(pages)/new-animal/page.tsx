'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  Button,
  Card,
  Checkbox,
  FileDropzone,
  Icon,
  ImageInput,
  Input,
  InputWrapper,
  PhoneInput,
  Pill,
  RichTextEditor,
  SectionHeader,
  Select,
  Tag,
  Textarea
} from 'src/components';
import useAnimalInfo from 'src/components/hooks/useAnimalInfo';
import { Gender, OrganizationType } from 'src/constants/types';

import PhotosOrganizer from './components/PhotosOrganizer';

import style from './NewAnimalPage.module.scss';
import { OptionType } from 'src/components/layout/Forms/Select';
import { AnimalsApi } from 'src/api';
import AddAnimalParents from './components/AddAnimalParents';
import classNames from 'classnames';
import toast from 'react-hot-toast';

// type ParentOfParent = {
//   name: string;
//   photo: File;
//   parentsOfWho: string;
// }

type Parent = {
  name: string;
  // gender: Gender;
  id: number
  relation: OptionType | string;
  photo?: string;
};

type AddParents = {
  // animal: number;
  parent: number;
  relation?: string | OptionType;
}

type Characteristic = {
  title: string,
  bool: boolean
}

type AnimalKey = string;

const NewAnimalPage = () => {
  const t = useTranslations();
  const editorRef = useRef(null);
  const { characteristics } = useAnimalInfo();

  const [type, setType] = useState<OrganizationType | null>(OrganizationType.BREEDING);
  const [name, setName] = useState<string>('');
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [status, setStatus] = useState<string>('Do adopcji');
  const [hasMetrics, setHasMetrics] = useState<boolean>(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [selectSpeciesValue, setSelectSpeciesValue] = useState<OptionType>(null);
  const [selectRaceValue, setSelectRaceValue] = useState<OptionType>(null);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>([]);
  const [descriptions, setDescriptions] = useState<string>("")
  const [isParentsAdd, setIsParentsAdd] = useState<boolean>(false);
  const [parents, setParents] = useState<Parent[]>([]);
  const [newParents, setNewParents] = useState<AddParents[]>([]);

  useEffect(() => {
    document.body.style.overflow = isParentsAdd ? 'hidden' : '';
  }, [isParentsAdd]);

  const animalSpecies = [
      {
        value: 'dog',
        label: 'Pies'
      },
      {
        value: 'cat',
        label: 'Kot'
      }
  ]
  
  const animalRace: Record<AnimalKey, { value: string; label: string }[]> = {
    dog: [
      { value: 'beagle', label: 'Beagle' },
      { value: 'terrier', label: 'Terrier' },
      { value: 'labrador', label: 'Labrador' },
    ],
    cat: [
      { value: 'british', label: 'British Shorthair' },
      { value: 'siamese', label: 'Siamese' },
      { value: 'persian', label: 'Persian' },
    ],
    other: [
      { value: 'other', label: 'Other' },
    ],
  };
  const genderMap: Record<string, string> = {
    male: 'MALE',
    female: 'FEMALE'
  };
  const statusMap: Record<string, string> = {
    'Do adopcji': 'AVAILABLE',
    'Ma właściciela': 'ADOPTED',
    'Kwarantanna': 'RESERVED'
  };

  const filteredSpeciesOpt = animalSpecies.filter(opt => opt.value !== selectSpeciesValue?.value)
  const filteredRaceOpt = selectSpeciesValue
  ? (animalRace[`${selectSpeciesValue.value}`] || []).filter(
      (opt) => opt.value !== selectRaceValue?.value
    )
  : [];

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // np. "data:image/jpeg;base64,/9j/4AAQSk..."
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }


  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      const galleryWithBase64 = await Promise.all(
        photos.map(async (photo) => {
          const base64 = await fileToBase64(photo);
          return {
            image: base64
          };
        })
      );
  
      formData.append('name', name);
      formData.append('species', String(selectSpeciesValue?.value ?? ''));
      formData.append('breed', String(selectRaceValue?.value ?? ''));
      formData.append('gender', genderMap[gender]);
      formData.append('size', 'SMALL');
      formData.append('birth_date', '2025-05-19');
      formData.append('status', statusMap[status]);
      formData.append('price', "2100");
      formData.append('descriptions', descriptions);
      formData.append('city', "Krakow");
      formData.append('location', JSON.stringify({
        type: "Point",
        coordinates: [20.673144511006825, 51.59228169182775]
      }));
      if (photos.length > 0) {
        const base64 = await fileToBase64(photos[0]);
        formData.append('image', base64);
      }
      galleryWithBase64.forEach((item, index) => {
        formData.append(`gallery[${index}][image]`, item.image);
      });

      const characteristicsBoard = Object.entries(characteristics.dog).map(
        ([key, value]) => ({
          title: value,
          bool: selectedCharacteristics.includes(key)
        })
      );
      characteristicsBoard.forEach((char, index) => {
        formData.append(`characteristicBoard[${index}][title]`, char.title);
        formData.append(`characteristicBoard[${index}][bool]`, char.bool.toString());
      });

  
      console.log([...formData.entries()]);
      console.log("descriptions: ", descriptions);
      console.log("newParents: ", JSON.stringify(newParents))
      

      // if (newParents.length > 0) {
      //   formData.append('parents', JSON.stringify(newParents));
      // }
      
      const animals_res = await AnimalsApi.createNewAnimal(formData);
      console.log("animals_res: ", animals_res);
      // console.log("parents_res: ", parents_res);



      if (animals_res.status === 201 || animals_res.statusText === "Created") {
        const animalId = animals_res.data?.id;
        
        if (animalId && parents.length > 0) {
          const parentsToAdd = parents.slice(0, 2);
          let successCount = 0;
          
          for (const [index, parent] of parentsToAdd.entries()) {
            try {
              const parentData = {
                animal: animalId,
                parent: parent.id,
                relation: typeof parent.relation === 'object' ? parent.relation?.value : parent.relation
              };
              
              console.log(`Adding parent ${index + 1}:`, parentData);
              
              await AnimalsApi.addAnimalParents(parentData);
              successCount++;
              console.log(`Parent ${index + 1} added successfully`);
              
            } catch (parentError) {
              console.error(`Failed to add parent ${index + 1}:`, parentError);
              toast.error("Failed to add parent")
            }
          }
          
          if (successCount === 0) {
            toast.error("Animal created but failed to add any parents");
          } else if (successCount < parentsToAdd.length) {
            toast.error(`Animal created, added ${successCount} of ${parentsToAdd.length} parents`);
          } else {
            toast.success("Animal created with all parents");
          }
        }
      }
  

      toast.success("Animal created");
      setName('');
      setGender(Gender.MALE);
      setStatus('');
      setHasMetrics(false);
      setPhotos([]);
      setSelectSpeciesValue(null);
      setSelectRaceValue(null);
      setSelectedCharacteristics([]);
      setParents([]);
      setNewParents([]);
      setIsParentsAdd(false);
      setDescriptions('');
    } catch (err: any) {
      console.error('Failed to create animal:', err.response?.data || err);
      toast.error("Failed to create animal");
    }
  };

  return (
    <>
      {isParentsAdd && (
        <div className={style.backdrop} onClick={() => setIsParentsAdd(false)} />
      )}

      <SectionHeader
        title={'Dodaj zwierzaka'}
        subtitle={'Zaprezentuj zwierzę na platformie'}
        margin
      />

      <div className={style.container}>
        {/* BASIC DATA */}
        <Card className={style.section}>
          <h3>
            Informacje <mark>podstawowe</mark>
          </h3>

          <div className={style.fullWidth}>
            <Input
              id='animal-name'
              name='animal-name'
              label={'Nazwij zwierzaka'}
              placeholder={'Jak się wabi?'}
              value={name}
              onChangeText={setName}
              required
            />
          </div>

          <div className={style.flexRow}>
            <Select
              label={'Gatunek'}
              options={filteredSpeciesOpt}
              onChange={setSelectSpeciesValue}
              value={selectSpeciesValue}
              // isClearable
            />

            <Select
              label={'Rasa'}
              options={filteredRaceOpt}
              onChange={setSelectRaceValue}
              value={selectRaceValue}
              // isClearable
            />
          </div>

          <InputWrapper label={'Płeć'}>
            <div className={style.genderSelect}>
              <Tag
                selected={gender === Gender.MALE}
                onClick={() => setGender(Gender.MALE)}
              >
                On
                <Icon name='genderMale' />
              </Tag>
              <Tag
                selected={gender === Gender.FEMALE}
                onClick={() => setGender(Gender.FEMALE)}
              >
                Ona
                <Icon name='genderFemale' />
              </Tag>
            </div>
          </InputWrapper>

          <Checkbox
            id='animal-has-metrics'
            label={'Czy zwierzak ma metrykę?'}
            checked={hasMetrics}
            onClick={() => setHasMetrics((prev) => !prev)}
          />
        </Card>
        {/* BASIC DATA */}

        {/* IMAGES */}
        <Card className={style.section}>
          <h3>
            Zaprezentuj <mark>zdjęcia</mark>
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
            Najlepiej na platformie będą wyglądać zdjęcia w formacie 4:3. Zdjęcia nie mogą przekraczać 5 MB. Dozwolone
            formaty to .png, .jpg, .jpeg
          </span>
        </Card>
        {/* IMAGES */}

        {/* CHARACTERISTICS */}
        <Card className={style.section}>
          <h3>
            <mark>Cechy</mark> charakterystyczne
          </h3>

          <div className={style.characteristics}>
            {Object.entries(characteristics.dog).map(([key, value]) => (
              <Checkbox
                key={key}
                id={key}
                className={style.checkbox}
                checked={selectedCharacteristics.includes(key)}
                onChange={() => {
                  setSelectedCharacteristics((prev) =>
                    prev.includes(key)
                      ? prev.filter((item) => item !== key)
                      : [...prev, key] 
                  );
                }}
                label={value}
              />
            ))}
          </div>

        </Card>
        {/* CHARACTERISTICS */}

        {/* DESCRIPTION */}
        <Card className={style.section}>
          <h3>
            <mark>Opisz</mark> zwierzaka
          </h3>
          <RichTextEditor placeholder={'Napisz coś...'} onChange={setDescriptions} />
          <span className={style.caption}>Opis będzie widoczny w jego profilu.</span>
        </Card>
        {/* DESCRIPTION */}

        {/* STATUS */}
        <Card className={style.section}>
          <h3>
            Aktualny <mark>status</mark>
          </h3>

          <div className={style.statusSelect}>
            <Tag
              onClick={() => {setStatus('Ma właściciela')}}
              selected={status === 'Ma właściciela'}
            >
              Ma właściciela
            </Tag>
            <Tag
              onClick={() => {setStatus('Kwarantanna')}}
              selected={status === 'Kwarantanna'}
            >
              Kwarantanna
            </Tag>
            <Tag
              onClick={() => {setStatus('Do adopcji')}}
              selected={status === 'Do adopcji'}
            >
              Do adopcji
            </Tag>
          </div>

          <span className={style.caption}>Status jest widoczny w widoku profilu zwierzaka.</span>
        </Card>
        {/* STATUS */}

        {/* STATUS */}
        <Card className={style.section}>
          <h3>
            Znajdź <mark>rodzinę</mark> zwierzaka
          </h3>

          <div className={style.familyTreeBlock}>

            <div className={style.addParents} onClick={() => setIsParentsAdd((prev) => !prev)} aria-disabled={parents.length == 2}>
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
                  src={p.photo ? p.photo : ''} 
                  draggable={false} 
                  alt="parent_photo"
                />
                <p>{p.name}</p>
              </div>
            ))}
          </div>

            <AddAnimalParents 
              className={classNames(style.cardAddParents, { [style.show]: isParentsAdd })} 
              selectSpeciesValue={selectSpeciesValue}
              onAddParent={(parent) => {
                setParents((prev) => [...prev, parent]);
                setIsParentsAdd(false); 
              }}
          />
          <span className={style.caption}>Posłuży to do wyświetlenia drzewa genealogicznego zwierzęcia.</span>
        </Card>
        {/* STATUS */}

        <Button
          className={style.submit}
          label={'Dodaj zwierzaka'}
          onClick={handleSubmit}
        />
      </div>
    </>
  );
};

export default NewAnimalPage;