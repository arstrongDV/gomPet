import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { AnimalsApi } from 'src/api';
import { Loader, Select } from 'src/components';
import { OptionType } from 'src/components/layout/Forms/Select';

interface RaceData {
  id: number;
  label?: string;
}

interface SpeciesSelectProps {
    handleChange: (species: OptionType[]) => void;
    initialRace?: RaceData[];
}

const SpeciesSelect = ({ handleChange, initialRace }: SpeciesSelectProps) => {
    const t = useTranslations();

    console.log(initialRace)

    const [speciesOpt, setSpeciesOpt] = useState([]);
    const [selectSpeciesValue, setSelectSpeciesValue] = useState<OptionType[]>([]);
    const [isLoading, setIsLoding] = useState(false);
    const initialized = useRef(false);

    const options = speciesOpt.map((s: any) => ({
        value: s.id,
        label: t(`common.animalSpecies.${s.name}`)
    }));

  useEffect(() => {
    if (!initialized.current && initialRace && options.length > 0) {
      const initialSelected = options.filter(opt =>
        initialRace.some(race => race.id === opt.value)
      );

      setSelectSpeciesValue(initialSelected);
      initialized.current = true;
    }
  }, [initialRace, speciesOpt]);

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
      }, [initialRace]);



    if (isLoading) return <Loader />;
  return (
    <>
        <Select
            label={t('pages.organizations.filters.breedSpecies')}
            options={options}
            value={selectSpeciesValue}
            onChange={(option: any) => {
                const newValue = option || [];
                setSelectSpeciesValue(newValue);
                handleChange(newValue);
            }}
            isMulti
        />
    </>
  );
};

export default SpeciesSelect;