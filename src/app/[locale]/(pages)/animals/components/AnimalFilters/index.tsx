'use client';
import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Checkbox, Input, Select } from 'src/components';
import useAnimalInfo from 'src/components/hooks/useAnimalInfo';
import { OptionType } from 'src/components/layout/Forms/Select';
import { Params } from 'src/constants/params';
import { Gender } from 'src/constants/types';
import { useRouter } from 'src/navigation';
import { toSelectOption } from 'src/utils/helpers';

import style from './AnimalFilters.module.scss';

type AnimalFiltersProps = {
  className?: string;
};

const AnimalFilters = ({ className }: AnimalFiltersProps) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();
  const { characteristics } = useAnimalInfo();

  const organization = {
    animal_shelter: t('common.organization.animal_shelter'),
    fund: t('common.organization.fund'),
    breeding: t('common.organization.breeding')
  };

  const handleFilter = (filter: string, value: string, isArr = false) => {
    params.set(Params.PAGE, '1');

    if (isArr) {
      const arr = params.get(filter)?.split('&') || [];
      if (arr.includes(value)) {
        arr.splice(arr.indexOf(value), 1);
        if (arr.length === 0) {
          params.delete(filter);
        } else {
          params.set(filter, arr.join('&'));
        }
      } else {
        arr.push(value);
        params.set(filter, arr.join('&'));
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

  return (
    <div className={classNames(style.filters, className)}>
      <div className={style.row}>
        {Object.entries(organization).map(([key, value]) => (
          <Checkbox
            key={key}
            id={key}
            className={style.checkbox}
            checked={searchParams.get(Params.ORGANIZATION_TYPE)?.split('&').includes(key)}
            onChange={() => handleFilter(Params.ORGANIZATION_TYPE, key, true)}
            label={value}
          />
        ))}
      </div>
      <div className={style.inputs}>
        <Input label={t('pages.animals.filters.location')} />
        <Input label={`${t('pages.animals.filters.range')} (km)`} />
        <Input label={t('pages.animals.filters.name')} />
        <Select
          label={t('pages.animals.filters.gender')}
          options={[toSelectOption(Gender.MALE), toSelectOption(Gender.FEMALE)]}
          value={toSelectOption(searchParams.get(Params.GENDER))}
          onChange={(value: OptionType) => handleFilter(Params.GENDER, value ? String(value.value) : '')}
          isClearable
        />
        <Select
          label={t('pages.animals.filters.species')}
          options={[toSelectOption('dog'), toSelectOption('cat')]}
          value={toSelectOption(searchParams.get(Params.SPECIES))}
          onChange={(value: OptionType) => handleFilter(Params.SPECIES, value ? String(value.value) : '')}
          isClearable
        />
        <Select
          label={t('pages.animals.filters.breed')}
          options={[toSelectOption('dog'), toSelectOption('cat')]}
          value={toSelectOption(searchParams.get(Params.BREED))}
          onChange={(value: OptionType) => handleFilter(Params.BREED, value ? String(value.value) : '')}
          isClearable
          isSearchable
        />
        {/* TODO: przebudować na od - do */}
        <Select
          label={t('pages.animals.filters.age')}
          options={[toSelectOption(Gender.MALE), toSelectOption(Gender.FEMALE)]}
          value={toSelectOption(searchParams.get(Params.AGE))}
          onChange={(value: OptionType) => handleFilter(Params.AGE, value ? String(value.value) : '')}
          isClearable
        />
        <Select
          label={t('pages.animals.filters.size')}
          options={[toSelectOption(Gender.MALE), toSelectOption(Gender.FEMALE)]}
          value={toSelectOption(searchParams.get(Params.SIZE))}
          onChange={(value: OptionType) => handleFilter(Params.SIZE, value ? String(value.value) : '')}
          isClearable
        />
      </div>
      <div className={style.characteristics}>
        {Object.entries(characteristics.dog).map(([key, value]) => (
          <Checkbox
            key={key}
            id={key}
            className={style.checkbox}
            checked={searchParams.get(Params.CHARACTERISTICS)?.split('&').includes(key)}
            onChange={() => handleFilter(Params.CHARACTERISTICS, key, true)}
            label={value}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimalFilters;
