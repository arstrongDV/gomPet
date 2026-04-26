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
import { Location } from 'src/constants/types';

import LocationInput from './components/LocationInput';

import style from './NewOrganizationPage.module.scss';
import type { OptionType } from 'src/components/layout/Forms/Select';
import toast from 'react-hot-toast';
import { OrganizationsApi } from 'src/api';
import { Routes } from 'src/constants/routes';
import { useRouter } from 'next/navigation';
import SpeciesSelect from './components/SpeciesSelect';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

const NewOrganizationPage = () => {
  const t = useTranslations('pages.newOrganization');
  const editorRef = useRef(null);
  const router = useRouter();
  const { push } = router;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileToCrop, setFileToCrop] = useState<File | null>(null);

  const [type, setType] = useState<string>("BREEDER");
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
    zip_code: '',
    coordinates: ['', '']
  });

  const [speciesValue, setSelectSpeciesValue] = useState<Array<string | number>>([]);

  const handleChange = (selectedOptions: OptionType[]) => {
    const speciesIds = selectedOptions ? selectedOptions.map(opt => opt?.value) : [];
    setSelectSpeciesValue(speciesIds as any);
  };

  const isSubmitDisabled =
    !logo ||
    !name.trim() ||
    !email.trim() ||
    !location.city ||
    !location.street ||
    !location.house_number ||
    !location.zip_code ||
    (type === 'BREEDER' && speciesValue.length === 0) ||
    isLoading;

  const handleSubmit = async() => {
    if (!logo) {
      toast.error(t('toast.missingLogo'));
      return;
    }

    setIsLoading(true);
    try {
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
        species: speciesValue
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
      toast.success(t('toast.success'));
      push(Routes.ORGANIZATION_PROFILE(res.data.id));
      return;
    } catch(err) {
      console.error(err);
      toast.error(t('toast.error'));
    }
    setIsLoading(false);
  };

  return (
    <>
      <SectionHeader
        title={t('header.title')}
        subtitle={t('header.subtitle')}
        margin
      />

      <div className={style.container}>
        {/* TYPE */}
        <Card className={style.section}>
          <h3>{t('type.heading')}</h3>

          <div className={style.flexRow}>
            <Checkbox
              id='type-animal-shelter'
              label={t('type.shelter')}
              checked={type === "SHELTER"}
              onClick={() => setType("SHELTER")}
            />
            <Checkbox
              id='type-breeding'
              label={t('type.breeder')}
              checked={type === "BREEDER"}
              onClick={() => setType("BREEDER")}
            />
            <Checkbox
              id='type-association'
              label={t('type.fund')}
              checked={type === "FUND"}
              onClick={() => setType("FUND")}
            />
          </div>

          <span className={style.caption}>{t('type.caption')}</span>
        </Card>

        {/* NAME AND LOGO */}
        <Card className={style.section}>
          <h3>{t('presentation.heading')}</h3>

          <div className={style.basicData}>
            <ImageInput
              label={t('presentation.logoLabel')}
              file={logo}
              setFile={(file) => setFileToCrop(file)}
              onClear={() => setLogo(null)}
            />
            <Input
              id='organization-name'
              name='organization-name'
              label={t('presentation.nameLabel')}
              placeholder={t('presentation.namePlaceholder')}
              value={name}
              onChangeText={setName}
              required
            />
          </div>

          <span className={style.caption}>{t('presentation.caption')}</span>
        </Card>

        {/* CONTACT */}
        <Card className={style.section}>
          <h3>{t('contact.heading')}</h3>

          <div className={style.flexRow}>
            <Input
              id='email'
              name='email'
              label={t('contact.emailLabel')}
              placeholder={t('contact.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              required
            />

            <PhoneInput
              id='phone'
              name='phone'
              label={t('contact.phoneLabel')}
              placeholder={t('contact.phonePlaceholder')}
              value={phoneNumber}
              onChange={setPhoneNumber}
            />
          </div>
        </Card>

        {/* BREEDING DETAILS */}
        {type === "BREEDER" && (
          <Card className={style.section}>
            <h3>{t('breedingDetails.heading')}</h3>

            <div className={style.flexRow}>
              <SpeciesSelect handleChange={handleChange} />
            </div>
          </Card>
        )}

        {/* DESCRIPTION */}
        <Card className={style.section}>
          <h3>{t('description.heading')}</h3>
          <RichTextEditor ref={editorRef} placeholder={t('description.placeholder')} onChange={setDescription} />
          <span className={style.caption}>{t('description.caption')}</span>
        </Card>

        {/* LOCATION */}
        <Card className={style.section}>
          <h3>{t('location.heading')}</h3>

          <span className={style.caption}>{t('location.caption')}</span>

          <LocationInput
            value={location}
            onChange={setLocation}
          />
        </Card>

        <Button
          className={style.submit}
          label={t('submit')}
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          isLoading={isLoading}
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
