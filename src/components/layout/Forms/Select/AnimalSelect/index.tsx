'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import { AnimalsApi } from 'src/api';

import Select, { OptionType } from '..';

import style from './AnimalSelect.module.scss';

type AnimalSelectProps = {
  className?: string;
  handleChange?: (type: string, value: string, label?: string) => void;
  initialState?: {
    speciesOpt?: { value: any, label?: any };
    breedOpt?: { value: any, label?: any };
  };
  isAdding?: boolean;
};

const AnimalSelect = ({ className, handleChange, initialState, isAdding }: AnimalSelectProps) => {
  const t = useTranslations();

  const [speciesOpt, setSpeciesOpt] = useState<any[]>([]);
  const [breedsOpt, setBreedsOpt] = useState<any[]>([]);

  const [selectSpeciesValue, setSelectSpeciesValue] = useState<OptionType | null>(null);
  const [selectBreedsValue, setSelectBreedsValue] = useState<OptionType | null>(null);

  const [speciesPage, setSpeciesPage] = useState(1);
  const [speciesHasMore, setSpeciesHasMore] = useState(false);
  const [speciesLoading, setSpeciesLoading] = useState(false);

  const [breedsPage, setBreedsPage] = useState(1);
  const [breedsHasMore, setBreedsHasMore] = useState(false);
  const [breedsLoading, setBreedsLoading] = useState(false);

  const isInitializing = useRef(true);

  const species = speciesOpt.map(opt => ({
    value: String(opt.id),
    label: t(`common.animalSpecies.${opt.name}`)
  }));

  const breeds = breedsOpt.map(opt => ({
    value: String(opt.id),
    label: t(`common.animalBreeds.${opt.label}`),
  }));

  useEffect(() => {
    const fetchSpecies = async () => {
      setSpeciesLoading(true);
      try {
        const res = await AnimalsApi.getAnimalsSpecies(1);
        const fetched = res.data.results || [];
        setSpeciesOpt(fetched);
        setSpeciesHasMore(!!res.data.next);
        setSpeciesPage(1);
      } catch (err) {
        console.error('Error fetching species:', err);
      } finally {
        setSpeciesLoading(false);
      }
    };
    fetchSpecies();
  }, []);

  const loadMoreSpecies = useCallback(async () => {
    if (!speciesHasMore || speciesLoading) return;
    const nextPage = speciesPage + 1;
    setSpeciesLoading(true);
    try {
      const res = await AnimalsApi.getAnimalsSpecies(nextPage);
      const fetched = res.data.results || [];
      setSpeciesOpt(prev => [...prev, ...fetched]);
      setSpeciesHasMore(!!res.data.next);
      setSpeciesPage(nextPage);
    } catch (err) {
      console.error('Error fetching species:', err);
    } finally {
      setSpeciesLoading(false);
    }
  }, [speciesHasMore, speciesLoading, speciesPage]);

  useEffect(() => {
    const targetValue = initialState?.speciesOpt?.value;
    if (!targetValue || speciesOpt.length === 0) return;
    if (selectSpeciesValue && String(selectSpeciesValue.value) === String(targetValue)) return;

    const matched = speciesOpt.find(s => String(s.id) === String(targetValue));
    if (matched) {
      isInitializing.current = true;
      setSelectSpeciesValue({ value: String(matched.id), label: t(`common.animalSpecies.${matched.name}`) });
    }
  }, [speciesOpt, initialState?.speciesOpt?.value]);

  useEffect(() => {
    if (!selectSpeciesValue?.value) {
      setBreedsOpt([]);
      setBreedsPage(1);
      setBreedsHasMore(false);
      if (!isInitializing.current) setSelectBreedsValue(null);
      return;
    }

    const fetchBreeds = async () => {
      setBreedsLoading(true);
      try {
        const res = await AnimalsApi.getAnimalsBreeds(Number(selectSpeciesValue.value), 1);
        const fetched = res.data.results || [];
        setBreedsOpt(fetched);
        setBreedsHasMore(!!res.data.next);
        setBreedsPage(1);

        if (initialState?.breedOpt?.value && isInitializing.current) {
          const matched = fetched.find((b: any) => String(b.id) === String(initialState.breedOpt?.value));
          if (matched) {
            setSelectBreedsValue({ value: String(matched.id), label: matched.group_name });
          }
          setTimeout(() => { isInitializing.current = false; }, 100);
        } else if (!initialState?.breedOpt?.value) {
          isInitializing.current = false;
        }
      } catch (err) {
        console.error('Error fetching breeds:', err);
        isInitializing.current = false;
      } finally {
        setBreedsLoading(false);
      }
    };

    fetchBreeds();
  }, [selectSpeciesValue, initialState?.breedOpt?.value]);

  const loadMoreBreeds = useCallback(async () => {
    if (!breedsHasMore || breedsLoading || !selectSpeciesValue?.value) return;
    const nextPage = breedsPage + 1;
    setBreedsLoading(true);
    try {
      const res = await AnimalsApi.getAnimalsBreeds(Number(selectSpeciesValue.value), nextPage);
      const fetched = res.data.results || [];
      setBreedsOpt(prev => [...prev, ...fetched]);
      setBreedsHasMore(!!res.data.next);
      setBreedsPage(nextPage);
    } catch (err) {
      console.error('Error fetching breeds:', err);
    } finally {
      setBreedsLoading(false);
    }
  }, [breedsHasMore, breedsLoading, breedsPage, selectSpeciesValue]);

  useEffect(() => {
    if (isInitializing.current) return;
    if (handleChange) {
      handleChange('species', selectSpeciesValue ? String(selectSpeciesValue.value) : '', selectSpeciesValue?.label ?? '');
    }
  }, [selectSpeciesValue]);

  useEffect(() => {
    if (isInitializing.current) return;
    if (handleChange) {
      handleChange('breed', selectBreedsValue ? String(selectBreedsValue.value) : '', selectBreedsValue?.label ?? '');
    }
  }, [selectBreedsValue]);

  return (
    <div className={classNames(style.selectContainer, className)}>
      <Select
        label={t('pages.organizations.filters.breedSpecies')}
        options={species}
        value={selectSpeciesValue}
        onChange={(option: OptionType | null) => {
          isInitializing.current = false;
          setSelectSpeciesValue(option);
          setSelectBreedsValue(null);
        }}
        isClearable
        isSearchable
        isLoading={speciesLoading}
        onMenuScrollToBottom={loadMoreSpecies}
      />
      <Select
        label={t('common.ui.breedLabel')}
        options={breeds}
        value={selectBreedsValue}
        onChange={(option: OptionType | null) => {
          isInitializing.current = false;
          setSelectBreedsValue(option);
        }}
        isClearable
        isSearchable
        isDisabled={!selectSpeciesValue}
        isLoading={breedsLoading}
        onMenuScrollToBottom={loadMoreBreeds}
      />
    </div>
  );
};

export default AnimalSelect;
