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
      species: {
        value: '',
        label: ''
      },
      breeds: {
        value: '',
        label: ''
      },
      description: '',
      birth_date: '',
      status: '',
      owner: null,
      created_at: ''
    });
  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (!litter) return;
      setIsLoading(true);
      try {
        setFormData({
          id: litter.id ?? '',
          breeds: {
            value: litter.breed.value ?? '',
            label: litter.breed.label ?? '',
          },
          species: {
            value: litter.species.value ?? '',
            label: litter.species.label ?? '',
          },
          title: litter.title ?? '',
          description: litter.description ?? '',
          birth_date: litter.birth_date ?? '',
          status: litter.status ?? '',
          owner: litter.owner ?? null,
          created_at: litter.created_at ?? '',
        });
      } catch (err) {
        toast.error("Nie mogę pobrać danych");
        console.error(err);
      }
      finally {
      setIsLoading(false);
      }
    }, [litter]);

    console.log("litter: ", litter);
    console.log("formData: ", formData.breeds.value);

    const hasChanges = () => {
      if (!litter || !formData) return false;
      const speciesChanged =
        (formData.species?.value ?? '') !== (litter.species?.value ?? '');
      // const breedChanged =
      //   (formData.breeds?.value ?? '') !== (litter.breed?.value ?? '');
      
      return (
        formData.title !== (litter.title ?? '') ||
        formData.description !== (litter.description ?? '') ||
        formData.birth_date !== (litter.birth_date ?? '') ||
        formData.status !== (litter.status ?? '') ||
        speciesChanged
        // breedChanged
      );
    };
    
    const disabledButton = isLoading || !hasChanges();

    const handleSubmit = async() => {
        try{
            const res = await OrganizationsApi.updateOrganizationLitters(Number(params.id), formData);
            console.log(res);
            onSuccess?.();
        }catch(err){
            console.log(err);
            onCancel?.();
        }
    }

    const handleChange = (field: string, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

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
            initialState={{
              speciesOpt: formData?.species && {value: formData?.species.value, label: formData?.species.label},
              breedOpt: formData?.breeds && {value: formData?.breeds.value, label: formData?.breeds.label}
            }}
            handleChange={handleChange}
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