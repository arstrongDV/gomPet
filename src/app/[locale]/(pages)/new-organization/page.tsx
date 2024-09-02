'use client';

import React, { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
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
import { OrganizationType } from 'src/constants/types';

import style from './NewOrganizationPage.module.scss';

const NewOrganizationPage = () => {
  const t = useTranslations();
  const editorRef = useRef(null);

  const [type, setType] = useState<OrganizationType | null>(OrganizationType.BREEDING);
  const [logo, setLogo] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const handleSubmit = () => {
    if (editorRef.current) {
      JSON.stringify(editorRef.current);
    }
  };

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
              checked={type === OrganizationType.ANIMAL_SHELTER}
              onClick={() => setType(OrganizationType.ANIMAL_SHELTER)}
            />
            <Checkbox
              id='type-breeding'
              label={'Hodowla'}
              checked={type === OrganizationType.BREEDING}
              onClick={() => setType(OrganizationType.BREEDING)}
            />
            <Checkbox
              id='type-association'
              label={'Fundacja'}
              checked={type === OrganizationType.FUND}
              onClick={() => setType(OrganizationType.FUND)}
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
              setFile={setLogo}
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
        {type === OrganizationType.BREEDING && (
          <Card className={style.section}>
            <h3>
              Szczegóły <mark>hodowli</mark>
            </h3>

            <div className={style.flexRow}>
              <Select
                label={'Gatunek'}
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
          </Card>
        )}
        {/* BREEDING DETAILS */}

        {/* DESCRIPTION */}
        <Card className={style.section}>
          <h3>
            <mark>Opisz</mark> swoją działalność
          </h3>
          <RichTextEditor placeholder={'Napisz coś...'} />
          <span className={style.caption}>To będzie opisem Twojego profilu.</span>
        </Card>
        {/* DESCRIPTION */}

        {/* LOCATION */}
        <Card className={style.section}>
          <h3>
            Wskaż <mark>lokalizację</mark>, w której działasz
          </h3>

          <span className={style.caption}>
            Możesz wyszukać lokalizację z pomocą Google Maps lub wypełnić pola ręcznie.
          </span>

          <div className={style.location}>
            <div className={style.inputs}>
              <Input
                id='address'
                name='address'
                label={'Adres'}
                placeholder={'Wpisz ulicę i numer budynku'}
              />
              <Input
                id='city'
                name='city'
                label={'Miasto'}
                placeholder={'Wpisz miasto'}
                required
              />
              <Input
                id='zip-code'
                name='zip-code'
                label={'Kod pocztowy'}
                placeholder={'Wpisz kod pocztowy'}
                required
              />
            </div>
          </div>
        </Card>
        {/* LOCATION */}

        <Button
          className={style.submit}
          label={'Utwórz profil organizacji'}
          onClick={handleSubmit}
        />
      </div>
    </>
  );
};

export default NewOrganizationPage;
