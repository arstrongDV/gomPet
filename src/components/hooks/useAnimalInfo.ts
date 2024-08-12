'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

const useAnimalInfo = () => {
  const t = useTranslations('pages.animals');

  const characteristics = useMemo(
    () => ({
      dog: {
        vaccinated: t('characteristics.dog.vaccinated'),
        neutered: t('characteristics.dog.neutered'),
        dewormed: t('characteristics.dog.dewormed'),
        hasChip: t('characteristics.dog.hasChip'),
        acceptsCats: t('characteristics.dog.acceptsCats'),
        acceptsDogs: t('characteristics.dog.acceptsDogs'),
        clean: t('characteristics.dog.clean'),
        hypoallergenic: t('characteristics.dog.hypoallergenic'),
        noSeparationAnxiety: t('characteristics.dog.noSeparationAnxiety'),
        suitableForApartment: t('characteristics.dog.suitableForApartment'),
        vigorous: t('characteristics.dog.vigorous'),
        childrenFriendly: t('characteristics.dog.childrenFriendly'),
        learnsFast: t('characteristics.dog.learnsFast'),
        specialDiet: t('characteristics.dog.specialDiet'),
        calmAtHome: t('characteristics.dog.calmAtHome'),
        canLiveInACity: t('characteristics.dog.canLiveInACity'),
        needsMentalStimulation: t('characteristics.dog.needsMentalStimulation'),
        gentle: t('characteristics.dog.gentle'),
        watchdog: t('characteristics.dog.watchdog'),
        hasHealthBook: t('characteristics.dog.hasHealthBook')
      }
    }),
    [t]
  );

  return {
    characteristics
  };
};

export default useAnimalInfo;
