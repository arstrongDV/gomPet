'use client'
import style from './AddParents.module.scss'
import { useState } from "react"
import { Gender } from 'src/constants/types';
import { OptionType } from 'src/components/layout/Forms/Select';
import PhotosOrganizer from '../PhotosOrganizer';
import { 
    Card, 
    Input, 
    Select, 
    InputWrapper, 
    Tag, 
    Icon, 
    Checkbox, 
    FileDropzone,
    Button
} from "src/components"

type ParentsOfParent = {
    name: string;
    photo: File;
    parentsOfWho: string;
}

type Parent = {
    name: string;
    gender: Gender;
    photos: File[];
    grandparents?: ParentsOfParent[];
};

type AnimalAddParentsProps = {
    className?: string;
    onAddParent: (parent: Parent) => void;
    selectSpeciesValue?: OptionType;
    parents?: Parent[];
};

type AnimalKey = string;

const AddAnimalParents = ({ className, onAddParent, selectSpeciesValue, parents }: AnimalAddParentsProps) => {
    const [name, setName] = useState<string>('');
    const [gender, setGender] = useState<Gender>(Gender.MALE);
    const [hasMetrics, setHasMetrics] = useState<boolean>(false);
    const [photos, setPhotos] = useState<File[]>([]);
    const [selectRaceValue, setSelectRaceValue] = useState<OptionType>(null);

    const [parentsOfWho, setParentsOfWho] = useState<OptionType | null>(null);
    const [animalParents, setAnimalParents] = useState<ParentsOfParent[]>([]);

    const animalRace: Record<AnimalKey, { value: string; label: string }[]> = {
        dog: [
            { value: 'beagle', label: 'Beagle' },
            { value: 'terrier', label: 'Terrier' }
        ],
        cat: [
            { value: 'british', label: 'British' }
        ]
    };

    const filteredRaceOpt = selectSpeciesValue
        ? (animalRace[`${selectSpeciesValue.value}`] || []).filter(
            (opt) => opt.value !== selectRaceValue?.value
        )
        : [];

    const handleAdd = () => {
        if (!name || (parents?.length ?? 0) >= 6) return;
        
        const newParent: Parent = {
            name,
            gender,
            photos,
            grandparents: []
        };

        // If we're adding grandparents (parents already exist)
        if (parentsOfWho && (parents?.length ?? 0) >= 2) {
            const newGrandparent: ParentsOfParent = {
                name,
                photo: photos[0] || null,
                parentsOfWho: String(parentsOfWho.value)
            };
            
            // Update the animalParents array
            const updatedAnimalParents = [...animalParents, newGrandparent];
            setAnimalParents(updatedAnimalParents);
            
            // Add to the parent's parentsOfParent array
            newParent.grandparents = updatedAnimalParents.filter(n => n.parentsOfWho === String(parentsOfWho.value));
        }

        onAddParent(newParent);
        setName('');
        setGender(Gender.MALE);
        setHasMetrics(false);
        setPhotos([]);
        setParentsOfWho(null);
    };

    return (
        <Card className={className}>
            <h3>
                Dodawanie <mark>rodziny</mark>
            </h3>

            <div className={style.fullWidth}>
                <Input
                    id='animal-name'
                    name='animal-name'
                    label={'Nazwij zwierzaka'}
                    placeholder={'Jak się wabi?'}
                    value={name}
                    onChangeText={setName}
                    required
                />
            </div>

            <div className={style.flexRow}>
                <Select
                    label={'Rasa'}
                    options={filteredRaceOpt}
                    onChange={setSelectRaceValue}
                    value={selectRaceValue}
                />

                {(parents?.length ?? 0) >= 2 && (
                    <Select
                        label={'Czyj rodzic'}
                        options={parents?.slice(0, 2).map((p) => ({ value: p.name, label: p.name })) ?? []}
                        onChange={setParentsOfWho}
                        value={parentsOfWho}
                    />
                )}

                <InputWrapper label={'Płeć'}>
                    <div className={style.genderSelect}>
                        <Tag
                            selected={gender === Gender.MALE}
                            onClick={() => setGender(Gender.MALE)}
                        >
                            {(parents?.length ?? 0) <= 1 ? 'Ojciec' : 'Dziadek'}
                            <Icon name='genderMale' />
                        </Tag>
                        <Tag
                            selected={gender === Gender.FEMALE}
                            onClick={() => setGender(Gender.FEMALE)}
                        >
                            {(parents?.length ?? 0) <= 1 ? 'Matka' : 'Babcia'}
                            <Icon name='genderFemale' />
                        </Tag>
                    </div>
                </InputWrapper>
            </div>

            <Checkbox
                id='animal-has-metrics'
                label={'Czy zwierzak ma metrykę?'}
                checked={hasMetrics}
                onClick={() => setHasMetrics((prev) => !prev)}
            />

            <h3>
                Zaprezentuj <mark>zdjęcia</mark>
            </h3>

            <FileDropzone
                files={photos}
                setFiles={setPhotos}
            />

            <PhotosOrganizer
                photos={photos}
                setPhotos={setPhotos}
            />

            <span className={style.caption}>
                Najlepiej na platformie będą wyglądać zdjęcia w formacie 4:3. Zdjęcia nie mogą przekraczać 5 MB. Dozwolone
                formaty to .png, .jpg, .jpeg
            </span>

            <Button 
                className={style.buttonAdd} 
                icon='plus' 
                label="Dodaj" 
                onClick={handleAdd} 
            />
        </Card>
    )
}

export default AddAnimalParents;