'use client';

import React, { ChangeEvent, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Button,
  Card,
  Input,
  SectionHeader,
  Select,
  Textarea
} from 'src/components';
import style from './NewLitterPage.module.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import { OrganizationsApi } from 'src/api';
import AnimalSelect from 'src/components/layout/Forms/Select/AnimalSelect';
import { OptionType } from 'dayjs';
import toast from 'react-hot-toast';
import { Routes } from 'src/constants/routes';

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'DRAFT', label: 'Draft' },
];

const NewLitterPage = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const orgId = searchParams.get('orgId');
  const router = useRouter();

  const [litterForm, setLitterForm] = useState({
    title: '',
    birth_date: '',
    description: '',
    species: '',
    breed: '',
    status: '',
    organization: orgId
  });

  const handleChange = (field: string, value: string) => {
    setLitterForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      console.log(litterForm);
      const res = await OrganizationsApi.postOrganizationLitters(litterForm);
      console.log(res);
      toast.success("Nowy miot dodany");

      if (orgId) {
        router.push(Routes.ORGANIZATION_PROFILE(orgId));
      }
      router.back()
    } catch (err) {
      console.log(err);
      toast.error("Błąd z dodawaniem miotu");
    }
  };

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
          <AnimalSelect handleChange={handleChange} />
          {/* <div className={style.flexRow}> */}
            {/* <Select
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
            /> */}
          {/* </div> */}
          <span className={style.caption}>Gatunek i rasa, którą obejmuje ten miot.</span>
        </Card>
        {/* BASIC DATA */}

        {/* DESCRIPTION */}
        <Card className={style.section}>
          <h3>
            Krótki <mark>Tytul</mark> 
          </h3>
          <Input
            id="title"
            name="title"
            className={style.titleInput}
            label="Tytul"
            placeholder="Wpisz tytuł"
            value={litterForm.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('title', e.target.value)}
            required
          />

          <h3>
            Krótki <mark>opis</mark> miotu
          </h3>
          <Textarea
            className={style.textarea}
            label='Krótki opis (opcjonalnie)'
            placeholder={'Opisz krótko miot...'}
            value={litterForm.description}
            onChangeText={(value: any) => handleChange('description', value)}
          />
        </Card>
        {/* DESCRIPTION */}

        {/* DATE */}
        <Card className={style.section}>
          <h3>
            Przewidywana <mark>data</mark> miotu
          </h3>

          <Input
            type='date'
            label='Kiedy pojawi się miot?'
            placeholder={'Opisz krótko miot...'}
            value={litterForm.birth_date}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('birth_date', e.target.value)}
          />
        </Card>
        {/* DATE */}

        {/* STATUS */}
        <Card className={style.section}>
          <h3>
            Aktualny <mark>status</mark>
          </h3>

          {/* <div className={style.statusSelect}>
            <Tag
              onClick={() => {}}
              selected={false}
            >
              Dostępne
            </Tag>
            <Tag
              onClick={() => {}}
              selected={false}
            >
              Wydane
            </Tag>
            <Tag
              onClick={() => {}}
              selected={true}
            >
              Można zarezerwować
            </Tag>
            <Tag
              onClick={() => {}}
              selected={false}
            >
              Brak miejsc do rezerwacji
            </Tag>
          </div> */}

          <Select 
              label="Status"
              options={statusOptions}
              value={statusOptions.find(opt => opt.value === litterForm.status) || null}
              onChange={(option: any) => handleChange('status', option?.value || '')}
          />

          <span className={style.caption}>Status jest widoczny w widoku profilu hodowli w zakładce “Mioty”.</span>
        </Card>
        {/* STATUS */}

        <Button
          className={style.submit}
          label={'Utwórz miot'}
          onClick={handleSubmit}
        />
      </div>
    </>
  );
};

export default NewLitterPage;
