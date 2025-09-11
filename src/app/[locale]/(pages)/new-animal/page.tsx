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

type ParentOfParent = {
  name: string;
  photo: File;
  parentsOfWho: string;
}

type Parent = {
  name: string;
  gender: Gender;
  photos: File[];
  grandparents?: ParentOfParent[];
};

type Characteristic = {
  title: string,
  bool: boolean
}

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
  const [newParents, setNewParents] = useState<Parent[]>([]);

  const [characteristicsBoard, setCharacteristicsBoard] = useState<Characteristic[]>([]);




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
      { value: 'terrier', label: 'Terrier' }
    ],
    cat: [
      { value: 'british', label: 'British' }
    ]
  };

  const filteredSpeciesOpt = animalSpecies.filter(opt => opt.value !== selectSpeciesValue?.value)
  const filteredRaceOpt = selectSpeciesValue
  ? (animalRace[`${selectSpeciesValue.value}`] || []).filter(
      (opt) => opt.value !== selectRaceValue?.value
    )
  : [];

  useEffect(() => {
    const mappedParents: Parent[] = [
      // First main parent
      {
        name: parents[0]?.name || '',
        gender: parents[0]?.gender || Gender.MALE,
        photos: parents[0]?.photos || [],
        grandparents: []
      },
      // Second main parent  
      {
        name: parents[1]?.name || '',
        gender: parents[1]?.gender || Gender.MALE,
        photos: parents[1]?.photos || [],
        grandparents: []
      }
    ].filter(parent => parent.name);
  
    // Add grandparents WITHOUT duplicates
    parents.forEach((potentialGrandparent, index) => {
      // Skip first two parents (they're the main parents)
      if (index < 2) return;
  
      // Check if this is actually a grandparent with parent info
      if (potentialGrandparent.grandparents && potentialGrandparent.grandparents.length > 0) {
        potentialGrandparent.grandparents.forEach(gp => {
          const mainParentIndex = mappedParents.findIndex(p => p.name === gp.parentsOfWho);
          
          if (mainParentIndex !== -1) {
            // Check if this grandparent already exists to avoid duplicates
            const grandparentExists = mappedParents[mainParentIndex].grandparents!.some(
              existingGp => existingGp.name === potentialGrandparent.name
            );
            
            if (!grandparentExists) {
              mappedParents[mainParentIndex].grandparents!.push({
                name: potentialGrandparent.name,
                photo: potentialGrandparent.photos[0] || new File([], ''),
                parentsOfWho: gp.parentsOfWho
              });
            }
          }
        });
      }
    });
  
    setNewParents(mappedParents);
  }, [parents]);


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
      // Gender mapping
      const genderMap: Record<string, string> = {
        male: 'MALE',
        female: 'FEMALE'
      };
      const statusMap: Record<string, string> = {
        'Do adopcji': 'AVAILABLE',
        'Ma właściciela': 'ADOPTED',
        'Kwarantanna': 'RESERVED'
      };
  
      // Tworzymy FormData
      const formData = new FormData();
      
      // Dodajemy podstawowe dane
      formData.append('name', name);
      formData.append('species', String(selectSpeciesValue?.value ?? ''));
      formData.append('breed', String(selectRaceValue?.value ?? ''));
      formData.append('gender', genderMap[gender]);
      formData.append('size', 'SMALL');
      formData.append('birth_date', '2019-05-19');
      formData.append('status', statusMap[status]);
      formData.append('price', "2100");
      formData.append('descriptions', descriptions);
      formData.append('city', "Krakow");
      formData.append('location', JSON.stringify({
        type: "Point",
        coordinates: [20.673144511006825, 51.59228169182775]
      }));
  
      // Główne zdjęcie
      if (photos.length > 0) {
        const base64 = await fileToBase64(photos[0]);
        formData.append('image', base64);
      }
  
      // Galeria zdjęć - TABLICA OBIEKTÓW Z BASE64 (BEZ JSON.stringify!)
      const galleryWithBase64 = await Promise.all(
        photos.map(async (photo) => {
          const base64 = await fileToBase64(photo);
          return {
            image: base64
          };
        })
      );
  
      // Dodaj galerię jako ARRAY (nie string!)
      galleryWithBase64.forEach((item, index) => {
        formData.append(`gallery[${index}][image]`, item.image);
      });
  
      // Dodajemy charakterystyki - jako ARRAY
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
  
      // Dodajemy rodziców (jeśli istnieją) - jako JSON string (jeśli backend tego oczekuje)
      if (newParents.length > 0) {
        formData.append('parents', JSON.stringify(newParents));
      }
  
      // DEBUG: Sprawdź strukturę
      console.log('Gallery data:', galleryWithBase64);
      console.log('Characteristics data:', characteristicsBoard);
  
      // Wywołanie API z FormData
      const res = await AnimalsApi.createNewAnimal(formData);
      console.log('New animal created:', res);
      toast.success("Animal created");
  
      // Resetowanie formularza
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
            <div className={style.addParents} onClick={() => setIsParentsAdd((prev) => !prev)}>
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
                  src={p.photos && p.photos.length > 0 ? URL.createObjectURL(p.photos[0]) : ''} 
                  draggable={false} 
                  alt="parent_photo"
                />
                <p>{p.name}</p>
              </div>
            ))}
          </div>

            <AddAnimalParents 
              className={classNames(style.cardAddParents, { [style.show]: isParentsAdd })} 
              parents={parents}
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


  // const handleSubmit = async () => {
  
  //   console.log('Mapped parents:', newParents);
  //   try {
  //     // Gender mapping
  //     const genderMap: Record<string, string> = {
  //       male: 'MALE',
  //       female: 'FEMALE'
  //     };
  //     const statusMap: Record<string, string> = {
  //       'Do adopcji': 'AVAILABLE',
  //       'Ma właściciela': 'ADOPTED',
  //       'Kwarantanna': 'RESERVED'
  //     };

  //     const base64Gallery = await Promise.all(photos.map(fileToBase64));

  //     const base64GalleryWithOrder = base64Gallery.map((img) => ({
  //       image: img,
  //     }));
  

  //     const characteristicsBoard: Characteristic[] = Object.entries(characteristics.dog).map(
  //       ([key, value]) => ({
  //         title: value, // наприклад "Akceptuje koty"
  //         bool: selectedCharacteristics.includes(key) // true якщо юзер вибрав
  //       })
  //     );
  //     console.log("image: ", photos[0])
  //     console.log("gallery: ", photos)

  //     const res = await AnimalsApi.createNewAnimal({
  //       name: name,
  //       image: photos[0],
  //       gallery: photos,
  //       species: String(selectSpeciesValue?.value ?? ''),
  //       breed: String(selectRaceValue?.value ?? ''),
  //       gender: genderMap[gender],
  //       size: 'SMALL',
  //       birth_date: '2019-05-19',
  //       status: statusMap[status],
  //       price: "2100",
  //       descriptions: descriptions, 
  //       city: "Krakow",
  //       location: {
  //         type: "Point",
  //         coordinates: [
  //             20.673144511006825,
  //             51.59228169182775
  //         ]
  //       },
  //       characteristicBoard: characteristicsBoard,
  //       parents: newParents
  //     });
  //     console.log({
  //       name: name,
  //       image: base64Gallery[0],
  //       gallery: base64GalleryWithOrder,
  //       species: String(selectSpeciesValue?.value ?? ''),
  //       breed: String(selectRaceValue?.value ?? ''),
  //       gender: genderMap[gender],
  //       size: 'SMALL',
  //       birth_date: '2019-05-19',
  //       status: statusMap[status],
  //       price: "2100",
  //       descriptions: descriptions, 
  //       city: "Krakow",
  //       location: {
  //         type: "Point",
  //         coordinates: [
  //             20.673144511006825,
  //             51.59228169182775
  //         ]
  //       },
  //       characteristicBoard: characteristicsBoard,
  //       parents: newParents
  //     })
  //     console.log('New animal created:', res);
  //     toast.success("Animal created")

  //     setName('');
  //     setGender(Gender.MALE);
  //     setStatus('');
  //     setHasMetrics(false);
  //     setPhotos([]);
  //     setSelectSpeciesValue(null);
  //     setSelectRaceValue(null);
  //     setSelectedCharacteristics([]);
  //     setParents([])
  //     setNewParents([])
  //     setIsParentsAdd(false)
  //     setDescriptions('')
      
  //   } catch (err: any) {
  //     console.error('Failed to create animal:', err.response?.data || err);
  //     toast.error("Failed to create animal")
  //   }
  // };