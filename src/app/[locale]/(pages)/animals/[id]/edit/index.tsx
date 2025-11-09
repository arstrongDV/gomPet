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
  RichTextEditor,
  SectionHeader
} from 'src/components';
import PhotosOrganizer from '../../../new-animal/components/PhotosOrganizer';
import useAnimalInfo from 'src/components/hooks/useAnimalInfo';
import AddAnimalParents from '../../../new-animal/components/AddAnimalParents';
import classNames from 'classnames';

type Parent = {
  id: number;
  animal_id?: number;
  name: string;
  relation?: string;
  photos?: string;
  isNew?: boolean;
}

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

const urlToFile = async (url: string, filename: string): Promise<File> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error('Error converting URL to File:', error);
    throw error;
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

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
    image: '',
    size: '',
    descriptions: '',
    status: 'AVAILABLE',
    city: '',
    parents: [],
    price: 0,
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [characteristics, setCharacteristics] = useState<CharacteristicItem[]>([]);
  const { characteristics: animalCharacteristics } = useAnimalInfo();
  const [description, setDescriptions] = useState<string>('');
  const [isParentsAdd, setIsParentsAdd] = useState<boolean>(false);
  const [parents, setParents] = useState<Parent[]>([]);
  const [oldParents, setOldParents] = useState<Parent[]>([]);

  const [price, setPrice] = useState<string>('');
  const [hasPrice, setHasPrice] = useState<boolean>(false);

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
          price: animal.price !== '0.00' ? animal.price : '',
          descriptions: animal.descriptions ?? '',
          parents: animal.parents ?? [],
        });

        setDescriptions(animal.descriptions ?? '');

        if (animal.price !== '0.00') {
          setHasPrice(true);
          setPrice(animal.price);
        } else {
          setHasPrice(false);
          setPrice(''); 
        }

      const loadExistingImages = async () => {
        const imageFiles: File[] = [];
        try {
          if (animal.image) {
            const mainImageFile = await urlToFile(
              animal.image, 
              'main-image.jpg'
            );
            imageFiles.push(mainImageFile);
          }
          if (animal.gallery?.length) {
            const animalSlice = animal.gallery.slice(1)
            for (const galleryItem of animalSlice) {
              if (galleryItem.image) {
                const galleryFile = await urlToFile(
                  galleryItem.image,
                  `gallery-${galleryItem.id}.jpg`
                );
                imageFiles.push(galleryFile);
              }
            }
          }
          setPhotos(imageFiles);
          console.log("Converted images:", imageFiles);
        } catch (error) {
          console.error("Failed to load existing images:", error);
          toast.error("Could not load existing images");
        }
      }
      loadExistingImages();
  
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

      if (animal.parents) {
        // Mark existing parents as not new
        const existingParents = animal.parents.map(parent => ({
          ...parent,
          isNew: false
        }));
        setParents(existingParents);
        setOldParents(existingParents);
      } else {
        setParents([]);
      }
      console.log(animal)
      console.log(parents)
    };

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

    const galleryWithBase64 = await Promise.all(
      photos.map(async (photo) => {
        const base64 = await fileToBase64(photo);
        return {
          image: base64
        };
      })
    );
  
    try {
      const submitData = new FormData();
  
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'descriptions' && key !== 'price' && value !== null && value !== undefined) {
          submitData.append(key, value.toString());
        }
      });  
  
      submitData.append('descriptions', description);

      if (photos.length === 0) {
        toast.error('Musisz nadac zdjecia')
        setLoading(false);
        return;
      }

      if (photos.length > 0) {
        const base64 = await fileToBase64(photos[0]);
        submitData.append('image', base64);
      }

      if (!hasPrice) {
        setPrice('0');
        submitData.append('price', '0'); 
      } else {
        submitData.append('price', price);
      }
      galleryWithBase64.forEach((item, index) => {
        submitData.append(`gallery[${index}][image]`, item.image);
      });

      characteristics.forEach((char, index) => {
        submitData.append(`characteristicBoard[${index}][title]`, char.title);
        submitData.append(`characteristicBoard[${index}][bool]`, char.bool.toString());
      });
  
      const animals_res = await AnimalsApi.updateAnimal(animal.id, submitData);

      console.log("parents: ", parents)
      console.log("animal: ", animal)
      if (animals_res.status === 200) {
        try {
          for (const p of oldParents) {
            await AnimalsApi.clearAnimalParents(p.id);
          }
          if (parents.length > 0) {
            for (const parent of parents) {
              const parentData = {
                animal: animal.id,  
                parent: parent.animal_id,  
                relation: parent.relation ? parent.relation : (parent.gender == "FEMALE" ? "MOTHER" : "FATHER")
              };
              console.log("Adding parent:", parentData);
              await AnimalsApi.addAnimalParents(parentData);
            }
          }
        } catch (err) {
          console.error("Failed to update parents", err);
          toast.error("Failed to update parents");
        }
      }
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
        <SectionHeader
          title={'Update Animal Information'}
          subtitle={`Edit the details for ${animal.name}`}
          margin
        />
        <div className={style.container}>
          <Card className={style.section}>
            <h3>
              Informacje <mark>podstawowe</mark>
            </h3>
            <div className={style.fullWidth}>
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div className={style.flexRow}>
              <Select
                label="Species"
                options={speciesOptions}
                value={speciesOptions.find(opt => opt.value === formData.species) || null}
                onChange={(option: OptionType | null) => {
                  handleInputChange('species', option?.value || '')
                }
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

              <Input
                label="Birth date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => handleInputChange('birth_date', e.target.value)}
              />
            </div>

            <div className={style.formRow}>
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
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

            <InputWrapper label={'Rozmiar'}>
              <div className={style.genderSelect}>
                <Tag
                  selected={formData.size === AnimalSize.SMALL}
                  onClick={() => handleInputChange('size', AnimalSize.SMALL)}
                >
                  Mały
                </Tag>
                <Tag
                  selected={formData.size === AnimalSize.MEDIUM}
                  onClick={() => handleInputChange('size', AnimalSize.MEDIUM)}
                >
                  Średni
                </Tag>
                <Tag
                  selected={formData.size === AnimalSize.LARGE}
                  onClick={() => handleInputChange('size', AnimalSize.LARGE)}
                >
                  Duży
                </Tag>
              </div>
            </InputWrapper>

            <Checkbox
            id='animal-has-prise'
            label={'Ustawic cennę?'}
            checked={hasPrice}
            onClick={() => setHasPrice((prev) => !prev)}
          />

          {hasPrice && (
            <Input
              id='animal-price'
              name='animal-price'
              label={'Cena'}
              placeholder='Napisz cennę...'
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="1"
            />
          )}

            {/* <Input
              id='animal-price'
              name='animal-price'
              label={'Cena'}
              placeholder='Napisz cennę...'
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
              min="1"
            /> */}
          </Card> 

          <Card className={style.section}>
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
          </Card>
          <Card className={style.section}>
            <h3>
              <mark>Cechy</mark> charakterystyczne
            </h3>
              <div className={style.characteristics}>
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
          </Card>
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
        
        <Card className={style.section}>
          <h3>
            Aktualny <mark>status</mark>
          </h3>
          <div className={style.statusSelect}>
            <Tag
              selected={formData.status === "ADOPTED"}
              onClick={() => handleInputChange('status', "ADOPTED")}
            >
              Ma właściciela
            </Tag>

            <Tag
              selected={formData.status === "RESERVED"}
              onClick={() => handleInputChange('status', "RESERVED")}
            >
              Kwarantanna
            </Tag>

            <Tag
              selected={formData.status === "AVAILABLE"}
              onClick={() => handleInputChange('status', "AVAILABLE")}
            >
              Do adopcji
            </Tag>
          </div>
        </Card>
        <Card className={style.section}>
          <h3>
            Znajdź <mark>rodzinę</mark> zwierzaka
          </h3>
          <div className={style.familyTreeBlock}>
            <div 
              className={style.addParents} 
              onClick={() => setIsParentsAdd((prev) => !prev)} aria-disabled={parents.length == 2}
            >
              <Icon name='plus' />
            </div>

            {parents.map((p, index) => (
              <div key={index} className={style.parent}>
                <Icon 
                  className={style.deleteIcon}
                  name='x' 
                  onClick={() => {
                    setParents(prev => prev.filter((_, i) => i !== index));
                  }} 
                />
                <img 
                  className={style.image}
                  src={p.photos
                    ? p.photos
                    : ''} 
                  draggable={false} 
                  alt="parent_photo"
                />
                <p>{p.name}</p>
              </div>
            ))}
          </div>

          <AddAnimalParents 
            className={classNames(style.cardAddParents, { [style.show]: isParentsAdd })} 
            parents={parents}
            childAnimal={animal}
            onAddParent={(parent) => {
              const newParent = { ...parent, isNew: true };
              setParents((prev) => [...prev, newParent as Parent]);
              setIsParentsAdd(false); 
            }}
          />
          <span className={style.caption}>Posłuży to do wyświetlenia drzewa genealogicznego zwierzęcia.</span>
        </Card>

        <form onSubmit={handleSubmit} className={style.formContainer}>
            <div className={style.formActions}>
              <Button
                type="button"
                className={style.submit}
                onClick={onCancel}
                disabled={loading}
                label="Cancel"
              />
                
              <Button
                type="submit"
                className={style.submit}
                disabled={loading}
                label="Update Animal"
              />
            </div>
          </form>
        </div>
    </div>
  );
};

export default AnimalUpdateForm;