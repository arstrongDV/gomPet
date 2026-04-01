'use client'
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button, Card, Input, SectionHeader, Select, Textarea } from "src/components";
import AnimalSelect from "src/components/layout/Forms/Select/AnimalSelect";
import { ILitter } from "src/constants/types";

import style from './litterEdit.module.scss'
import { OrganizationsApi } from "src/api";
import { useParams } from "next/navigation";

type LittersEditFormProps = {
    onSuccess?: () => void;
    onCancel?: () => void;
    litter?: ILitter;
}

const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'CLOSED', label: 'Closed' },
    { value: 'DRAFT', label: 'Draft' },
];

const LittersEditForm = ({ onSuccess, onCancel, litter }: LittersEditFormProps) => {
    const params = useParams();

    const [formData, setFormData] = useState({
      id: '',
      title: '',
      species: null as any,
      breed: null as any,
      description: '',
      birth_date: '',
      status: '',
      owner: null as any,
      created_at: ''
    });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!litter) return; // Jeśli danych jeszcze nie ma, nic nie rób
    setIsLoading(true);
    try {
      setFormData({
        id: String(litter.id ?? ''),
        breed: litter.breed ?? null, // Nie buduj obiektu ręcznie, weź cały z API
        species: litter.species ?? null,
        title: litter.title ?? '',
        description: litter.description ?? '',
        birth_date: litter.birth_date ?? '',
        status: litter.status ?? '',
        owner: litter.owner ?? null,
        created_at: litter.created_at ?? '',
      });
    } catch (err) {
      console.error("Błąd mapowania:", err);
    } finally {
      setIsLoading(false);
    }
  }, [litter]);

    const hasChanges = () => {
      if (!litter || !formData) return false;

      const getID = (val: any) => (typeof val === 'object' && val !== null ? String(val.value) : String(val ?? ''));
    
      const speciesChanged = getID(formData.species) !== getID(litter.species);
      const breedChanged = getID(formData.breed) !== getID(litter.breed);

      console.log(speciesChanged, breedChanged);
    
      return (
        formData.title !== (litter.title ?? '') ||
        formData.description !== (litter.description ?? '') ||
        formData.birth_date !== (litter.birth_date ?? '') ||
        formData.status !== (litter.status ?? '') ||
        speciesChanged ||
        breedChanged
      );
    };
    
    const disabledButton = isLoading || !hasChanges();

    const handleSubmit = async() => {
        try{
          const payload = {
            ...formData,
            // Jeśli to obiekt, bierzemy .value. Jeśli to już ID, bierzemy value.
            species: typeof formData.species === 'object' && formData.species !== null 
                     ? formData.species.value 
                     : formData.species,
            breed: typeof formData.breed === 'object' && formData.breed !== null 
                   ? formData.breed.value 
                   : formData.breed,
          };
            const res = await OrganizationsApi.updateOrganizationLitters(Number(params.id), payload);
            console.log(res);
            onSuccess?.();
        }catch(err){
            console.log(err);
            onCancel?.();
        }
    }

    const handleChange = (field: string, value: any) => {
      setFormData(prev => {
        return { ...prev, [field]: value };
      });
    };

    if (isLoading || !formData.id) {
      return <div>Ładowanie danych miotu...</div>; // Lub Twój komponent Spinnera
    }

    return(
        <>
      <SectionHeader
        title={'Aktualizuj zwierzaka'}
        subtitle={'Polepsz zwierzę na platformie'}
        margin
      />

      <div className={style.container}>
        {/* BASIC DATA */}
        <Card className={style.section}>
          <h3>
            Informacje <mark>podstawowe</mark>
          </h3>
          <AnimalSelect
            key={formData.id}
            initialState={{
              speciesOpt: formData?.species && {value: formData?.species.value, label: formData?.species.label},
              breedOpt: formData?.breed && {value: formData?.breed.value, label: formData?.breed.label}
            }}
            handleChange={handleChange}
            // isAdding
          />
          <span className={style.caption}>Gatunek i rasa, którą obejmuje ten miot.</span>
        </Card>
        {/* BASIC DATA */}

        {/* DESCRIPTION */}
        <Card className={style.section}>
          <h3>
            Krótki <mark>Tytul</mark> 
          </h3>
          <Input
            id="title"
            name="title"
            className={style.titleInput}
            label="Tytul"
            placeholder="Wpisz tytuł"
            value={formData.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('title', e.target.value)}
            required
          />

          <h3>
            Krótki <mark>opis</mark> miotu
          </h3>
          <Textarea
            className={style.textarea}
            label='Krótki opis (opcjonalnie)'
            placeholder={'Opisz krótko miot...'}
            value={formData.description}
            onChangeText={(value: any) => handleChange('description', value)}
          />
        </Card>
        {/* DESCRIPTION */}

        {/* DATE */}
        <Card className={style.section}>
          <h3>
            Przewidywana <mark>data</mark> miotu
          </h3>

          <Input
            type='date'
            label='Kiedy pojawi się miot?'
            placeholder={'Opisz krótko miot...'}
            value={formData.birth_date}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('birth_date', e.target.value)}
          />
        </Card>
        {/* DATE */}

        {/* STATUS */}
        <Card className={style.section}>
          <h3>
            Aktualny <mark>status</mark>
          </h3>
          <Select 
              label="Status"
              options={statusOptions}
              value={statusOptions.find((opt: any) => opt.value === formData.status) || null}
              onChange={(option: any) => handleChange('status', option?.value || '')}
          />

          <span className={style.caption}>Status jest widoczny w widoku profilu hodowli w zakładce “Mioty”.</span>
        </Card>
        {/* STATUS */}

        <Button
          className={style.submit}
          disabled={disabledButton}
          label={'Utwórz miot'}
          onClick={handleSubmit}
        />
      </div>
    </>
    )
}

export default LittersEditForm;
