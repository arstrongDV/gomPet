'use client'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { AccountsApi } from 'src/api';
import { Avatar, AvatarCropper, Button, Card, Checkbox, Icon, ImageInput, Input, List, Loader, SectionHeader } from 'src/components';
import { IAnimal, IOrganization, IUser, Location } from 'src/constants/types';
import style from './profile.module.scss'
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import OrganizationCard from '../(organizations)/components/OrganizationCard';
import { useTranslations } from 'next-intl';
import AnimalScroll from './components/AnimallScroll/AnimalScroll';
import OrganizationsScroll from './components/OrganizationsScroll/OrganizationScroll';

type ProfileFormProps = {
    userData: IUser;
    userOrganizations: IOrganization[];
    userAnimals: IAnimal[];
    onSuccess: () => void;
    onDelete: () => void;
    onCancel: (err: any) => void;
    isLoading?: boolean;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

const ProfileForm = ({userData, userOrganizations, userAnimals, isLoading, onSuccess, onDelete, onCancel}: ProfileFormProps) => {
    const t = useTranslations();
    const [fileToCrop, setFileToCrop] = useState<File | null>(null);
    const [logo, setLogo] = useState<File | null>(null);
    const [showDeleteCard, setShowDeleteCard] = useState<boolean>(false);
    const [changeImage, setChangeImage] = useState<boolean>(false);

    const session = useSession();
    const userId = session.data?.user.id;
    const [disable, setDisable] = useState({
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
    });

    const [locationAllowed, setLocationAllowed] = useState(false);
  
    const getLocation = (): Promise<GeolocationPosition> => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'));
          return;
        }
    
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(error),
          {
            enableHighAccuracy: true,
            timeout: 10000,
          }
        );
      });
    };

    const toggleDisable = (field: string) => {
        setDisable((prev: any) => ({ ...prev, [field]: !prev[field] }));
    };

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('DD.MM.YYYY, godz. HH:mm');
    };

      const [userForm, setUserForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        image: null as string | File | null,
        location: null as {
          type: 'Point';
          coordinates: [number, number];
        } | Location | null
      });
      
    const [initialUserForm, setInitialUserForm] = useState<typeof userForm>(userForm);
    

    useEffect(() => {
        const initializeFormData = async () => {
            try {
                if (userData) {
                    const data = {
                        first_name: userData.first_name ?? '',
                        last_name: userData.last_name ?? '',
                        email: userData.email ?? '',
                        phone: userData.phone ?? '',
                        image: userData.image ?? null ,
                        location: userData.location ?? null
                    };
                    setUserForm(data);
                    setInitialUserForm(data);
                    setLocationAllowed(!!userData.location);
                }
            } catch (err) {
                toast.error("Can't reload the data");
            }
        };
  
        initializeFormData();
    }, []);
    const handleChange = (field: string, value: string) => {
        setUserForm(prev => ({ ...prev, [field]: value }));
    };

    const isFormChanged = () => {
        return (
            JSON.stringify(userForm) !== JSON.stringify(initialUserForm)
        );
    };

    const getChangedFields = async (
        current: typeof userForm,
        initial: typeof initialUserForm
      ) => {
        const payload: Record<string, any> = {};
      
        if (current.first_name !== initial.first_name) {
          payload.first_name = current.first_name;
        }
      
        if (current.last_name !== initial.last_name) {
          payload.last_name = current.last_name;
        }
      
        if (current.email !== initial.email) {
          payload.email = current.email;
        }
      
        if (current.phone !== initial.phone) {
          payload.phone = current.phone;
        }
      
        if (current.location !== initial.location) {
          payload.location = current.location;
        }
      
        if (current.image !== initial.image) {
          payload.image =
            current.image instanceof File
              ? await fileToBase64(current.image)
              : current.image;
        }
      
        return payload;
      };
      
    const handleSubmit = async () => {
        const payload = await getChangedFields(userForm, initialUserForm);

        if (Object.keys(payload).length === 0) {
          return;
        }
      
        if (isFormChanged()) {
          try {
            await AccountsApi.updateUserData(Number(userId), payload);
            setInitialUserForm(userForm);
            setChangeImage(false);
            setDisable({
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
            });
            toast.success('Profile updated successfully!');
            // onSuccess();
          } catch (err: any) {
            onCancel(err?.response?.data);
          }
        }
      };

    const isOrganizationOwner = userOrganizations.some(
        (membership) => membership.user === userData.id
    );

    const handleDelete = async() => {
        if (isOrganizationOwner) {
            toast.error(
              'Usuń lub przekaż swoje organizacje innemu użytkownikowi przed usunięciem konta'
            );
            return;
        }
        try{
            const res = await AccountsApi.deleteUserData();
            onDelete();
            console.log(res)

        }catch(error){
            const err = error as AxiosError<any>;
            console.log(err)
            toast.error(err?.response?.data.detail);
            onCancel(err);
        }
    }

  return (
    <>
        <Card className={style.container}>
            <div className={style.InfoWrraper}>
                <div className={style.avatarSection}>
                    {!changeImage ? (
                        <>
                            <Avatar 
                                className={style.avatar}
                                src={
                                    logo
                                      ? URL.createObjectURL(logo)
                                      : typeof userForm.image === "string"
                                      ? userForm.image
                                      : userForm.image instanceof File
                                      ? URL.createObjectURL(userForm.image)
                                      : undefined
                                  }
                                profile={userData}
                            />
                            <p 
                                className={style.imageChanger} 
                                onClick={() => setChangeImage(true)}
                            >
                                Zmienic zdjecie <Icon name='pencil' />
                            </p>
                        </>
                    ) : (
                        <ImageInput
                            className={style.newAvatar}
                            file={logo}
                            setFile={(file) => setFileToCrop(file)}
                            onClear={() => setLogo(null)}
                        />
                    )}

                    <div className={style.userData}>
                        <p>Stworzyl konto:   <span>{formatDate(userData.created_at)}</span></p>
                        <p>Aktualizowano konto:  <span>{formatDate(userData.updated_at ?? userData.created_at)}</span></p>
                    </div>
                </div>

                <div className={style.infoSection}>
                    <div className={style.flexRow}>
                        <label className={style.inputWrraper}>
                            <Icon 
                                className={style.inputIcon} 
                                name='pencil' 
                                onClick={() => toggleDisable("first_name")}
                            />
                            <Input
                                id="name"
                                name="name"
                                className={style.inputs}
                                label="Imie"
                                placeholder="Wpisz imie"
                                value={userForm?.first_name}
                                onChange={(e: any) => handleChange('first_name', e.target.value)}
                                disabled={disable.first_name}
                                required={!disable.first_name}
                            />
                        </label>
                        <label className={style.inputWrraper}>
                            <Icon 
                                className={style.inputIcon} 
                                name='pencil' 
                                onClick={() => toggleDisable("last_name")}
                            />
                            <Input
                                id="surname"
                                name="surname"
                                className={style.inputs}
                                label="Nazwisko"
                                placeholder="Wpisz nazwisko"
                                value={userForm?.last_name}
                                onChange={(e: any) => handleChange('last_name', e.target.value)}
                                disabled={disable.last_name}
                                required={!disable.last_name}
                            />
                        </label>
                    </div>

                    <div className={style.flexRow}>
                        <label className={style.inputWrraper}>
                            <Icon 
                                className={style.inputIcon} 
                                name='pencil' 
                                onClick={() => toggleDisable("email")}
                            />
                            <Input
                                id="email"
                                name="email"
                                className={style.inputs}
                                label="Email"
                                placeholder="Wpisz email"
                                value={userForm?.email}
                                onChange={(e: any) => handleChange('email', e.target.value)}
                                disabled={disable.email}
                                required={!disable.email}
                            />
                        </label>

                        <label className={style.inputWrraper}>
                            <Icon 
                                className={style.inputIcon} 
                                name='pencil' 
                                onClick={() => toggleDisable("phone")}
                            />
                            <Input
                                id='phone'
                                name='phone'
                                label={'Numer telefonu'}
                                placeholder={'Wpisz numer telefonu'}
                                className={style.inputs}
                                value={String(userForm?.phone)}
                                onChange={(e: any) => handleChange('phone', e.target.value)}
                                disabled={disable.phone}
                                required={!disable.phone}
                            />
                        </label>
                    </div>
                    <div>
                        <Checkbox
                            id="location"
                            label="Czy możemy korzystać z twojej lokalizacji"
                            checked={locationAllowed}
                            onChange={async (e: any) => {
                                const checked = e.target.checked;
                                setLocationAllowed(checked);

                                if (!checked) {
                                setUserForm(prev => ({ ...prev, location: null }));
                                return;
                                }

                                try {
                                const pos = await getLocation();
                                setUserForm(prev => ({
                                    ...prev,
                                    location: {
                                        type: 'Point',
                                        coordinates: [
                                            pos.coords.longitude,
                                            pos.coords.latitude
                                        ]
                                    }
                                }));
                                } catch {
                                toast.error('Nie udało się pobrać lokalizacji');
                                setLocationAllowed(false);
                                }
                            }}
                            />
                    </div>
                </div>
            </div>

            <div className={style.btns}>
                <Button
                    className={style.submit}
                    label={'Zapisz zmiany'}
                    onClick={handleSubmit}
                    disabled={!isFormChanged()} 
                />
                <Button
                    className={style.btnDel}
                    label={'Usunac profile'}
                    onClick={() => {
                        if (isOrganizationOwner) {
                          toast.error(
                            'Nie możesz usunąć konta, ponieważ jesteś właścicielem organizacji'
                          );
                          return;
                        }
                        setShowDeleteCard(true);
                      }}
                />
            </div>
        </Card>

        <div className={style.usersStaff}>
            <OrganizationsScroll organizations={userOrganizations} isLoading={isLoading} />

            <AnimalScroll animals={userAnimals} isLoading={isLoading} />
        </div>

        <AvatarCropper
            src={fileToCrop}
            isOpen={!!fileToCrop}
            closeModal={() => setFileToCrop(null)}
            onCropSuccess={(cropped: File) => {
                setLogo(cropped); 
                setUserForm((prev: any) => ({ ...prev, image: cropped }));
            }}
        />

        {showDeleteCard && (
            <div className={style.backdrop}>
            <Card className={style.DeleteCard}>
                <p>Chces napewno usunąc swoje konto ?</p>

                <div className={style.btns}>
                    <Button
                        className={style.btnDel}
                        label={'Tak'}
                        onClick={handleDelete}
                    />
                    <Button
                        className={style.btnNo}
                        label={'Nie'}
                        onClick={() => setShowDeleteCard(false)}
                    />
                </div>
            </Card>
        </div>
        )}
    </>
  )
}

export default ProfileForm
