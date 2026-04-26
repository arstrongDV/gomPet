'use client';

import React, { useActionState, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button, Checkbox, Input, Loader } from 'src/components';
import { Routes } from 'src/constants/routes';
import { Link } from 'src/navigation';

import { signup } from './actions';

import style from './SignUp.module.scss';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';


const SignUpForm = () => {
  const t = useTranslations('pages.auth.signup');
  const tForm = useTranslations('form');
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [isStatuteChecked, setIsStatuteChecked] = useState(false);

  const [state, action, isPending] = useActionState(signup, {
    message: '',
    errors: undefined,
    text: '',
    fields: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      passwordRepeat: '',
      statute: false
    }
  });

  const [locationAlowed, setLocationAllowed] = useState<boolean>(false)
  const [location, setLocation] = useState<{
    type: 'Point';
    coordinates: [number, number];
  } | null>(null);


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

  const lastMessage = useRef<string | null>(null);

  useEffect(() => {
    if(state.message == 'error'){
      toast.error(state.errors?.email || t('toast.error'));
    }

    if (state.message === 'success') {
      toast.success(state.text || t('toast.success'));
      router.push('/auth/login');
    }
  }, [state.message, router]);

  useEffect(() => {
    if (state.message && state.message !== lastMessage.current) {
      lastMessage.current = state.message;

      if (state.message === 'error') return;
      if (state.message === 'success') {
        router.push('/auth/login');
      }
    }
  }, [state.message]);

  const isDisabled = email.trim() === '' || 
                    firstName.trim() === '' || 
                    lastName.trim() === '' || 
                    password.trim() === '' || 
                    passwordRepeat.trim() === '' || 
                    !isStatuteChecked;

  return (
    <form
      className={style.form}
      action={action}
    >
      <Input
        type='email'
        key={'email'}
        name='email'
        label={t('emailLabel')}
        placeholder={t('emailPlaceholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        defaultValue={state.fields.email}
      />
      <Input
        key={'firstName'}
        name='firstName'
        label={t('firstNameLabel')}
        placeholder={t('firstNamePlaceholder')}
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        defaultValue={state.fields.firstName}
      />
      <Input
        key={'lastName'}
        name='lastName'
        label={t('lastNameLabel')}
        placeholder={t('lastNamePlaceholder')}
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        defaultValue={state.fields.lastName}
      />
      <Input
        type='password'
        key={'password'}
        name='password'
        label={t('passwordLabel')}
        placeholder={t('passwordPlaceholder')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        defaultValue={state.fields.password}
      />
      <Input
        type='password'
        key={'passwordRepeat'}
        name='passwordRepeat'
        label={t('passwordRepeatLabel')}
        placeholder={t('passwordRepeatPlaceholder')}
        value={passwordRepeat}
        onChange={(e) => setPasswordRepeat(e.target.value)}
        defaultValue={state.fields.passwordRepeat}
      />

      <Checkbox
        id="location"
        label={t('locationCheckbox')}
        checked={locationAlowed}
        onChange={async (e) => {
          const checked = e.target.checked;
          setLocationAllowed(checked);

          if (!checked) {
            setLocation(null);
            return;
          }

          try {
            const pos = await getLocation();
            setLocation({
              type: 'Point',
              coordinates: [
                pos.coords.longitude,
                pos.coords.latitude,
              ],
            });
          } catch {
            toast.error(t('toast.locationError'));
            setLocationAllowed(false);
          }
        }}
      />
      {location && (
        <input
          type="hidden"
          name="location"
          value={JSON.stringify(location)}
        />
      )}
      <Checkbox
        id='statute'
        name='statute'
        label={tForm.rich('termsAndConditions', {
          statute: (chunks) => (
            <Link
              href={Routes.DOC_STATUTE}
              className={style.link}
            >
              {chunks}
            </Link>
          ),
          privacy: (chunks) => (
            <Link
              href={Routes.DOC_PRIVACY}
              className={style.link}
            >
              {chunks}
            </Link>
          )
        })}
        onChange={(e) => setIsStatuteChecked(e.target.checked)}
        defaultChecked={state.fields.statute}
      />
      <Button
        type='submit'
        disabled={isDisabled}
        label={t('submitButton')}
      />
      {isPending && <Loader />}
    </form>
  );
};

export default SignUpForm;