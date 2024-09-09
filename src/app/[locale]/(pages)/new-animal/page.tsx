'use client';

import React, { useRef, useState } from 'react';
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

const NewAnimalPage = () => {
  const t = useTranslations();
  const editorRef = useRef(null);
  const { characteristics } = useAnimalInfo();

  const [type, setType] = useState<OrganizationType | null>(OrganizationType.BREEDING);
  const [name, setName] = useState<string>('');
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [hasMetrics, setHasMetrics] = useState<boolean>(false);
  const [photos, setPhotos] = useState<File[]>([]);

  const handleSubmit = () => {
    if (editorRef.current) {
      // JSON.stringify(editorRef.current);
    }

    console.log(photos);
  };

  console.log(photos);

  return (
    <>
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
              options={[
                {
                  value: 'dog',
                  label: 'Pies'
                }
              ]}
              onChange={() => {}}
              value={{
                value: 'cat',
                label: 'Kot'
              }}
            />

            <Select
              label={'Rasa'}
              options={[
                {
                  value: 'beagle',
                  label: 'Beagle'
                }
              ]}
              onChange={() => {}}
              value={{
                value: 'beagle',
                label: 'Beagle'
              }}
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
                checked={false}
                onChange={() => {}}
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
          <RichTextEditor placeholder={'Napisz coś...'} />
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
              onClick={() => {}}
              selected={false}
            >
              Ma właściciela
            </Tag>
            <Tag
              onClick={() => {}}
              selected={false}
            >
              Kwarantanna
            </Tag>
            <Tag
              onClick={() => {}}
              selected={true}
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
