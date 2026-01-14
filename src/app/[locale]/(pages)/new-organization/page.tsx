'use client';

import React, { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  AvatarCropper,
  Button,
  Card,
  Checkbox,
  ImageInput,
  Input,
  PhoneInput,
  RichTextEditor,
  SectionHeader,
  Select,
  Textarea
} from 'src/components';
import { Location, OrganizationType } from 'src/constants/types';

// import LocationInput from './components/LocationInput';
import LocationInput from './components/LocationInput';

import style from './NewOrganizationPage.module.scss';
import type { OptionType } from 'src/components/layout/Forms/Select';
import toast from 'react-hot-toast';
import { OrganizationsApi } from 'src/api';
import { redirect } from 'next/navigation';
import { Routes } from 'src/constants/routes';
import { useRouter } from 'next/navigation';
import Animals from '../(organizations)/(containers)/organizations/[id]/Tabs/Animals';
import AnimalSelect from 'src/components/layout/Forms/Select/AnimalSelect';

// type RichTextEditorRef = {
//   getContent: () => string;
// };

const animalSpecies: {value: string, label: string}[] = [
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
  ]
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

type AnimalKey = string;

const NewOrganizationPage = () => {
  const t = useTranslations();
  const editorRef = useRef(null);
  const router = useRouter();
  const { push } = router;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileToCrop, setFileToCrop] = useState<File | null>(null);

  //DATA
  const [type, setType] = useState<string>("BREEDER"); //<OrganizationType> OrganizationType.BREEDING
  const [logo, setLogo] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [description, setDescription] = useState<string>("")
  const [location, setLocation] = useState<Location>({
    lat: '',
    lng: '',
    city: '',
    street: '',
    house_number: '',
    zip_code: ''
  });

  const [race, setRace] = useState<OptionType>(null)
  const [breed, setBreed] = useState<OptionType>(null)

  // const SaveEditText = (content: string) => {
  //   console.log("Editor content:", content);
  // }
  const handleSubmit = async() => {
    // if (editorRef.current) {
    //   JSON.stringify(editorRef.current);
    //   const content = editorRef.current.getContent(); // Assuming getContent() gives the content from the editor
    //   SaveEditText(content);
    // }

    if (!logo) {
      toast.error("Proszę dodać zdjecie");
      return;
    }

    setIsLoading(true);
  try{
      const logoBase64 = await fileToBase64(logo);

      const address = {
        street: location.street,
        house_number: Number(location.house_number),
        city: location.city,
        zip_code: location.zip_code,
        lat: Number(location.lat),
        lng: Number(location.lng),
        location: {
          type: "Point",
          coordinates: [
            Number(location.lng),
            Number(location.lat)
          ]
        },
        species: [2]
      }

      const payload = {
        type: type,
        image: logoBase64,
        name: name,
        email: email,
        phone: phoneNumber,
        description: description,
        address: address,
      };

      const res = await OrganizationsApi.addNewOrganization(payload);
      toast.success("Stworzono nową organizację!")
      console.log("res:", res)
      push(Routes.ORGANIZATION_PROFILE(res.data.id))
    }catch(err){
      console.log(err)
      // if(err?.response?.data.name[0]){
      //   console.log(err?.response?.data.name[0])
      //   toast.error(err?.response?.data.name[0]);
      // }
      toast.error("Bląd dowawania");
    }
    setIsLoading(false);
  };

  // const handleChange = (field: string, value: string) => {
  //   setLitterForm(prev => ({ ...prev, [field]: value }));
  // };

  return (
    <>
      <SectionHeader
        title={'Stwórz nowy profil'}
        subtitle={'Witamy w kreatorze profilu. Dostosuj go do własnych potrzeb'}
        margin
      />

      <div className={style.container}>
        {/* TYPE */}
        <Card className={style.section}>
          <h3>
            Wybierz <mark>rodzaj</mark> profilu
          </h3>

          <div className={style.flexRow}>
            <Checkbox
              id='type-animal-shelter'
              label={'Schronisko'}
              checked={type === "SHELTER"}
              onClick={() => setType("SHELTER")}
            />
            <Checkbox
              id='type-breeding'
              label={'Hodowla'}
              checked={type === "BREEDER"}
              onClick={() => setType("BREEDER")}
            />
            <Checkbox
              id='type-association'
              label={'Fundacja'}
              checked={type ==="FUND"}
              onClick={() => setType("FUND")}
            />
          </div>

          <span className={style.caption}>
            Każdy rodzaj profilu jest dostosowany do potrzeb organizacji, zatem wybierz go zgodnie ze swoją
            działalnością.
          </span>
        </Card>
        {/* TYPE */}

        {/* NAME AND LOGO */}
        <Card className={style.section}>
          <h3>
            Jak chcesz się <mark>prezentować</mark>?
          </h3>

          <div className={style.basicData}>
            <ImageInput
              label={'Logotyp organizacji'}
              file={logo}
              setFile={(file) => setFileToCrop(file)}
              onClear={() => setLogo(null)}
            />
            <Input
              id='organization-name'
              name='organization-name'
              label={'Nazwa organizacji'}
              placeholder={'Wpisz nazwę organizacji'}
              value={name}
              onChangeText={setName}
              required
            />
          </div>

          <span className={style.caption}>
            Nazwa organizacji będzie widoczna na stronie profilu. Dodaj logo, aby wyróżnić się na tle innych
            organizacji.
          </span>
        </Card>
        {/* NAME AND LOGO */}

        {/* CONTACT */}
        <Card className={style.section}>
          <h3>
            Jak się z Tobą <mark>skontaktować</mark>
          </h3>

          <div className={style.flexRow}>
            <Input
              id='email'
              name='email'
              label={'Email'}
              placeholder={'Wpisz adres email'}
              value={email}
              onChangeText={setEmail}
              required
            />

            <PhoneInput
              id='phone'
              name='phone'
              label={'Numer telefonu'}
              placeholder={'Wpisz numer telefonu'}
              value={phoneNumber}
              onChange={setPhoneNumber}
            />
          </div>
        </Card>
        {/* CONTACT */}

        {/* BREEDING DETAILS */}
        {type === "BREEDER" && (
          <Card className={style.section}>
            <h3>
              Szczegóły <mark>hodowli</mark>
            </h3>

            <div className={style.flexRow}>
              <Select
                label={'Gatunek'}
                options={animalSpecies}
                onChange={(opt: any) => setRace(opt)}
                value={race}
              />

              <Select
                label={'Rasa'}
                options={animalRace[race?.value as AnimalKey] || []}
                onChange={(opt: any) => setBreed(opt)}
                value={breed}
              />
              {/* <AnimalSelect handleChange={handleChange} /> */}
            </div>
          </Card>
        )}
        {/* BREEDING DETAILS */}

        {/* DESCRIPTION */}
        <Card className={style.section}>
          <h3>
            <mark>Opisz</mark> swoją działalność
          </h3>
         <RichTextEditor ref={editorRef} placeholder={'Napisz coś...'} onChange={setDescription} />
          <span className={style.caption}>To będzie opisem Twojego profilu.</span>
        </Card>
        {/* DESCRIPTION */}

        {/* LOCATION */}
        <Card className={style.section}>
          <h3>
            Wskaż <mark>lokalizację</mark>, w której działasz
          </h3>

          <span className={style.caption}>
            Możesz wyszukać lokalizację z pomocą Google Maps lub wypełnij pola ręcznie.
          </span>

          <LocationInput
            value={location}
            onChange={setLocation}
          />
        </Card>
        {/* LOCATION */}

        <Button
          className={style.submit}
          label={'Utwórz profil organizacji'}
          onClick={handleSubmit}
        />
      </div>

      <AvatarCropper
        src={fileToCrop}
        isOpen={!!fileToCrop}
        closeModal={() => setFileToCrop(null)}
        onCropSuccess={setLogo}
      />
    </>
  );
};

export default NewOrganizationPage;
