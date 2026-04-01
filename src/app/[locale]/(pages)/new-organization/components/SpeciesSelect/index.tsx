import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { AnimalsApi } from 'src/api';
import { Loader, Select } from 'src/components';
import { OptionType } from 'src/components/layout/Forms/Select';

interface SpeciesSelectProps {
    handleChange: (species: OptionType[]) => void;
    initialRace?: number[];
}

const SpeciesSelect = ({ handleChange, initialRace }: SpeciesSelectProps) => {
    const t = useTranslations();

    const [speciesOpt, setSpeciesOpt] = useState([]);
    const [selectSpeciesValue, setSelectSpeciesValue] = useState<OptionType[]>([]);
    const [isLoading, setIsLoding] = useState(false);

    const options = speciesOpt.map((s: any) => ({
        value: s.id,
        label: s.name
    }));

    enum Animals {
      'DOG', 
      "CAT"
    }

    useEffect(() => {
      if(initialRace){

        const initialSlecetedAnimals = initialRace.map((r, i) => 
          ({
            value: r,
            label: Animals[r]
          })
        )
        console.log("initialSlecetedAnimals: ", initialSlecetedAnimals);
        setSelectSpeciesValue(initialSlecetedAnimals);
      }
    }, [initialRace])

    useEffect(() => {
        const fetchSpecies = async () => {
            setIsLoding(true);
          try {
            const res = await AnimalsApi.getAnimalsSpecies();
            const fetched = res.data.results || [];
            setSpeciesOpt(fetched);
            setIsLoding(false);
          } catch (err) {
            console.error('Error fetching species:', err);
            setSpeciesOpt([]);
            setIsLoding(false);
          } finally {
            setIsLoding(false);
          }
        };
        fetchSpecies();
      }, []);


      useEffect(() => {
        handleChange(selectSpeciesValue);
      }, [selectSpeciesValue]);

    if (isLoading) return <Loader />;
  return (
    <>
        <Select
            label={t('pages.organizations.filters.breedSpecies')}
            options={options}
            value={selectSpeciesValue}
            onChange={(option: any) => {
                // Obsługujemy fakt, że react-select przy isMulti może zwrócić null
                // Jeśli option jest null, ustawiamy pustą tablicę
                const newValue = option || [];
                setSelectSpeciesValue(newValue);
            }}
            isMulti
        />
    </>
  );
};

export default SpeciesSelect;
