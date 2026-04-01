'use client'
import { useState, ChangeEvent, useEffect } from "react";
import { Button, Card, Icon, Input, RichTextEditor, Select } from "src/components";
import style from './littersAdd.module.scss';
import { OptionType } from "dayjs";
import { OrganizationsApi } from "src/api";
import { IOrganization } from "src/constants/types";
import AnimalSelect from "src/components/layout/Forms/Select/AnimalSelect";

type AddLittersProps = {
  setAddLitter: (toggle: boolean) => void;
  organization: IOrganization;
  onLitterAdded: (data: any) => void;
};


const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'CLOSED', label: 'Closed' },
    { value: 'DRAFT', label: 'Draft' },
];

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

const AddLitters = ({ setAddLitter, organization, onLitterAdded }: AddLittersProps) => {
  const [litterForm, setLitterForm] = useState({
    title: '',
    birth_date: '',
    description: '',
    species: '',
    breed: 2,
    status: 1,
    organization: organization.id
  });

  const currentBreedOptions = litterForm.species 
  ? breedOptions[litterForm.species as keyof typeof breedOptions] || breedOptions.other
  : breedOptions.other;

  const handleChange = (field: string, value: string) => {
    setLitterForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async() => {
    try{
      
      const res = await OrganizationsApi.postOrganizationLitters(litterForm);
      onLitterAdded(litterForm);
      console.log(res)
    }catch(err){
      console.log(err)
    }
  }

  return (
    <Card className={style.container}>
      <button
        className={style.clouseBtn}
        onClick={() => setAddLitter(false)}
      >
        <Icon className={style.btnIcon} name="x" />
      </button>

      <div className={style.flexRow}>
        <Input
          id="title"
          name="title"
          className={style.titleInput}
          label="Title"
          placeholder="Wpisz tytuł"
          value={litterForm.title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('title', e.target.value)}
          required
        />

        <Input
          label="Birth date"
          type="date"
          value={litterForm.birth_date}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('birth_date', e.target.value)}
        />
      </div>
      <div className={style.flexRow}>
        {/* <Select
            label="Species"
            options={speciesOptions}
            value={speciesOptions.find(opt => opt.value === litterForm.species) || null}
            onChange={(option: OptionType | null) => {
                handleChange('species', 1)
                }
            }
        />
            
        <Select
            label="Breed"
            options={currentBreedOptions}
            value={currentBreedOptions.find(opt => opt.value === litterForm.breed) || null}
            onChange={(option: OptionType | null) => 
                handleChange('breed', 2)
            }
        /> */}
        <AnimalSelect handleChange={handleChange} />
      </div>

      <div>
        <h3>
          <mark>Opisz</mark> zwierzaka
        </h3>
        <RichTextEditor
          placeholder="Napisz coś o miocie"
          onChange={(value: string) => handleChange('description', value)}
        />
      </div>

    <Select 
        label="Status"
        options={statusOptions}
        value={statusOptions.find((opt: any) => opt.value === litterForm.status) || null}
        onChange={(option: any) => handleChange('status', option?.value || '')}
    />

      <Button label="Dodaj" width="200px" onClick={handleSubmit} />
    </Card>
  );
};

export default AddLitters;
