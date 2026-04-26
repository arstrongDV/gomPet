'use client';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

import { OrganizationsApi } from 'src/api';
import { 
    AvatarCropper, 
    Button, 
    Card, 
    Checkbox, 
    ImageInput, 
    Input, 
    PhoneInput, 
    RichTextEditor, 
    SectionHeader, 
    Select 
} from 'src/components';
import LocationInput from 'src/components/layout/LocationInput';
import { IOrganization } from 'src/constants/types';

import style from './UpdateOrganizationProfile.module.scss';
import SpeciesSelect from 'src/app/[locale]/(pages)/new-organization/components/SpeciesSelect';
import { OptionType } from 'src/components/layout/Forms/Select';

interface OrganizationUpdateFormProps {
  organization: IOrganization;
  onSuccess?: () => void;
  onCancel?: () => void;
}


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
};


interface OrganizationFormData {
    type: string,
    logo: string,
    name: string,
    email: string,
    phoneNumber: string,
    description: string,
    race: (string | number)[],
    location: {
        lat: string,
        lng: string,
        city: string,
        street: string,
        house_number: string,
        zip_code: string,
        coordinates: [string | number, string | number]
    }
}

const OrganizationUpdateForm = ({ organization, onSuccess, onCancel }: OrganizationUpdateFormProps) => {
    const t = useTranslations('pages.newOrganization');
    const editorRef = useRef(null);
    const initialFormDataRef = useRef<OrganizationFormData | null>(null);
    const initialLogoNameRef = useRef<string | null>(null);
    const [initialDescription, setInitialDescription] = useState<string | null>(null);
    const [fileToCrop, setFileToCrop] = useState<File | null>(null);
    const [logo, setLogo] = useState<File | null>(null);
    const [logoUrl, setLogoUrl] = useState<string>('');

    const [formData, setFormData] = useState<OrganizationFormData>({
        type: '',
        logo: '',
        name: '',
        email: '',
        phoneNumber: '',
        description: '',
        race: [],
        location: {
            lat: '',
            lng: '',
            city: '',
            street: '',
            house_number: '',
            zip_code: '',
            coordinates: ['', '']
        }
    });

    useEffect(() => {
      const initializeFormData = async () => {
          try {
              if (organization) {
                  // Set form data first
                  const speciesIds = (organization.address?.species ?? []).map(
                    (s: any) => (typeof s === 'object' ? s.id : s)
                  );
                  const lat = String(organization.address?.lat ?? '');
                  const lng = String(organization.address?.lng ?? '');
                  const initial: OrganizationFormData = {
                      type: organization.type ?? '',
                      logo: organization.image ?? '',
                      name: organization.name ?? '',
                      email: organization.email ?? '',
                      phoneNumber: organization.phone ?? '',
                      description: organization.description ?? '',
                      race: speciesIds,
                      location: {
                          lat,
                          lng,
                          city: organization.address?.city ?? '',
                          street: organization.address?.street ?? '',
                          house_number: organization.address?.house_number ?? '',
                          zip_code: organization.address?.zip_code ?? '',
                          coordinates: [lng, lat]
                      }
                  };
                  setFormData(initial);
                  initialFormDataRef.current = initial;
                  initialLogoNameRef.current = organization.image ?? null;
                  setInitialDescription(organization.description ?? '');

                  setLogoUrl(organization.image ?? '');
  
                  if (organization.image) {
                      try {
                          const logoFile = await urlToFile(
                              organization.image, 
                              'organization-logo.jpg'
                          );
                          setLogo(logoFile);
                      } catch (fileError) {
                          console.error('Error converting image URL to file:', fileError);
                          setLogo(null);
                      }
                  } else {
                      setLogo(null);
                  }
              }
          } catch (err) {
              console.error('Error setting form data:', err);
              toast.error(t('toast.loadError'));
          }
      };
  
      initializeFormData();
  }, [organization]);

    useEffect(() => {
        console.log('Updated formData:', formData);
        console.log('Current logo file:', logo);
        console.log('Logo URL:', logoUrl);
    }, [formData, logo, logoUrl]);

    const hasChanged = (): boolean => {
      const init = initialFormDataRef.current;
      if (!init) return false;
      const logoChanged = logo?.name !== initialLogoNameRef.current && logoUrl !== (init.logo);
      const dataChanged = JSON.stringify({ ...formData, logo: '' }) !== JSON.stringify({ ...init, logo: '' });
      return dataChanged || logoChanged;
    };

    const handleSpeciesChange = (selectedOptions: OptionType[]) => {
        const speciesIds = selectedOptions ? selectedOptions.map(opt => opt?.value) : [];
        setFormData((prev: any) => ({ ...prev, 'race': speciesIds }));
    };

    const handleInputChange = (field: string, value: string | number) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSelectChange = (field: string, option: any) => {
      setFormData(prev => ({ 
          ...prev, 
          [field]: option?.value || '' 
      }));
    };
    const handleCheckboxChange = (type: string) => {
      setFormData(prev => ({
        ...prev,
        type,
      }));
    };
    const handleDescriptionChange = (description: string) => {
      setFormData(prev => ({
        ...prev,
        description,
      }));
    };
    const handleLocationChange = (location: any) => {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          ...location,
        },
      }));
    };
    const handleLogoFileSelect = (file: File | null) => {
      setFileToCrop(file);
    };
    const handleCroppedLogo = (croppedFile: File) => {
      setLogo(croppedFile);
      setLogoUrl('');
    };

    const handleLogoClear = () => {
      setLogo(null);
      setLogoUrl('');
      setFormData(prev => ({ ...prev, logo: '' }));
    };

    const handleSubmit = async () => {
      try {
        const image = logo ? await fileToBase64(logo) : '';

        const payload = {
          type: formData.type,
          name: formData.name,
          email: formData.email,
          phone: formData.phoneNumber,
          description: formData.description || initialDescription || '',
          image,
          address: {
            city: formData.location.city,
            street: formData.location.street,
            house_number: formData.location.house_number,
            zip_code: formData.location.zip_code,
            lat: formData.location.lat,
            lng: formData.location.lng,
            species: formData.race.map(Number),
          },
        };

        const res = await OrganizationsApi.updateOrganizationProfile(organization.id, payload);
        console.log('Update response:', res);

        onSuccess?.();
      } catch (err) {
        console.error('Update error:', err);
        toast.error(t('toast.updateError'));
      }
    };
 
    return (
        <>
          <SectionHeader
            title={t('editHeader.title')}
            subtitle={t('editHeader.subtitle')}
            margin
          />

          <div className={style.container}>
            {/* TYPE */}
            <Card className={style.section}>
              <h3>{t('type.heading')}</h3>

              <div className={style.flexRow}>
                <Checkbox
                  id='type-animal-shelter'
                  label={t('type.shelter')}
                  checked={formData.type === 'SHELTER'}
                  onClick={() => handleCheckboxChange('SHELTER')}
                />
                <Checkbox
                  id='type-breeding'
                  label={t('type.breeder')}
                  checked={formData.type === 'BREEDER'}
                  onClick={() => handleCheckboxChange('BREEDER')}
                />
                <Checkbox
                  id='type-association'
                  label={t('type.fund')}
                  checked={formData.type === 'FUND'}
                  onClick={() => handleCheckboxChange('FUND')}
                />
              </div>

              <span className={style.caption}>{t('type.caption')}</span>
            </Card>
     
            <Card className={style.section}>
              <h3>{t('presentation.heading')}</h3>

              <div className={style.basicData}>
                <ImageInput
                  label={t('presentation.logoLabel')}
                  file={logo}
                  setFile={handleLogoFileSelect}
                  onClear={handleLogoClear}
                />
                <Input
                  id='organization-name'
                  name='organization-name'
                  label={t('presentation.nameLabel')}
                  placeholder={t('presentation.namePlaceholder')}
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                  required
                />
              </div>

              <span className={style.caption}>{t('presentation.caption')}</span>
            </Card>
            {/* NAME AND LOGO */}

            {/* CONTACT */}
            <Card className={style.section}>
              <h3>{t('contact.heading')}</h3>

              <div className={style.flexRow}>
                <Input
                  id='email'
                  name='email'
                  label={t('contact.emailLabel')}
                  placeholder={t('contact.emailPlaceholder')}
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  required
                />

                <PhoneInput
                  id='phone'
                  name='phone'
                  label={t('contact.phoneLabel')}
                  placeholder={t('contact.phonePlaceholder')}
                  value={formData.phoneNumber}
                  onChange={(phone) => handleInputChange('phoneNumber', phone)}
                />
              </div>
            </Card>
            {/* CONTACT */}

            {/* BREEDING DETAILS */}
            {formData.type === 'BREEDER' && (
              <Card className={style.section}>
                <h3>{t('breedingDetails.heading')}</h3>
                <SpeciesSelect handleChange={handleSpeciesChange} initialRace={formData.race.map(id => ({ id: Number(id) }))} />
              </Card>
            )}
            {/* BREEDING DETAILS */}

            {/* DESCRIPTION */}
            <Card className={style.section}>
              <h3>{t('description.heading')}</h3>
              {initialDescription !== null && (
                <RichTextEditor
                  ref={editorRef}
                  placeholder={t('description.placeholder')}
                  initialContent={initialDescription}
                  onChange={handleDescriptionChange}
                />
              )}
              <span className={style.caption}>{t('description.caption')}</span>
            </Card>
            {/* DESCRIPTION */}

            {/* LOCATION */}
            <Card className={style.section}>
              <h3>{t('location.heading')}</h3>

              <span className={style.caption}>{t('location.caption')}</span>

              <LocationInput
                value={formData.location}
                onChange={handleLocationChange} // Fixed: uses proper handler
              />
            </Card>
            {/* LOCATION */}

            <Button
              className={style.submit}
              label={t('saveChanges')}
              onClick={handleSubmit}
              disabled={!hasChanged()}
            />
          </div>

          <AvatarCropper
            src={fileToCrop}
            isOpen={!!fileToCrop}
            closeModal={() => setFileToCrop(null)}
            onCropSuccess={handleCroppedLogo} // Fixed: uses proper handler
          />
        </>
    );
};

export default OrganizationUpdateForm;