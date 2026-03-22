import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react'
import { AnimalsApi } from 'src/api';
import { Loader, Select } from 'src/components';
import { OptionType } from 'src/components/layout/Forms/Select';

interface SpeciesSelectProps {
    handleChange: (species: OptionType | OptionType[]) => void;
}

const SpeciesSelect = ({ handleChange }: SpeciesSelectProps) => {
    const t = useTranslations();

    const [speciesOpt, setSpeciesOpt] = useState([]);
    const [selectSpeciesValue, setSelectSpeciesValue] = useState<OptionType | OptionType[]>(null);
    const [isLoading, setIsLoding] = useState(false);

    const options = speciesOpt.map((s: any) => ({
        value: s.id,
        label: s.name
    }));

    useEffect(() => {
        const fetchSpecies = async () => {
            setIsLoding(true);
          try {
            const res = await AnimalsApi.getAnimalsSpecies();
            const fetched = res.data.results || [];
            setSpeciesOpt(fetched);
            setIsLoding(false);
          } catch (err) {
            console.error("Error fetching species:", err);
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
      }, [selectSpeciesValue])

    if(isLoading) return <Loader />
  return (
    <>
    <Select
        label={t('pages.organizations.filters.breedSpecies')}
        options={options}
        value={selectSpeciesValue}
        onChange={(option: OptionType | null) => {
            // isInitializing.current = false; // Użytkownik kliknął, wyłączamy blokadę
            setSelectSpeciesValue(option);
        }}
        isMulti
        // isClearable
        // isSearchable
    />
    </>
  )
}

export default SpeciesSelect
