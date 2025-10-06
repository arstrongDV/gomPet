'use client';
import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Checkbox, Input, Select } from 'src/components';
import useAnimalInfo from 'src/components/hooks/useAnimalInfo';
import { OptionType } from 'src/components/layout/Forms/Select';
import { Params } from 'src/constants/params';
import { AnimalAge, AnimalSize, AnimalSpecies, BREED, Gender } from 'src/constants/types';
import { useRouter } from 'src/navigation';
import { toSelectOption } from 'src/utils/helpers';

import style from './AnimalFilters.module.scss';

type AnimalFiltersProps = {
  className?: string;
};

type AnimalKey = string;

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

const AnimalFilters = ({ className }: AnimalFiltersProps) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();
  const { characteristics } = useAnimalInfo();

  const organization = {
    SHELTER: t('common.organization.SHELTER'),
    FUND: t('common.organization.FUND'),
    BREEDER: t('common.organization.BREEDER')
  };

  const handleFilter = (filter: string, value: string, isArr = false) => {
    params.set(Params.PAGE, '1');

    if (isArr) {
      // Zmiana: używamy przecinka zamiast &
      const arr = params.get(filter)?.split(',') || [];
      if (arr.includes(value)) {
        arr.splice(arr.indexOf(value), 1);
        if (arr.length === 0) {
          params.delete(filter);
        } else {
          params.set(filter, arr.join(',')); // Zmiana: join z przecinkiem
        }
      } else {
        arr.push(value);
        params.set(filter, arr.join(',')); // Zmiana: join z przecinkiem
      }
    } else {
      if (params.get(filter) === value || !value || value === '0') {
        params.delete(filter);
      } else {
        params.set(filter, value);
      }
    }
    router.push(`?${params.toString()}`);
  };

  const clearAllFilters = useCallback(() => {
    router.push('?page=1');
  }, [params]);

  const [city, setCity] = useState(searchParams.get(Params.LOCATION) ?? '');
  const [range, setRange] = useState(searchParams.get(Params.RANGE) ?? '');
  const [name, setName] = useState(searchParams.get(Params.NAME) ?? '');
  const [minAge, setMinAge] = useState(searchParams.get(Params.AGE_MIN) ?? '');
  const [maxAge, setMaxAge] = useState(searchParams.get(Params.AGE_MAX) ?? '');

  return (
    <div className={classNames(style.filters, className)}>
      <div className={style.row}>
        {Object.entries(organization).map(([key, value]) => (
          <Checkbox
            key={key}
            id={key}
            className={style.checkbox}
            checked={searchParams.get(Params.ORGANIZATION_TYPE)?.split(',').includes(key)}
            onChange={() => handleFilter(Params.ORGANIZATION_TYPE, key, true)}
            label={value}
          />
        ))}
      </div>
      <div className={style.inputs}>
        <Input
          label={t('pages.animals.filters.location')}
          placeholder={t('pages.animals.filters.locationPlaceholder')}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onBlur={() => {if(city !== '') handleFilter(Params.LOCATION, city)}}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleFilter(Params.LOCATION, city);
          }}
        />
        <Input
          label={`${t('pages.animals.filters.range')} (km)`}
          placeholder={t('pages.animals.filters.rangePlaceholder')}
          value={range}
          onChange={(e) => setRange(e.target.value)}
          onBlur={() => {if(range !== '') handleFilter(Params.RANGE, range)}}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleFilter(Params.RANGE, range);
          }}
        />
        <Input
          label={t('pages.animals.filters.name')}
          placeholder={t('pages.animals.filters.namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => {if(name !== '') handleFilter(Params.NAME, name)}}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleFilter(Params.NAME, name);
          }}
        />
        <Select
          label={t('pages.animals.filters.gender')}
          options={[toSelectOption(Gender.MALE), toSelectOption(Gender.FEMALE)]}
          value={toSelectOption(searchParams.get(Params.GENDER))}
          onChange={(value: OptionType) => handleFilter(Params.GENDER, value ? String(value.value).toUpperCase() : '')}
          isClearable
        />
        <Select
          label={t('pages.animals.filters.species')}
          options={[toSelectOption(AnimalSpecies.DOG), toSelectOption(AnimalSpecies.CAT)]}
          value={toSelectOption(searchParams.get(Params.SPECIES))}
          onChange={(value: OptionType) => handleFilter(Params.SPECIES, value ? String(value.value) : '')}
          isClearable
        />
        <Select
          label={t('pages.animals.filters.breed')}
          options={animalRace.dog}  // <-- pass directly
          value={animalRace.dog.find(opt => opt.value === searchParams.get(Params.BREED)) || null}
          onChange={(value: OptionType) => handleFilter(Params.BREED, value ? String(value.value) : '')}
          isClearable
          isSearchable
        />
        {/* TODO: przebudować na od - do */}
        <section className={style.ageInputs}>
          <Input 
            type="number"
            label={`${t('pages.animals.filters.age')} (min)`}
            placeholder='0'
            value={minAge}
            onChange={(e) => setMinAge(e.target.value)}
            onBlur={() => {
              if(minAge !== '') handleFilter(Params.AGE_MIN, minAge);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleFilter(Params.AGE_MIN, minAge);
            }}
          />
          <Input 
            type="number"
            label={`${t('pages.animals.filters.age')} (max)`}
            placeholder='100'
            value={maxAge}
            onChange={(e) => setMaxAge(e.target.value)}
            onBlur={() => {
              if(maxAge !== '') handleFilter(Params.AGE_MAX, maxAge);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleFilter(Params.AGE_MAX, maxAge);
            }}
          />
        </section>
        {/* <Select
          label={t('pages.animals.filters.age')}
          options={[toSelectOption(AnimalAge.OLD), toSelectOption(AnimalAge.YOUNG)]}
          value={toSelectOption(searchParams.get(Params.AGE))}
          onChange={(value: OptionType) => handleFilter(Params.AGE, value ? String(value.value) : '')}
          isClearable
        /> */}

        <Select
          label={t('pages.animals.filters.size')}
          options={[toSelectOption(AnimalSize.SMALL), toSelectOption(AnimalSize.MEDIUM), toSelectOption(AnimalSize.LARGE)]}
          value={toSelectOption(searchParams.get(Params.SIZE))}
          onChange={(value: OptionType) => handleFilter(Params.SIZE, value ? String(value.value).toUpperCase() : '')}
          isClearable
        />
      </div>
      <div className={style.characteristics}>
        {Object.entries(characteristics.dog).map(([key, value]) => (
          <Checkbox
            key={key}
            id={key}
            className={style.checkbox}
            // POPRAWKA: split(',') zamiast split('&')
            checked={searchParams.get(Params.CHARACTERISTICS)?.split(',').includes(value)}
            onChange={() => handleFilter(Params.CHARACTERISTICS, value, true)}
            label={value}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimalFilters;
