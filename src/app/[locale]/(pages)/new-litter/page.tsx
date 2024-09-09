'use client';

import React, { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  Button,
  Card,
  Checkbox,
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

import style from './NewLitterPage.module.scss';

const NewLitterPage = () => {
  const t = useTranslations();

  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');

  const handleSubmit = () => {
    console.log('submit');
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
          <span className={style.caption}>Gatunek i rasa, którą obejmuje ten miot.</span>
        </Card>
        {/* BASIC DATA */}

        {/* DESCRIPTION */}
        <Card className={style.section}>
          <h3>
            Krótki <mark>opis</mark> miotu
          </h3>

          <Textarea
            className={style.textarea}
            label='Krótki opis (opcjonalnie)'
            placeholder={'Opisz krótko miot...'}
            value={description}
            onChangeText={setDescription}
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
            value={date}
            onChangeText={setDate}
          />
        </Card>
        {/* DATE */}

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
          </div>

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
