'use client';

import { useEffect, useRef,useState } from 'react';
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

  // Używamy useRef, aby wiedzieć, czy to pierwsze ładowanie (zapobiega pętlom w URL)
  const isInitializing = useRef(true);

  const species = speciesOpt.map(opt => ({
    value: String(opt.id),
    label: opt.name,
  }));

  const breeds = breedsOpt.map(opt => ({
    value: String(opt.id),
    label: opt.group_name,
  }));

  // 1. Pobranie gatunków (raz na starcie)
// 1. Pobranie gatunków
useEffect(() => {
  const fetchSpecies = async () => {
    try {
      const res = await AnimalsApi.getAnimalsSpecies();
      const fetched = res.data.results || [];
      setSpeciesOpt(fetched);
    } catch (err) {
      console.error('Error fetching species:', err);
    }
  };
  fetchSpecies();
}, []);

// 2. Synchronizacja gatunku z initialState (osobny useEffect)
useEffect(() => {
  if (speciesOpt.length > 0 && initialState?.speciesOpt?.value && !selectSpeciesValue) {
    const matched = speciesOpt.find(s => String(s.id) === String(initialState.speciesOpt?.value));
    if (matched) {
      setSelectSpeciesValue({ value: String(matched.id), label: matched.name });
    }
  }
}, [speciesOpt, initialState?.speciesOpt?.value]);

  // 2. Pobranie ras po zmianie gatunku
// 3. Pobranie ras i synchronizacja
useEffect(() => {
  if (!selectSpeciesValue?.value) {
    setBreedsOpt([]);
    // Zeruj rasę tylko jeśli to NIE jest pierwsze ładowanie
    if (!isInitializing.current) setSelectBreedsValue(null);
    return;
  }

  const fetchBreeds = async () => {
    try {
      const res = await AnimalsApi.getAnimalsBreeds(Number(selectSpeciesValue.value));
      const fetched = res.data.results || [];
      setBreedsOpt(fetched);

      // Jeśli mamy initialState rasy, ustawiamy ją TUTAJ
      if (initialState?.breedOpt?.value && isInitializing.current) {
        const matched = fetched.find((b: any) => String(b.id) === String(initialState.breedOpt?.value));
        if (matched) {
          setSelectBreedsValue({ value: String(matched.id), label: matched.group_name });
        }
        // Dopiero teraz, gdy rasa z URL/propsów jest ustawiona, "otwieramy" bramkę dla handleChange
        setTimeout(() => { isInitializing.current = false; }, 100); 
      } else if (!initialState?.breedOpt?.value) {
        // Jeśli nie ma rasy w initialu, też otwieramy bramkę
        isInitializing.current = false;
      }
    } catch (err) {
      console.error('Error fetching breeds:', err);
      isInitializing.current = false;
    }
  };

  fetchBreeds();
}, [selectSpeciesValue, initialState?.breedOpt?.value]);

  // 3. Informowanie rodzica (URL / FormData) o zmianach
  // UWAGA: Odpala się TYLKO gdy isInitializing jest false
  useEffect(() => {
    if (isInitializing.current) return;

    if (handleChange) {
      handleChange(
        'species',
        selectSpeciesValue ? String(selectSpeciesValue.value) : '',
        selectSpeciesValue?.label ?? ''
      );
    }
  }, [selectSpeciesValue]);

  useEffect(() => {
    if (isInitializing.current) return;

    if (handleChange) {
      handleChange(
        'breed',
        selectBreedsValue ? String(selectBreedsValue.value) : '',
        selectBreedsValue?.label ?? ''
      );
    }
  }, [selectBreedsValue]);

  return (
    <div className={classNames(style.selectContainer, className)}>
      <Select
        label={t('pages.organizations.filters.breedSpecies')}
        options={species}
        value={selectSpeciesValue}
        onChange={(option: OptionType | null) => {
          isInitializing.current = false; // Użytkownik kliknął, wyłączamy blokadę
          setSelectSpeciesValue(option);
          setSelectBreedsValue(null);
        }}
        isClearable
        isSearchable
      />
      <Select
        label='Rasa'
        options={breeds}
        value={selectBreedsValue}
        onChange={(option: OptionType | null) => {
          isInitializing.current = false;
          setSelectBreedsValue(option);
        }}
        isClearable
        isSearchable
        isDisabled={!selectSpeciesValue}
      />
    </div>
  );
};

export default AnimalSelect;
