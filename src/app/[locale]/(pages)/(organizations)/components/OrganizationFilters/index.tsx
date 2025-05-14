'use client';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
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

import style from './OrganizationFilters.module.scss';

type OrganizationFiltersProps = {
  className?: string;
  needFullFilters?: boolean;
};

const OrganizationFilters = ({ className, needFullFilters }: OrganizationFiltersProps) => {
  
  const t = useTranslations();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();

  const [showFullFilters, setShowFullFilters] = useState(false); 
  useEffect(() => {
    if (needFullFilters) setShowFullFilters(true);
  }, [needFullFilters]);

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
      {showFullFilters ? (
        <div className={style.inputs}>
          <Input
            label={t('pages.organizations.filters.location')}
            placeholder={t('pages.organizations.filters.locationPlaceholder')}
          />
          <Input
            label={`${t('pages.organizations.filters.range')} (km)`}
            placeholder={t('pages.organizations.filters.rangePlaceholder')}
          />
          <Select
            label={t('pages.organizations.filters.breedSpecies')}
            options={[toSelectOption('dog'), toSelectOption('cat')]}
            value={toSelectOption(searchParams.get(Params.SPECIES))}
            onChange={(value: OptionType) => handleFilter(Params.SPECIES, value ? String(value.value) : '')}
            isClearable
          />
          <Select
            label={t('pages.organizations.filters.breedType')}
            options={[toSelectOption('dog'), toSelectOption('cat')]}
            value={toSelectOption(searchParams.get(Params.BREED))}
            onChange={(value: OptionType) => handleFilter(Params.BREED, value ? String(value.value) : '')}
            isClearable
            isSearchable
          />
        </div>
      ) : (
        <div className={style.inputs}>
        <Input
          label={t('pages.organizations.filters.location')}
          placeholder={t('pages.organizations.filters.locationPlaceholder')}
        />
        <Input
          label={`${t('pages.organizations.filters.range')} (km)`}
          placeholder={t('pages.organizations.filters.rangePlaceholder')}
        />
      </div>
      )}

    </div>
  );
};

export default OrganizationFilters;