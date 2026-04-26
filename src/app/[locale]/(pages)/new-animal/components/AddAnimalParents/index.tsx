'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import { useTranslations } from 'next-intl';

import { AnimalsApi } from 'src/api';
import {
    Button,
    Card,
    Input,
    Loader,
    Select,
} from 'src/components';
import { OptionType } from 'src/components/layout/Forms/Select';
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

const getLabel = (val: any): string => {
    if (val === null || val === undefined) return '-';
    if (typeof val === 'object') return val.label ?? val.name ?? String(val);
    return String(val);
};

const AddAnimalParents = ({ className, onAddParent, parents, childAnimal, setIsParentsAdd }: AnimalAddParentsProps) => {
    const t = useTranslations('pages.newAnimal.addParents');

    const animalsRelation = [
        { value: 'MOTHER', label: t('relation.MOTHER') },
        { value: 'FATHER', label: t('relation.FATHER') },
    ];

    const animalSpecies = [
        { value: '1', label: t('species.dog') },
        { value: '2', label: t('species.cat') },
    ];

    const animalRace: Record<string, { value: string; label: string }[]> = {
        dog: [
            { value: 'beagle', label: 'Beagle' },
            { value: 'terrier', label: 'Terrier' },
        ],
        cat: [
            { value: 'british', label: 'British' },
        ],
    };

    const [searchName, setSearchName] = useState<string>('');
    const [relation, setRelation] = useState<OptionType | null>(null);
    const [selectSpeciesValue, setSelectSpeciesValue] = useState<OptionType>(null);
    const [selectRaceValue, setSelectRaceValue] = useState<OptionType>(null);
    const [selectedAnimal, setSelectedAnimal] = useState<IAnimal | null>(null);
    const [previouslySelectedAnimals, setPreviouslySelectedAnimals] = useState<IAnimal[]>([]);
    const [animals, setAnimals] = useState<IAnimal[]>([]);
    const [loading, setLoading] = useState(false);

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

    const filteredRaceOpt = selectSpeciesValue
        ? animalRace[selectSpeciesValue.value] || []
        : [];

    const isButtonDisabled = !selectedAnimal || !relation?.value;

    useEffect(() => {
        const filters: any = {};
        if (searchName) filters.name = searchName;
        if (selectSpeciesValue?.value) filters.species = [selectSpeciesValue.value];
        if (selectRaceValue?.value) filters.breed = [selectRaceValue.value];
        debouncedSearch(filters);
    }, [searchName, selectSpeciesValue, selectRaceValue, debouncedSearch]);

    const handleAdd = () => {
        if (!selectedAnimal || (parents?.length ?? 0) >= 2) return;

        if (relation?.value == null) {
            toast.error(t('toast.mustSelectRelation'));
            return;
        }

        if (
            (selectedAnimal.gender === 'MALE' && relation.value === 'MOTHER') ||
            (selectedAnimal.gender === 'FEMALE' && relation.value === 'FATHER')
        ) {
            toast.error(t('toast.relationGenderMismatch'));
            return;
        }

        const newParent: Parent = {
            animal_id: selectedAnimal.id,
            name: selectedAnimal.name,
            relation: relation?.value,
            gender: selectedAnimal.gender,
            photos: selectedAnimal.image ?? undefined,
        };

        onAddParent(newParent);
        setPreviouslySelectedAnimals(prev => [...prev, selectedAnimal]);
        setSelectedAnimal(null);
        setSearchName('');
        setSelectSpeciesValue(null);
        setSelectRaceValue(null);
        setRelation(null);
    };

    const handleAnimalSelect = (animal: IAnimal) => {
        if (previouslySelectedAnimals.some(a => a.id === animal.id) || parents?.some(a => a?.id === animal.id)) {
            toast.error(t('toast.alreadySelected'));
            return;
        }
        if (previouslySelectedAnimals.some(a => a.gender === animal.gender) || parents?.some(a => a?.gender === animal.gender)) {
            toast.error(t('toast.sameGender'));
            return;
        }
        if (animal.id === childAnimal?.id) {
            toast.error(t('toast.cannotBeSelf'));
            return;
        }
        if (childAnimal?.age != null && animal.age <= childAnimal.age) {
            toast.error(t('toast.parentMustBeOlder'));
            return;
        }
        setSelectedAnimal(animal);
    };

    return (
        <Card className={classNames(style.container, className)}>
            <Input
                id='search-animal'
                name='search-animal'
                label={t('searchLabel')}
                placeholder={t('searchPlaceholder')}
                value={searchName}
                onChangeText={setSearchName}
            />

            <div className={style.flexRow}>
                <Select
                    label={t('speciesLabel')}
                    options={animalSpecies}
                    onChange={setSelectSpeciesValue}
                    value={selectSpeciesValue}
                    isClearable
                />
                <Select
                    label={t('breedLabel')}
                    options={filteredRaceOpt}
                    onChange={setSelectRaceValue}
                    value={selectRaceValue}
                    isClearable
                />
            </div>

            <div className={style.animalsList}>
                <h4>{t('availableAnimals')}</h4>

                {loading ? (
                    <Loader />
                ) : animals.length === 0 ? (
                    <p>{t('noAnimals')}</p>
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
                                    alt={animal.name}
                                />
                                <div className={style.animalInfo}>
                                    <h5>{animal.name}</h5>
                                    <p>{getLabel(animal.species)} • {getLabel(animal.breed)}</p>
                                    <p>{t('genderLabel')} {getLabel(animal.gender)}</p>
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
                    label={t('addAsParent')}
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
                            placeholder={t('selectRelation')}
                        />
                        <div className={style.selectedAnimal}>
                            <h4>{t('selectedAnimal')}</h4>
                            <p><strong>{selectedAnimal.name}</strong> ({getLabel(selectedAnimal.species)}, {getLabel(selectedAnimal.breed)})</p>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default AddAnimalParents;
