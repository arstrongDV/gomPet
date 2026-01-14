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
import { InputProps } from 'src/components/layout/Forms/Input';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

type OrganizationFiltersProps = {
  className?: string;
  needFullFilters?: boolean;
};

const OrganizationFilters = ({ className, needFullFilters }: OrganizationFiltersProps) => {
  
  const t = useTranslations();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();

  const session = useSession();

  const [showFullFilters, setShowFullFilters] = useState(false); 
  useEffect(() => {
    if (needFullFilters) setShowFullFilters(true);
  }, [needFullFilters]);

  const organization = {
    SHELTER: t('common.organization.SHELTER'),
    FUND: t('common.organization.FUND'),
    BREEDER: t('common.organization.BREEDER')
  };

  const handleFilter = (filter: string, value: string, isArr = false) => {
    // const params = new URLSearchParams(searchParams.toString());
    params.set(Params.PAGE, '1');

    if (filter === Params.RANGE) {
      params.set(Params.PAGE, '1');
    
      if (!value) {
        params.delete(Params.RANGE);
        params.delete(Params.LOCATION);
      } else {
        params.set(Params.RANGE, value);
      }
    
      router.push(`?${params.toString()}`);
      return;
    }

    if (isArr) {
      const arr = params.get(filter)?.split(',') || [];
      if (arr.includes(value)) {
        arr.splice(arr.indexOf(value), 1);
        if (arr.length === 0) {
          params.delete(filter);
        } else {
          params.set(filter, arr.join(',')); 
        }
      } else {
        arr.push(value);
        params.set(filter, arr.join(',')); 
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

  useEffect(() => {
    const hasRange = searchParams.get(Params.RANGE);
    const hasLocation = searchParams.get(Params.LOCATION);
  
    if (!hasRange && hasLocation) {
      params.delete(Params.LOCATION);
      router.replace(`?${params.toString()}`);
    }
  }, [searchParams]);

  const applyLocationFilter = () => {
    if (!session.data?.user?.location){
      toast.error("Nie udalo się znalezc twojwj lokalizacji");
    }
    if (!range) {
      params.delete(Params.RANGE);
      params.delete(Params.LOCATION);
      router.push(`?${params.toString()}`);
      return;
    }

    const { coordinates } = session.data.user.location;
  
    // upewnij się, że lat i lng są liczby
    if (coordinates[0] == null || coordinates[1] == null) return;
  
    const locationValue = `SRID=4326;POINT(${coordinates[0]} ${coordinates[1]})`;

  
    params.set(Params.LOCATION, locationValue);
    params.set(Params.RANGE, range);
    params.set(Params.PAGE, '1');
  
    // params.delete(Params.CITY);

    router.push(`?${params.toString()}`);
  };

  const clearAllFilters = useCallback(() => {
    router.push('?page=1');
  }, [params]);

  const [locationInput, setLocationInput] = useState(searchParams.get(Params.CITY) ?? '')
  // const [rangeInput, setRangeInput] = useState(searchParams.get(Params.RANGE) ?? '')
  const [range, setRange] = useState(searchParams.get(Params.RANGE) ?? '');

  return (
    <div className={classNames(style.filters, className)}>
      <div className={style.row}>
        {Object.entries(organization).map(([key, value]) => (
          <Checkbox
            key={key}
            id={key}
            className={style.checkbox}
            // checked={searchParams.get(Params.ORGANIZATION_TYPE)?.split('&').includes(key)}
            checked={searchParams.get(Params.ORGANIZATION_TYPE)?.split(',').includes(key)}
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
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onBlur={() => {if(locationInput !== '') handleFilter(Params.CITY, locationInput)}}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleFilter(Params.CITY, locationInput);
            }}
          />
          <Input
            label={`${t('pages.organizations.filters.range')} (km)`}
            placeholder={t('pages.organizations.filters.rangePlaceholder')}
            value={range}
            onChange={(e) => setRange(e.target.value)}
            onBlur={() => {if(range !== '') handleFilter(Params.RANGE, range)}}
            onKeyDown={(e) => {
              if (e.key === 'Enter'){
                applyLocationFilter();
              }
            }}
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
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onBlur={() => handleFilter(Params.CITY, locationInput)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleFilter(Params.CITY, locationInput);
            }}
          />
          <Input
            label={`${t('pages.organizations.filters.range')} (km)`}
            placeholder={t('pages.organizations.filters.rangePlaceholder')}
            value={range}
            onChange={(e) => setRange(e.target.value)}
            onBlur={() => handleFilter(Params.RANGE, range)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleFilter(Params.RANGE, range);
            }}
          />
      </div>
      )}

    </div>
  );
};

export default OrganizationFilters;