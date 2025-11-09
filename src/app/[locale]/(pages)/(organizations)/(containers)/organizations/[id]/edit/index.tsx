'use client'
import { useEffect, useRef, useState } from "react";
import { IOrganization, OrganizationType } from "src/constants/types";
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
} from "src/components";
import LocationInput from "src/components/layout/LocationInput";

import toast from "react-hot-toast";
import style from './UpdateOrganizationProfile.module.scss'
import { OrganizationsApi } from "src/api";

interface OrganizationUpdateFormProps {
  organization: IOrganization;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const speciesOptions = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
  { value: 'other', label: 'Other' },
];

const animalRace: Record<string, { value: string; label: string }[]> = {
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
  ]
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

const OrganizationUpdateForm = ({ organization, onSuccess, onCancel }: OrganizationUpdateFormProps) => {
    const editorRef = useRef(null);
    const [fileToCrop, setFileToCrop] = useState<File | null>(null);
    const [logo, setLogo] = useState<File | null>(null);
    const [logoUrl, setLogoUrl] = useState<string>('');
    const [formData, setFormData] = useState({
        type: "",
        logo: '',
        name: '',
        email: '',
        phoneNumber: '',
        description: '',
        race: '',
        breed: '',
        location: {
            lat: '',
            lng: '',
            city: '',
            street: '',
            house_number: '',
            zip_code: ''
        }
    });

    useEffect(() => {
      const initializeFormData = async () => {
          try {
              if (organization) {
                  // Set form data first
                  setFormData({
                      type: organization.type ?? '',
                      logo: organization.image ?? '', 
                      name: organization.name ?? '',
                      email: organization.email ?? '',
                      phoneNumber: organization.phone ?? '',
                      description: organization.description ?? '',
                      race: organization.race ?? '', 
                      breed: organization.breed ?? '', 
                      location: {
                          lat: organization.address?.lat ?? '', 
                          lng: organization.address?.lng ?? '',
                          city: organization.address?.city ?? '',
                          street: organization.address?.street ?? '',
                          house_number: organization.address?.house_number ?? '',
                          zip_code: organization.address?.zip_code ?? ''
                      }
                  });

                  setLogoUrl(organization.image ?? '');
  
                  if (organization.image) {
                      try {
                          const logoFile = await urlToFile(
                              organization.image, 
                              'organization-logo.jpg'
                          );
                          setLogo(logoFile);
                      } catch (fileError) {
                          console.error("Error converting image URL to file:", fileError);
                          setLogo(null);
                      }
                  } else {
                      setLogo(null);
                  }
              }
          } catch (err) {
              console.error("Error setting form data:", err);
              toast.error("Can't reload the data");
          }
      };
  
      initializeFormData();
  }, [organization]);

    useEffect(() => {
        console.log("Updated formData:", formData);
        console.log("Current logo file:", logo);
        console.log("Logo URL:", logoUrl);
    }, [formData, logo, logoUrl]);

    const handleInputChange = (field: string, value: string | number) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

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
        const submitData = new FormData();
  
        // Append simple fields
        submitData.append('type', formData.type);
        submitData.append('name', formData.name);
        submitData.append('email', formData.email);
        submitData.append('phone', formData.phoneNumber);
        submitData.append('description', formData.description);
        submitData.append('race', formData.race);
        submitData.append('breed', formData.breed);
  
        // Append location fields
        submitData.append('address[city]', formData.location.city);
        submitData.append('address[street]', formData.location.street);
        submitData.append('address[house_number]', formData.location.house_number);
        submitData.append('address[zip_code]', formData.location.zip_code);
        submitData.append('address[lat]', formData.location.lat);
        submitData.append('address[lng]', formData.location.lng);
  

        if (logo) {
          const logoBase64 = await fileToBase64(logo);
          submitData.append('image', logoBase64); 
        } else {
          submitData.append('image', ''); 
        }
  
        const res = await OrganizationsApi.updateOrganizationProfile(organization.id, submitData);
        console.log('Update response:', res);
        
        onSuccess?.(); 
      } catch (err) {
        console.error('Update error:', err);
        toast.error("Nie udalo sie aktualizowac organizacje");
        onCancel?.()
      }
    };
 
    return (
        <>
          <SectionHeader
            title={'Edytuj profil'}
            subtitle={'Witamy w kreatorze profilu. Dostosuj go do własnych potrzeb'}
            margin
          />

          <div className={style.container}>
            {/* TYPE */}
            <Card className={style.section}>
              <h3>
                Wybierz <mark>rodzaj</mark> profilu
              </h3>

              <div className={style.flexRow}>
                <Checkbox
                  id='type-animal-shelter'
                  label={'Schronisko'}
                  checked={formData.type === "SHELTER"}
                  onClick={() => handleCheckboxChange("SHELTER")}
                />
                <Checkbox
                  id='type-breeding'
                  label={'Hodowla'}
                  checked={formData.type === "BREEDER"}
                  onClick={() => handleCheckboxChange("BREEDER")}
                />
                <Checkbox
                  id='type-association'
                  label={'Fundacja'}
                  checked={formData.type === "FUND"}
                  onClick={() => handleCheckboxChange("FUND")}
                />
              </div>

              <span className={style.caption}>
                Każdy rodzaj profilu jest dostosowany do potrzeb organizacji, zatem wybierz go zgodnie ze swoją
                działalnością.
              </span>
            </Card>
     
            <Card className={style.section}>
              <h3>
                Jak chcesz się <mark>prezentować</mark>?
              </h3>

              <div className={style.basicData}>
                <ImageInput
                  label={'Logotyp organizacji'}
                  file={logo}
                  setFile={handleLogoFileSelect}
                  onClear={handleLogoClear}
                />
                <Input
                  id='organization-name'
                  name='organization-name'
                  label={'Nazwa organizacji'}
                  placeholder={'Wpisz nazwę organizacji'}
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                  required
                />
              </div>

              <span className={style.caption}>
                Nazwa organizacji będzie widoczna na stronie profilu. Dodaj logo, aby wyróżnić się na tle innych
                organizacji.
              </span>
            </Card>
            {/* NAME AND LOGO */}

            {/* CONTACT */}
            <Card className={style.section}>
              <h3>
                Jak się z Tobą <mark>skontaktować</mark>
              </h3>

              <div className={style.flexRow}>
                <Input
                  id='email'
                  name='email'
                  label={'Email'}
                  placeholder={'Wpisz adres email'}
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  required
                />

                <PhoneInput
                  id='phone'
                  name='phone'
                  label={'Numer telefonu'}
                  placeholder={'Wpisz numer telefonu'}
                  value={formData.phoneNumber}
                  onChange={(phone) => handleInputChange('phoneNumber', phone)}
                />
              </div>
            </Card>
            {/* CONTACT */}

            {/* BREEDING DETAILS */}
            {formData.type === "BREEDER" && (
              <Card className={style.section}>
                <h3>
                  Szczegóły <mark>hodowli</mark>
                </h3>

                <div className={style.flexRow}>
                  <Select
                    label={'Gatunek'}
                    options={speciesOptions}
                    onChange={(opt: any) => handleSelectChange('race', opt)}
                    value={speciesOptions.find(opt => opt.value === formData.race) || null}
                  />

                  <Select
                    label={'Rasa'}
                    options={animalRace[formData.race] || []}
                    onChange={(opt: any) => handleSelectChange('breed', opt)}
                    value={(animalRace[formData.race] || []).find(opt => opt.value === formData.breed) || null}
                  />
                </div>
              </Card>
            )}
            {/* BREEDING DETAILS */}

            {/* DESCRIPTION */}
            <Card className={style.section}>
              <h3>
                <mark>Opisz</mark> swoją działalność
              </h3>
              <RichTextEditor 
                ref={editorRef} 
                placeholder={'Napisz coś...'} 
                initialContent={formData.description} 
                onChange={handleDescriptionChange} // Fixed: now updates description
              />
              <span className={style.caption}>To będzie opisem Twojego profilu.</span>
            </Card>
            {/* DESCRIPTION */}

            {/* LOCATION */}
            <Card className={style.section}>
              <h3>
                Wskaż <mark>lokalizację</mark>, w której działasz
              </h3>

              <span className={style.caption}>
                Możesz wyszukać lokalizację z pomocą Google Maps lub wypełnij pola ręcznie.
              </span>

              <LocationInput
                value={formData.location}
                onChange={handleLocationChange} // Fixed: uses proper handler
              />
            </Card>
            {/* LOCATION */}

            <Button
              className={style.submit}
              label={'Zapisz zmiany'}
              onClick={handleSubmit}
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
}

export default OrganizationUpdateForm;