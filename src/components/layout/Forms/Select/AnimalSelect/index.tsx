'use client'

import { AnimalsApi } from "src/api";
import Select, { OptionType } from "..";
import { useEffect, useState } from "react";
import classNames from "classnames";
import style from './AnimalSelect.module.scss';
import { useTranslations } from "next-intl";

type AnimalSelectProps = {
  className?: string;
  handleChange?: (type: string, name: string) => void;
  initialState?: any;
};

const AnimalSelect = ({ className, handleChange, initialState }: AnimalSelectProps) => {
  const t = useTranslations();

  const [speciesOpt, setSpeciesOpt] = useState<any[]>([]);
  const [breedsOpt, setBreedsOpt] = useState<any[]>([]);

  const [selectSpeciesValue, setSelectSpeciesValue] = useState<OptionType | null>(null);
  const [selectBreedsValue, setSelectBreedsValue] = useState<OptionType | null>(null);

  const [hasSpeciesInitialized, setHasSpeciesInitialized] = useState(false);
  const [hasBreedsInitialized, setHasBreedsInitialized] = useState(false);


  const species = speciesOpt.map(opt => ({
    value: opt.id,
    label: opt.name,
  }));

  const breeds = breedsOpt.map(opt => ({
    value: opt.id,
    label: opt.group_name,
  }));


  useEffect(() => {
    if (initialState && initialState?.speciesOpt && species.length > 0 && !hasSpeciesInitialized) {
      const matchedSpecies = species.find(
        opt => opt.value === initialState.speciesOpt?.value
      );

      if (matchedSpecies) {
        setSelectSpeciesValue(matchedSpecies);
        setHasSpeciesInitialized(true);
      }
    }
  }, [species, initialState, hasSpeciesInitialized]);

  useEffect(() => {
    if (initialState?.breedOpt && breeds.length > 0 && !hasBreedsInitialized) {
      const matchedBreeds = breeds.find(
        opt => opt.value === initialState.breedOpt?.value
      );
      
      if (matchedBreeds) {
        setSelectBreedsValue(matchedBreeds);
        setHasBreedsInitialized(true);
      }
    }
  }, [breeds, initialState, hasBreedsInitialized]);


  useEffect(() => {
    if (handleChange && selectSpeciesValue) {
      handleChange('species', selectSpeciesValue.value, selectSpeciesValue.label);
    } else if (handleChange && !selectSpeciesValue) {
      handleChange('species', '', '');
    }
  }, [selectSpeciesValue, handleChange]);

  useEffect(() => {
    if (handleChange && selectBreedsValue) {
      handleChange('breed', selectBreedsValue.value, selectBreedsValue.label);
    } else if (handleChange && !selectBreedsValue) {
      handleChange('breed', '', '');
    }
  }, [selectBreedsValue, handleChange]);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const res = await AnimalsApi.getAnimalsSpecies();
        setSpeciesOpt(res.data.results || []);
      } catch (err) {
        console.error("Error fetching species:", err);
      }
    };
    fetchSpecies();
  }, []);

  useEffect(() => {
    if (!selectSpeciesValue?.value) {
      setBreedsOpt([]);
      setSelectBreedsValue(null);
      return;
    }
  
    const fetchBreeds = async () => {
      try {
        const res = await AnimalsApi.getAnimalsBreeds(
          Number(selectSpeciesValue.value)
        );
        setBreedsOpt(res.data.results || []);
      } catch (err) {
        console.error("Error fetching breeds:", err);
        setBreedsOpt([]);
      }
    };
  
    // Reset breed przy zmianie species
    setSelectBreedsValue(null);

    fetchBreeds();
  }, [selectSpeciesValue]);

  
  return (
    <div className={classNames(style.selectContainer, className)}>
      <Select
        label={t('pages.organizations.filters.breedSpecies')}
        options={species}
        onChange={initialState ? setSelectSpeciesValue : (option: any) => {
          setSelectSpeciesValue(option);
          handleChange?.(
            'species',
            option ? String(option.value) : ''
          );
        }}
        value={selectSpeciesValue}
        isClearable
        isSearchable
      />
      <Select
        label="Rasa"
        options={breeds}
        onChange={(option: OptionType) => {
          setSelectBreedsValue(option);
          handleChange?.(
            'breed',
            option ? String(option.value) : ''
          );
        }}
        value={selectBreedsValue}
        isClearable
        isSearchable
        isDisabled={!selectSpeciesValue}
      />
    </div>
  );
};

export default AnimalSelect;