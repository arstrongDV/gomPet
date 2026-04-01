'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import classNames from 'classnames';
import debounce from 'lodash/debounce';

import { AnimalsApi } from 'src/api';
import { 
    Button,
    Card, 
    Input, 
    Loader,
    Select} from 'src/components';
import { OptionType } from 'src/components/layout/Forms/Select';
import AnimalSelect from 'src/components/layout/Forms/Select/AnimalSelect';
import { IAnimal } from 'src/constants/types';

import style from './AddParents.module.scss';

type Parent = {
    id?: number;
    animal_id: number;
    name: string;
    gender?: string;
    relation?: string | number | undefined;
    photos?: string;
};

type AnimalAddParentsProps = {
    className?: string;
    parents?: Parent[];
    onAddParent: (parent: Parent) => void;
    childAnimal?: IAnimal; 
    setIsParentsAdd: (e: boolean) => void;
};

type AnimalKey = string;
const animalRace: Record<AnimalKey, { value: string; label: string }[]> = {
    dog: [
      { value: 'beagle', label: 'Beagle' },
      { value: 'terrier', label: 'Terrier' }
    ],
    cat: [
      { value: 'british', label: 'British' }
    ]
};

const animalsRelation = [
    { value: 'MOTHER', label: 'Matka' },
    { value: 'FATHER', label: 'Ojciec' },
]

const animalSpecies = [
    {
      value: '1',
      label: 'Pies'
    },
    {
      value: '2',
      label: 'Kot'
    }
]

const AddAnimalParents = ({ className, onAddParent, parents, childAnimal, setIsParentsAdd }: AnimalAddParentsProps) => {
    const [searchName, setSearchName] = useState<string>('');
    const [relation, setRelation] = useState<OptionType | null>(null);
    const [selectSpeciesValue, setSelectSpeciesValue] = useState<OptionType>(null);
    const [selectRaceValue, setSelectRaceValue] = useState<OptionType>(null);
    
    const [selectedAnimal, setSelectedAnimal] = useState<IAnimal | null>(null);
    const [previouslySelectedAnimals, setPreviouslySelectedAnimals] = useState<IAnimal[]>([]);

    const [animals, setAnimals] = useState<IAnimal[]>([]); // Fixed: changed to array
    const [loading, setLoading] = useState(false);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (filters: { name?: string; species?: string[]; breed?: string[] }) => {
            try {
                setLoading(true);
                const res = await AnimalsApi.getAnimals(filters);
                setAnimals(res.data?.results ?? []);
            } catch (e) {
                console.error('Error fetching animals:', e);
            } finally {
                setLoading(false);
            }
        }, 500),
        []
    );
    const handleChange = (field: string, value: string, label?: string) => {
        if(field === 'breed'){
          setSelectRaceValue({ value, label } as OptionType);
        } else if(field === 'species'){
          setSelectSpeciesValue({ value, label } as OptionType);
        }
      };
    const filteredRaceOpt = selectSpeciesValue
        ? animalRace[selectSpeciesValue.value] || []
        : [];

    const buttonDisableWhen = [
        !selectedAnimal,
        !relation?.value,
    ];
      
    const isButtonDisabled = buttonDisableWhen.some(Boolean);

    // Effect for filtering
    useEffect(() => {
        const filters: any = {};
        
        if (searchName) {
            filters.name = searchName;
        }
        
        if (selectSpeciesValue?.value) {
            filters.species = [selectSpeciesValue.value];
        }
        
        if (selectRaceValue?.value) {
            filters.breed = [selectRaceValue.value];
        }
        
        debouncedSearch(filters);
    }, [searchName, selectSpeciesValue, selectRaceValue, debouncedSearch]);

    const handleAdd = () => {
        if (!selectedAnimal || (parents?.length ?? 0) >= 2) return;

        const newParent: Parent = {
            animal_id: selectedAnimal.id,
            name: selectedAnimal.name,
            relation: relation?.value,
            gender: selectedAnimal.gender,
            photos: selectedAnimal.image ?? undefined
        };

        if (relation?.value == null) {
            toast.error("Musisz wybrać relację!");
            return;
        }

        if (
            (selectedAnimal.gender === "MALE" && relation.value === "MOTHER") ||
            (selectedAnimal.gender === "FEMALE" && relation.value === "FATHER")
        ) {
            toast.error("Relacja nie zgadza się z płcią zwierzęcia!");
            return;
        }

        onAddParent(newParent);
        setPreviouslySelectedAnimals(prev => [...prev, selectedAnimal]);
        
        setSelectedAnimal(null);
        setSearchName(''); 
        setSelectSpeciesValue(null);
        setSelectRaceValue(null);
        setRelation(null);
    };

    const handleAnimalSelect = (animal: IAnimal) => {
        if (previouslySelectedAnimals.some(prevAnimal => prevAnimal.id === animal.id)) {
            toast.error("To zwierzę zostało już wybrane poprzednio");
            return;
        }
        if (parents?.some(prevAnimal => prevAnimal?.id === animal.id)) {
            toast.error("To zwierzę zostało już wybrane poprzednio");
            return;
        }
        if (previouslySelectedAnimals.some(prevAnimal => prevAnimal.gender === animal.gender)) {
            toast.error("Nie moze byc dwa zwierza z jednym płciem");
            return;
        }
        if (parents?.some(prevAnimal => prevAnimal?.gender === animal.gender)) {
            toast.error("Nie moze byc dwa zwierza z jednym płciem");
            return;
        }
        if (animal.id === childAnimal?.id) {
            toast.error("Wybrane zwierzę nie może być rodzicem samego siebie");
            return;
        }
        
        if (childAnimal?.age != null && animal.age <= childAnimal.age) {
            toast.error("Rodzic musi być starszy");
            return;
        }
        
        setSelectedAnimal(animal);
    };

    return (
        <Card className={classNames(style.container, className)}>
            <Input
                id='search-animal'
                name='search-animal'
                label={'Wyszukaj zwierzę'}
                placeholder={'Wpisz nazwę...'}
                value={searchName}
                onChangeText={setSearchName}
            />

            <div className={style.flexRow}>
                <Select
                    label={'Gatunek'}
                    options={animalSpecies}
                    onChange={setSelectSpeciesValue}
                    value={selectSpeciesValue}
                    isClearable
                />

                <Select
                    label={'Rasa'}
                    options={filteredRaceOpt} 
                    onChange={setSelectRaceValue}
                    value={selectRaceValue}
                    isClearable
                />
                {/* <AnimalSelect handleChange={handleChange} /> */}
            </div>

            {/* Lista zwierząt */}
            <div className={style.animalsList}>
                <h4>Dostępne zwierzęta:</h4>
                
                {loading ? (
                    <Loader />
                ) : animals.length === 0 ? (
                    <p>Brak zwierząt spełniających kryteria</p>
                ) : (
                    <div className={style.animalsGrid}>
                        {animals.map(animal => (
                            <div
                                key={animal.id}
                                className={`${style.animalItem} ${selectedAnimal?.id === animal.id ? style.selected : ''}`}
                                onClick={() => handleAnimalSelect(animal)}
                            >
                                <img
                                    src={animal.image || '/images/no-photo.png'}
                                    className={style.animalPhoto}
                                />
                                <div className={style.animalInfo}>
                                    <h5>{animal.name}</h5>
                                    <p>{animal.species} • {animal.breed}</p>
                                    <p>Płeć: {animal.gender}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className={style.bottom}>
                <Button 
                    className={style.buttonAdd} 
                    icon='plus' 
                    label="Dodaj jako rodzica" 
                    onClick={handleAdd} 
                    disabled={isButtonDisabled}
                />
                
                {selectedAnimal && (
                    <div className={style.animalParent}>
                        <Select
                            options={animalsRelation}
                            onChange={setRelation}
                            value={relation}
                            isClearable
                            placeholder="Wybierz relację"
                        />
                        <div className={style.selectedAnimal}>
                            <h4>Wybrane zwierzę:</h4>
                            <p><strong>{selectedAnimal.name}</strong> ({selectedAnimal.species}, {selectedAnimal.breed})</p>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}

export default AddAnimalParents;
