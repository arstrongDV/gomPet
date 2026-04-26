'use client';

import React, { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { OrganizationsApi } from 'src/api';
import {
  Button,
  Card,
  Input,
  SectionHeader,
  Select,
  Textarea
} from 'src/components';
import AnimalSelect from 'src/components/layout/Forms/Select/AnimalSelect';
import { Routes } from 'src/constants/routes';

import style from './NewLitterPage.module.scss';

const NewLitterPage = () => {
  const t = useTranslations('pages.newLitter');
  const searchParams = useSearchParams();
  const orgId = searchParams.get('orgId');
  const router = useRouter();

  const [litterForm, setLitterForm] = useState({
    title: '',
    birth_date: '',
    description: '',
    species: '',
    breed: '',
    status: '',
    organization: orgId
  });

  const statusOptions = [
    { value: 'ACTIVE', label: t('status.options.ACTIVE') },
    { value: 'CLOSED', label: t('status.options.CLOSED') },
    { value: 'DRAFT', label: t('status.options.DRAFT') },
  ];

  const handleChange = (field: string, value: string) => {
    setLitterForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await OrganizationsApi.postOrganizationLitters(litterForm);
      toast.success(t('toast.success'));

      if (orgId) {
        router.push(Routes.ORGANIZATION_LITTERS(orgId));
      }
      router.back()
    } catch (err) {
      console.error(err);
      toast.error(t('toast.error'));
    }
  };

  return (
    <>
      <SectionHeader
        title={t('header.title')}
        subtitle={t('header.subtitle')}
        margin
      />

      <div className={style.container}>
        {/* BASIC DATA */}
        <Card className={style.section}>
          <h3>{t('basicInfo.heading')}</h3>
          <AnimalSelect handleChange={handleChange} isAdding />
          <span className={style.caption}>{t('basicInfo.caption')}</span>
        </Card>

        {/* DESCRIPTION */}
        <Card className={style.section}>
          <h3>{t('title.heading')}</h3>
          <Input
            id="title"
            name="title"
            className={style.titleInput}
            label={t('title.label')}
            placeholder={t('title.placeholder')}
            value={litterForm.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('title', e.target.value)}
            required
          />

          <h3>{t('description.heading')}</h3>
          <Textarea
            className={style.textarea}
            label={t('description.label')}
            placeholder={t('description.placeholder')}
            value={litterForm.description}
            onChangeText={(value: any) => handleChange('description', value)}
          />
        </Card>

        {/* DATE */}
        <Card className={style.section}>
          <h3>{t('date.heading')}</h3>

          <Input
            type='date'
            label={t('date.label')}
            placeholder={t('description.placeholder')}
            value={litterForm.birth_date}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('birth_date', e.target.value)}
          />
        </Card>

        {/* STATUS */}
        <Card className={style.section}>
          <h3>{t('status.heading')}</h3>

          <Select
            label={t('status.label')}
            options={statusOptions}
            value={statusOptions.find(opt => opt.value === litterForm.status) || null}
            onChange={(option: any) => handleChange('status', option?.value || '')}
          />

          <span className={style.caption}>{t('status.caption')}</span>
        </Card>

        <Button
          className={style.submit}
          label={t('submit')}
          onClick={handleSubmit}
        />
      </div>
    </>
  );
};

export default NewLitterPage;
