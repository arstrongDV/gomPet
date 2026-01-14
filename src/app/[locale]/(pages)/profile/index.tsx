'use client'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { AccountsApi } from 'src/api';
import { Avatar, AvatarCropper, Button, Card, Checkbox, Icon, ImageInput, Input } from 'src/components';
import { IUser, Location } from 'src/constants/types';
import style from './profile.module.scss'
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import LocationInput from 'src/components/layout/LocationInput';
import dayjs from 'dayjs';

type ProfileFormProps = {
    userData: IUser;
    onSuccess: () => void;
    onDelete: () => void;
    onCancel: (err: any) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

const ProfileForm = ({userData, onSuccess, onDelete, onCancel}: ProfileFormProps) => {
    const [fileToCrop, setFileToCrop] = useState<File | null>(null);
    const [logo, setLogo] = useState<File | null>(null);
    const [showDeleteCard, setShowDeleteCard] = useState<boolean>(false);
    const [changeImage, setChangeImage] = useState<boolean>(false);
    // const [location, setLocation] = useState<Location>({
    //     lat: '',
    //     lng: '',
    //     city: '',
    //     street: '',
    //     house_number: '',
    //     zip_code: ''
    //   });

    const session = useSession();
    const userId = session.data?.user.id;
    const [disable, setDisable] = useState({
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
    });

    const [locationAllowed, setLocationAllowed] = useState(false);
    // const [location, setLocation] = useState<{
    //   type: 'Point';
    //   coordinates: [number, number];
    // } | null>(null);
  
  
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

    console.log(userData);
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
        } | null
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
                    setInitialUserForm(data); // store original values
                    setLocationAllowed(!!userData.location);
                    // if(userData.location.coordinates[0] !== 0 && userData.location.coordinates[1] !== 0){
                    //     setLocationAllowed(true);
                    // }
                    // else{
                    //     setLocationAllowed(false);
                    // }
                }
                // if(userForm.location.coordinates){
                //     setLocationAllowed(true);
                // }
                console.log(userForm.location)
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
            userForm.first_name !== initialUserForm?.first_name ||
            userForm.last_name !== initialUserForm?.last_name ||
            userForm.email !== initialUserForm?.email ||
            userForm.phone !== initialUserForm?.phone ||
            userForm.image !== initialUserForm?.image ||
            JSON.stringify(userForm.location) !== JSON.stringify(initialUserForm.location)
        );
    };


    const handleSubmit = async () => {
        const payload = {
          first_name: userForm.first_name,
          last_name: userForm.last_name,
          email: userForm.email,
          phone: userForm.phone,
          image:
            userForm.image instanceof File
              ? await fileToBase64(userForm.image)
              : userForm.image,
          location: userForm.location, // 👈 tu normalne null
        };
      
        if (isFormChanged()) {
          try {
            await AccountsApi.updateUserData(Number(userId), payload);
            setChangeImage(false);
            onSuccess();
          } catch (err: any) {
            onCancel(err?.response?.data);
          }
        }
      };

    const handleDelete = async() => {
        try{
            const res = await AccountsApi.deleteUserData(Number(userId));
            onDelete();
            console.log(res)

        }catch(error){
            const err = error as AxiosError<any>;
            console.log(err)
            toast.error(err?.response?.data.detail);
            onCancel();
        }
    }

  return (
    <>
        <Card className={style.container}>
            <div className={style.avatarSection}>
                {!changeImage ? (
                    <>
                        <Avatar 
                            className={style.avatar}
                            src={typeof userForm.image === 'string' ? userForm.image : undefined}
                            profile={userForm && userForm} 
                        />
                        <p className={style.imageChanger} onClick={() => setChangeImage(true)}>Zmienic zdjecie <Icon name='pencil'  /></p>
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
                    <p>Aktualizowano konto:  <span>{formatDate(userData.updated_at)}</span></p>
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
                {/* <div>
                    <LocationInput 
                        value={location}
                        onChange={setLocation}
                    />
                </div> */}
            </div>
        </Card>
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
                onClick={() => setShowDeleteCard(true)}
            />
        </div>

        <AvatarCropper
            src={fileToCrop}
            isOpen={!!fileToCrop}
            closeModal={() => setFileToCrop(null)}
            onCropSuccess={(cropped: File) => {
                setLogo(cropped); // do ImageInput lub Avatar
                setUserForm((prev: any) => ({ ...prev, image: cropped })); // najważniejsze!
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
                        className={style.btnDel}
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