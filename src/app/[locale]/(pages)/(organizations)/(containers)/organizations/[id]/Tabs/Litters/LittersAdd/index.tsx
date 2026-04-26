'use client'
import { useState, ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { Button, Card, Icon, Input, RichTextEditor, Select } from "src/components";
import style from './littersAdd.module.scss';
import { OrganizationsApi } from "src/api";
import { IOrganization } from "src/constants/types";
import AnimalSelect from "src/components/layout/Forms/Select/AnimalSelect";

type AddLittersProps = {
  setAddLitter: (toggle: boolean) => void;
  organization: IOrganization;
  onLitterAdded: (data: any) => void;
};

const AddLitters = ({ setAddLitter, organization, onLitterAdded }: AddLittersProps) => {
  const t = useTranslations('pages.organizations.addLitter');
  const tCommon = useTranslations('common.action');

  const statusOptions = [
    { value: 'ACTIVE', label: t('statusOptions.ACTIVE') },
    { value: 'CLOSED', label: t('statusOptions.CLOSED') },
    { value: 'DRAFT', label: t('statusOptions.DRAFT') },
  ];

  const [litterForm, setLitterForm] = useState({
    title: '',
    birth_date: '',
    description: '',
    species: '',
    breed: 2,
    status: 1,
    organization: organization.id
  });

  const handleChange = (field: string, value: string) => {
    setLitterForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await OrganizationsApi.postOrganizationLitters(litterForm);
      onLitterAdded(litterForm);
    } catch (err) {
      console.error(err);
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
          label={t('title')}
          placeholder={t('titlePlaceholder')}
          value={litterForm.title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('title', e.target.value)}
          required
        />

        <Input
          label={t('birthDate')}
          type="date"
          value={litterForm.birth_date}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('birth_date', e.target.value)}
        />
      </div>

      <div className={style.flexRow}>
        <AnimalSelect handleChange={handleChange} />
      </div>

      <div>
        <h3>{t('describeTitle')}</h3>
        <RichTextEditor
          placeholder={t('descriptionPlaceholder')}
          onChange={(value: string) => handleChange('description', value)}
        />
      </div>

      <Select
        label={t('status')}
        options={statusOptions}
        value={statusOptions.find((opt: any) => opt.value === litterForm.status) || null}
        onChange={(option: any) => handleChange('status', option?.value || '')}
      />

      <Button label={tCommon('add')} width="200px" onClick={handleSubmit} />
    </Card>
  );
};

export default AddLitters;
