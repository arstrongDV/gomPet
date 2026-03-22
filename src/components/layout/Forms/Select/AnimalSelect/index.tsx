'use client'

import { AnimalsApi } from "src/api";
import Select, { OptionType } from "..";
import { useEffect, useState, useRef } from "react";
import classNames from "classnames";
import style from './AnimalSelect.module.scss';
import { useTranslations } from "next-intl";

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
      console.error("Error fetching species:", err);
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
        const matched = fetched.find(b => String(b.id) === String(initialState.breedOpt?.value));
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
      console.error("Error fetching breeds:", err);
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
        label="Rasa"
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





// 'use client'

// import { AnimalsApi } from "src/api";
// import Select, { OptionType } from "..";
// import { useEffect, useState } from "react";
// import classNames from "classnames";
// import style from './AnimalSelect.module.scss';
// import { useTranslations } from "next-intl";

// type AnimalSelectProps = {
//   className?: string;
//   handleChange?: (type: string, value: string, label?: string) => void;
//   initialState?: {
//     speciesOpt?: OptionType;
//     breedOpt?: OptionType;
//   };
//   isAdding?: boolean;
// };

// const AnimalSelect = ({ className, handleChange, initialState, isAdding }: AnimalSelectProps) => {
//   const t = useTranslations();

//   const [speciesOpt, setSpeciesOpt] = useState<any[]>([]);
//   const [breedsOpt, setBreedsOpt] = useState<any[]>([]);

//   const [selectSpeciesValue, setSelectSpeciesValue] = useState<OptionType | null>(null);
//   const [selectBreedsValue, setSelectBreedsValue] = useState<OptionType | null>(null);

//   const [speciesInitialized, setSpeciesInitialized] = useState(false);
//   const [breedInitialized, setBreedInitialized] = useState(false);

//   const [isInitializing, setIsInitializing] = useState(true);

//   const species = speciesOpt.map(opt => ({
//     value: String(opt.id),
//     label: opt.name,
//   }));

//   const breeds = breedsOpt.map(opt => ({
//     value: String(opt.id),
//     label: opt.group_name,
//   }));

//   console.log("initialState: ", initialState);

//   // --- Inicjalizacja species tylko raz ---
//   useEffect(() => {
//     if (speciesInitialized) return;
  
//     if (initialState?.speciesOpt && species.length > 0) {
//       const matched = species.find(
//         s => s.value === String(initialState.speciesOpt.value)
//       );
  
//       if (matched) {
//         setSelectSpeciesValue(matched);
//       }
  
//       setSpeciesInitialized(true);
//       setIsInitializing(false); 
//     }
//   }, [species, initialState, speciesInitialized]);

//   // --- Inicjalizacja breed tylko raz ---
//   useEffect(() => {
//     if (breedInitialized) return;
    
//     if (initialState?.breedOpt && breeds.length > 0) {
//       const matched = breeds.find(b => b.value === String(initialState.breedOpt.value));

//       if (matched) {
//         setSelectBreedsValue(matched);
//       }
//       setBreedInitialized(true);
//       setIsInitializing(false);
//     }
//   }, [breeds, initialState, breedInitialized]);

//   // --- Wywołanie handleChange przy zmianie species ---
//   useEffect(() => {
//     if (!isAdding && isInitializing) return;
  
//     if (handleChange) {
//       handleChange(
//         'species',
//         selectSpeciesValue ? String(selectSpeciesValue.value) : '',
//         selectSpeciesValue?.label ?? ''
//       );
//     }
//   }, [selectSpeciesValue, isInitializing]);

//   // --- Wywołanie handleChange przy zmianie breed ---
//   useEffect(() => {
//     if (!isAdding && isInitializing) return; 

//     if (handleChange) {
//       handleChange(
//         'breed',
//         selectBreedsValue ? String(selectBreedsValue.value) : '',
//         selectBreedsValue?.label ?? ''
//       );
//     }
//   }, [selectBreedsValue, isInitializing]);

//   // --- Pobranie species z API ---
//   useEffect(() => {
//     const fetchSpecies = async () => {
//       try {
//         const res = await AnimalsApi.getAnimalsSpecies();
//         setSpeciesOpt(res.data.results || []);
//       } catch (err) {
//         console.error("Error fetching species:", err);
//       }
//     };
//     fetchSpecies();
//   }, []);

//   // --- Pobranie breeds po wybraniu species ---
// // W AnimalSelect.tsx
// // W AnimalSelect.tsx
// useEffect(() => {
//   if (!selectSpeciesValue?.value) {
//     setBreedsOpt([]);
//     setSelectBreedsValue(null);
//     return;
//   }

//   const fetchBreeds = async () => {
//     try {
//       const res = await AnimalsApi.getAnimalsBreeds(Number(selectSpeciesValue.value));
//       const fetchedBreeds = res.data.results || [];
//       setBreedsOpt(fetchedBreeds);

//       // --- KLUCZOWA ZMIANA ---
//       // Jeśli mamy initialState i jeszcze nie ustawiliśmy rasy, dopasujmy ją zamiast zerować
//       if (initialState?.breedOpt?.value && !breedInitialized) {
//         const matched = fetchedBreeds.find(
//           (b: any) => String(b.id) === String(initialState.breedOpt.value)
//         );
//         if (matched) {
//           setSelectBreedsValue({ value: String(matched.id), label: matched.group_name });
//           setBreedInitialized(true);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching breeds:", err);
//     }
//   };

//   // Czyścimy rasę TYLKO jeśli gatunek zmienił się ręcznie po inicjalizacji
//   if (speciesInitialized && !isInitializing) {
//     setSelectBreedsValue(null);
//   }

//   fetchBreeds();
// }, [selectSpeciesValue]); // Pamiętaj o usunięciu breedInitialized z tej tablicy!
// // useEffect(() => {
// //   if (!selectSpeciesValue?.value) {
// //     setBreedsOpt([]);
// //     setSelectBreedsValue(null);
// //     return;
// //   }

// //   const fetchBreeds = async () => {
// //     try {
// //       const res = await AnimalsApi.getAnimalsBreeds(Number(selectSpeciesValue.value));
// //       const fetchedBreeds = res.data.results || [];
// //       setBreedsOpt(fetchedBreeds);

// //       // Jeśli to inicjalizacja edycji, spróbuj dopasować rasę z tych pobranych
// //       if (!isAdding && !breedInitialized && initialState?.breedOpt) {
// //         const matched = fetchedBreeds.find(
// //           (b: any) => String(b.id) === String(initialState.breedOpt?.value)
// //         );
// //         if (matched) {
// //           setSelectBreedsValue({ value: String(matched.id), label: matched.group_name });
// //           setBreedInitialized(true);
// //         }
// //       }
// //     } catch (err) {
// //       console.error("Error fetching breeds:", err);
// //     }
// //   };

// //   // CZYŚĆ RASĘ TYLKO JEŚLI UŻYTKOWNIK SAM ZMIENIA GATUNEK (a nie przy starcie)
// //   if (speciesInitialized) {
// //      setSelectBreedsValue(null);
// //   }

// //   fetchBreeds();
// // }, [selectSpeciesValue]); // Usuń breedInitialized z tablicy zależności
  

//   return (
//     <div className={classNames(style.selectContainer, className)}>
//       <Select
//         label={t('pages.organizations.filters.breedSpecies')}
//         options={species}
//         value={selectSpeciesValue}
//         onChange={(option: OptionType | null) => {
//           setSelectSpeciesValue(option);
//           setSelectBreedsValue(null);
//         }}
//         isClearable
//         isSearchable
//       />
//       <Select
//         label="Rasa"
//         options={breeds}
//         value={selectBreedsValue}
//         onChange={(option: OptionType | null) => setSelectBreedsValue(option)}
//         isClearable
//         isSearchable
//         isDisabled={!selectSpeciesValue}
//       />
//     </div>
//   );
// };

// export default AnimalSelect;








// 'use client'

// import { AnimalsApi } from "src/api";
// import Select, { OptionType } from "..";
// import { useEffect, useState } from "react";
// import classNames from "classnames";
// import style from './AnimalSelect.module.scss';
// import { useTranslations } from "next-intl";

// type AnimalSelectProps = {
//   className?: string;
//   handleChange?: (type: string, name: string) => void;
//   initialState?: any;
// };

// const AnimalSelect = ({ className, handleChange, initialState }: AnimalSelectProps) => {
//   const t = useTranslations();

//   console.log("initialStateinitialState: ", initialState);

//   const [speciesOpt, setSpeciesOpt] = useState<any[]>([]);
//   const [breedsOpt, setBreedsOpt] = useState<any[]>([]);

//   const [selectSpeciesValue, setSelectSpeciesValue] = useState<OptionType | null>(null);
//   const [selectBreedsValue, setSelectBreedsValue] = useState<OptionType | null>(null);

//   const [hasSpeciesInitialized, setHasSpeciesInitialized] = useState(false);
//   const [hasBreedsInitialized, setHasBreedsInitialized] = useState(false);


//   const species = speciesOpt.map(opt => ({
//     value: opt.id,
//     label: opt.name,
//   }));

//   const breeds = breedsOpt.map(opt => ({
//     value: opt.id,
//     label: opt.group_name,
//   }));


//   useEffect(() => {
//     if (initialState && initialState?.speciesOpt && species.length > 0 && !hasSpeciesInitialized) {
//       const matchedSpecies = species.find(
//         opt => opt.value === initialState.speciesOpt?.value
//       );

//       if (matchedSpecies) {
//         setSelectSpeciesValue(matchedSpecies);
//         setHasSpeciesInitialized(true);
//       }
//     }
//   }, [species, initialState, hasSpeciesInitialized]);

//   useEffect(() => {
//     if (initialState?.breedOpt && breeds.length > 0 && !hasBreedsInitialized) {
//       const matchedBreeds = breeds.find(
//         opt => opt.value === initialState.breedOpt?.value
//       );
      
//       if (matchedBreeds) {
//         setSelectBreedsValue(matchedBreeds);
//         setHasBreedsInitialized(true);
//       }
//     }
//   }, [breeds, initialState, hasBreedsInitialized]);


//   useEffect(() => {
//     if (handleChange && selectSpeciesValue) {
//       handleChange('species', selectSpeciesValue.value, selectSpeciesValue.label);
//     } else if (handleChange && !selectSpeciesValue) {
//       handleChange('species', '', '');
//     }
//   }, [selectSpeciesValue]);

//   useEffect(() => {
//     if (handleChange && selectBreedsValue) {
//       handleChange('breed', selectBreedsValue.value, selectBreedsValue.label);
//     } else if (handleChange && !selectBreedsValue) {
//       handleChange('breed', '', '');
//     }
//   }, [selectBreedsValue]);

//   useEffect(() => {
//     const fetchSpecies = async () => {
//       try {
//         const res = await AnimalsApi.getAnimalsSpecies();
//         setSpeciesOpt(res.data.results || []);
//         console.log("Spacies: ", res);
//       } catch (err) {
//         console.error("Error fetching species:", err);
//       }
//     };
//     fetchSpecies();
//   }, []);

//   useEffect(() => {
//     if (!selectSpeciesValue?.value) {
//       setBreedsOpt([]);
//       setSelectBreedsValue(null);
//       return;
//     }
  
//     const fetchBreeds = async () => {
//       try {
//         const res = await AnimalsApi.getAnimalsBreeds(
//           Number(selectSpeciesValue.value)
//         );
//         setBreedsOpt(res.data.results || []);
//         console.log("Breeds: ", res);
//       } catch (err) {
//         console.error("Error fetching breeds:", err);
//         setBreedsOpt([]);
//       }
//     };
  
//     // Reset breed przy zmianie species
//     setSelectBreedsValue(null);

//     fetchBreeds();
//   }, [selectSpeciesValue]);

  
//   return (
//     <div className={classNames(style.selectContainer, className)}>
//       <Select
//         label={t('pages.organizations.filters.breedSpecies')}
//         options={species}
//         onChange={initialState ? setSelectSpeciesValue : (option: any) => {
//           setSelectSpeciesValue(option);
//           handleChange?.(
//             'species',
//             option ? String(option.value) : ''
//           );
//         }}
//         value={selectSpeciesValue}
//         isClearable
//         isSearchable
//       />
//       <Select
//         label="Rasa"
//         options={breeds}
//         onChange={(option: OptionType) => {
//           setSelectBreedsValue(option);
//           handleChange?.(
//             'breed',
//             option ? String(option.value) : ''
//           );
//         }}
//         value={selectBreedsValue}
//         isClearable
//         isSearchable
//         isDisabled={!selectSpeciesValue}
//       />
//     </div>
//   );
// };

// export default AnimalSelect;