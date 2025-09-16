'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AnimalsApi } from 'src/api';
import { IAnimal, Gender, AnimalSize } from 'src/constants/types';
import { OptionType } from 'src/components/layout/Forms/Select';
import style from './updateAnimal.module.scss'
import {
  Card,
  Input,
  Select,
  Button,
  FileDropzone,
  Tag,
  Icon,
  Checkbox,
  InputWrapper,
  RichTextEditor
} from 'src/components';
import PhotosOrganizer from '../../../new-animal/components/PhotosOrganizer';
import useAnimalInfo from 'src/components/hooks/useAnimalInfo';

interface AnimalUpdateFormProps {
  animal: IAnimal;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface CharacteristicItem {
  title: string;
  bool: boolean;
}

const speciesOptions = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
  { value: 'other', label: 'Other' },
];

const breedOptions = {
  dog: [
    { value: 'beagle', label: 'Beagle' },
    { value: 'terrier', label: 'Terrier' },
    { value: 'labrador', label: 'Labrador' },
  ],
  cat: [
    { value: 'british', label: 'British Shorthair' },
    { value: 'siamese', label: 'Siamese' },
    { value: 'persian', label: 'Persian' },
  ],
  other: [
    { value: 'other', label: 'Other' },
  ],
};

const statusOptions = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'ADOPTED', label: 'Adopted' },
  { value: 'RESERVED', label: 'Reserved' },
];

const statusMap: Record<string, string> = {
  'Do adopcji': 'AVAILABLE',
  'Ma właściciela': 'ADOPTED',
  'Kwarantanna': 'RESERVED'
};

const AnimalUpdateForm: React.FC<AnimalUpdateFormProps> = ({ 
  animal, 
  onSuccess, 
  onCancel 
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    gender: "MALE",
    birth_date: '',
    // image: '',
    size: '',
    // age: 0,
    descriptions: '',
    status: 'AVAILABLE',
    city: '',
    price: 0,
  });
  // const [photos, setPhotos] = useState<File[]>([]);

  const [characteristics, setCharacteristics] = useState<CharacteristicItem[]>([]);
  const { characteristics: animalCharacteristics } = useAnimalInfo();

  const [description, setDescriptions] = useState<string>('');

  useEffect(() => {
    if (animal) {
      setFormData({
        name: animal.name ?? '',
        species: animal.species ?? '',
        breed: animal.breed ?? '',
        gender: animal.gender ?? "MALE",
        birth_date: animal.birth_date ?? '',
        size: animal.size ?? AnimalSize.SMALL,
        status: animal.status ?? 'AVAILABLE',
        city: animal.city ?? '',
        price: animal.price ? animal.price : 0,
        descriptions: animal.descriptions ?? '',
        // image: animal.image ? animal.image : '',
      });

      setDescriptions(animal.descriptions ?? '');

      console.log("descriptionOld: ", animal.descriptions);

      // if (animal.gallery?.length) {
      //   const existingFiles = animal.gallery.map((url: string, idx: number) => {
      //     return new File([], `photo-${idx}.jpg`, { type: "image/jpeg" });
      //   });
      //   console.log("Gallerys: ", existingFiles);
      //   setPhotos(existingFiles);
      // }
  
      if (animal.characteristicBoard?.length > 0) {
        setCharacteristics(animal.characteristicBoard);
      } else if (animalCharacteristics.dog) {
        setCharacteristics(
          Object.entries(animalCharacteristics.dog).map(([key]) => ({
            title: key,
            bool: false,
          }))
        );
      }
    }
  }, [animal, animalCharacteristics]);

  const handleInputChange = (field: string, value: string | number | Gender) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const submitData = new FormData();
  
      // Add all form data EXCEPT descriptions (we'll add the updated one separately)
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'descriptions' && value !== null && value !== undefined) {
          submitData.append(key, value.toString());
        }
      });    
  
      // Append the UPDATED description (not the one from formData)
      submitData.append('descriptions', description);
  
      // Append characteristics
      characteristics.forEach((char, index) => {
        submitData.append(`characteristicBoard[${index}][title]`, char.title);
        submitData.append(`characteristicBoard[${index}][bool]`, char.bool.toString());
      });
  
      console.log("descriptionNew: ", description);
  
      await AnimalsApi.updateAnimal(animal.id, submitData);
      
      toast.success('Animal updated successfully!');
      onSuccess?.(); 
      router.refresh();
    } catch (error) {
      console.error('Error updating animal:', error);
      toast.error('Failed to update animal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCharacteristicChange = (title: string, bool: boolean) => {
    setCharacteristics(prev => 
      prev.map(char => 
        char.title === title ? { ...char, bool } : char
      )
    );
  };
  const currentBreedOptions = formData.species 
    ? breedOptions[formData.species as keyof typeof breedOptions] || breedOptions.other
    : breedOptions.other;

  if (!animal) {
    return (
      <div className={style.loadingContainer}>
        <p>Animal data not available</p>
        <Button onClick={onCancel}>Go Back</Button>
      </div>
    );
  }
  return (
    <div className={style.animalUpdateForm}>
        <div className={style.formHeader}>
          <h2>Update Animal Information</h2>
          <p>Edit the details for {animal.name}</p>
        </div>
          <div className={style.formSection}>    
            <div className={style.formRow}>
              <div className={style.fullWidth}>
                <Input
                  label="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              
              <Input
                label="Birth date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
              />
            </div>

            <div className={style.flexRow}>
              <Select
                label="Species"
                options={speciesOptions}
                value={speciesOptions.find(opt => opt.value === formData.species) || null}
                onChange={(option: OptionType | null) => 
                  handleInputChange('species', option?.value || '')
                }
              />
              
              <Select
                label="Breed"
                options={currentBreedOptions}
                value={currentBreedOptions.find(opt => opt.value === formData.breed) || null}
                onChange={(option: OptionType | null) => 
                  handleInputChange('breed', option?.value || '')
                }
              />
            </div>

            <InputWrapper label="Gender">
              <div className={style.genderSelect}>
                <Tag
                  selected={formData.gender === "MALE"}
                  onClick={() => handleInputChange('gender', "MALE")}
                >
                  Male
                  <Icon name="genderMale" />
                </Tag>
                <Tag
                  selected={formData.gender === "FEMALE"}
                  onClick={() => handleInputChange('gender', "FEMALE")}
                >
                  Female
                  <Icon name="genderFemale" />
                </Tag>
              </div>
            </InputWrapper>

            <Card className={style.section}>
              <h3>
                Zaprezentuj <mark>zdjęcia</mark>
              </h3>

              {/* <FileDropzone
                files={photos}
                setFiles={setPhotos}
              /> */}

              {/* <PhotosOrganizer
                photos={photos}
                setPhotos={setPhotos}
              /> */}

              <span className={style.caption}>
                Najlepiej na platformie będą wyglądać zdjęcia w formacie 4:3. Zdjęcia nie mogą przekraczać 5 MB. Dozwolone
                formaty to .png, .jpg, .jpeg
              </span>
            </Card>

              <div className={style.formSection}>
                <h3>Characteristics</h3>
                <div className={style.characteristicsGrid}>
                  {characteristics.map((char) => (
                    <Checkbox
                      key={char.title}
                      id={`char-${char.title}`}
                      label={char.title}
                      checked={char.bool}
                      onChange={(e) => handleCharacteristicChange(char.title, e.target.checked)}
                    />
                  ))}
                </div>
            </div>

            <Card className={style.section}>
              <h3>
                <mark>Opisz</mark> zwierzaka
              </h3>
              <RichTextEditor
                initialContent={description}
                placeholder="Napisz coś..."
                onChange={setDescriptions}
              />
              <span className={style.caption}>Opis będzie widoczny w jego profilu.</span>
            </Card>
          <div className={style.formRow}>
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
              
              <Input
                label="Price (€)"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                min="0"
              />
          </div>

          <Select
            label="Status"
            options={statusOptions}
            value={statusOptions.find(opt => opt.value === formData.status) || null}
            onChange={(option: OptionType | null) => 
              handleInputChange('status', option?.value || '')
            }
          />
          <div className={style.statusSelect}>
            <Tag
              selected={formData.status === "Ma właściciela"}
              onClick={() => handleInputChange('status', statusMap["Ma właściciela"])}
            >
              Ma właściciela
            </Tag>
            <Tag
              selected={formData.status === "Kwarantanna"}
              onClick={() => handleInputChange('status', statusMap["Kwarantanna"])}
            >
              Kwarantanna
            </Tag>
            <Tag
              selected={formData.status === "Do adopcji"}
              onClick={() => handleInputChange('status', statusMap["Do adopcji"])}
            >
              Do adopcji
            </Tag>
          </div>

        </div>
      <form onSubmit={handleSubmit} className={style.formContainer}>
          <div className={style.formActions}>
            <Button
              type="button"
              className={style.submit}
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={style.submit}
              disabled={loading}
            >
              Update Animal
            </Button>
          </div>
        </form>
    </div>
  );
};

export default AnimalUpdateForm;