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
import AddAnimalParents from '../../../new-animal/components/AddAnimalParents';
import classNames from 'classnames';

// type Parent = {
//   id: number;
//   animal_id?: number;
//   name: string;
//   relation?: string | OptionType;
//   image?: string;
//   isNew?: boolean;
// };

type Parent = {
  id: number;          // id zwierzaka (rodzica)
  animal_id?: number; // id relacji z backendu
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

type AddParents = {
  // animal: number;
  parent: number;
  relation?: string | OptionType;
}


type PhotosOrganizerProps = {
  photos: File[];            
  setPhotos: (photos: File[]) => void;
};

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
// const statusOptions = [
//   { value: 'AVAILABLE', label: 'Available' },
//   { value: 'ADOPTED', label: 'Adopted' },
//   { value: 'RESERVED', label: 'Reserved' },
// ];

// const statusMap: Record<string, string> = {
//   'Do adopcji': 'AVAILABLE',
//   'Ma właściciela': 'ADOPTED',
//   'Kwarantanna': 'RESERVED'
// };

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
  // const [newParents, setNewParents] = useState<AddParents[]>([]);

  const [selectSpeciesValue, setSelectSpeciesValue] = useState<string | undefined>('');

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
          parents: animal.parents ?? [],
        });
  
        setDescriptions(animal.descriptions ?? '');

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
        if (key !== 'descriptions' && value !== null && value !== undefined) {
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
                onChange={(e) => handleInputChange('birth_date', e.target.value)}
              />
            </div>

            <div className={style.flexRow}>
              <Select
                label="Species"
                options={speciesOptions}
                value={speciesOptions.find(opt => opt.value === formData.species) || null}
                onChange={(option: OptionType | null) => {
                  handleInputChange('species', option?.value || '')
                  setSelectSpeciesValue(option?.value)
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

          {/* <Select
            label="Status"
            options={statusOptions}
            value={statusOptions.find(opt => opt.value === formData.status) || null}
            onChange={(option: OptionType | null) => 
              handleInputChange('status', option?.value || '')
            }
          /> */}
          
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

        </div>
        <Card className={style.section}>
          <h3>
            Znajdź <mark>rodzinę</mark> zwierzaka
          </h3>

          <div className={style.familyTreeBlock}>

            <div 
              className={style.addParents} 
              onClick={() => setIsParentsAdd((prev) => !prev)} aria-disabled={parents.length == 2}
              // onClick={() => {
              //   setParents(prev =>
              //     prev.map((p, i) =>
              //       i === index
              //         ? (p.isNew ? null : { ...p, toDelete: true })
              //         : p
              //     ).filter(Boolean) 
              //   );
              // }}
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
            selectSpeciesValue={selectSpeciesValue}
            onAddParent={(parent) => {
              // Mark new parents as isNew: true
              const newParent = { ...parent, isNew: true };
              setParents((prev) => [...prev, newParent]);
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
  );
};

export default AnimalUpdateForm;