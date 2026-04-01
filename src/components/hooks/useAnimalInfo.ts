'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimalsApi } from 'src/api';

const useAnimalInfo = (type?: string) => {
  const t = useTranslations('pages.animals');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getCharacteristics = async() => {
    if(!type) return;
    setIsLoading(true);
    try{
      const res = await AnimalsApi.getAnimalsCharacteristics(type);
      setData(res.data)
      setIsLoading(false);
    } catch(err) {
      setData([]);
      console.log(err)
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (!type) return;
    getCharacteristics();
  }, [type]);

  const characteristics = useMemo(
    () => data.map((char: {id: number, name: string, label: string}) => ({
      id: char.id,
      label: t(`characteristics.${char.name}`),
      value: char.label
    })),
    [data, t]
  );

  return {
    characteristics
  };
};

export default useAnimalInfo;


// ({
//   dog: {
//     vaccinated: t('characteristics.dog.vaccinated'),
//     neutered: t('characteristics.dog.neutered'),
//     dewormed: t('characteristics.dog.dewormed'),
//     hasChip: t('characteristics.dog.hasChip'),
//     acceptsCats: t('characteristics.dog.acceptsCats'),
//     acceptsDogs: t('characteristics.dog.acceptsDogs'),
//     clean: t('characteristics.dog.clean'),
//     hypoallergenic: t('characteristics.dog.hypoallergenic'),
//     noSeparationAnxiety: t('characteristics.dog.noSeparationAnxiety'),
//     suitableForApartment: t('characteristics.dog.suitableForApartment'),
//     vigorous: t('characteristics.dog.vigorous'),
//     childrenFriendly: t('characteristics.dog.childrenFriendly'),
//     learnsFast: t('characteristics.dog.learnsFast'),
//     specialDiet: t('characteristics.dog.specialDiet'),
//     calmAtHome: t('characteristics.dog.calmAtHome'),
//     canLiveInACity: t('characteristics.dog.canLiveInACity'),
//     needsMentalStimulation: t('characteristics.dog.needsMentalStimulation'),
//     gentle: t('characteristics.dog.gentle'),
//     watchdog: t('characteristics.dog.watchdog'),
//     hasHealthBook: t('characteristics.dog.hasHealthBook')
//   }
// }),