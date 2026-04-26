'use client';

import { useActionState, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button, Input } from 'src/components';
import { Routes } from 'src/constants/routes';

import { login } from './actions';

import style from './Login.module.scss';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const t = useTranslations('pages.auth.login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [state, action, isPending] = useActionState(login, {
    message: '',
    errors: undefined,
    fields: {
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    if (!state.message) return;

    if (state.message === 'success') {
      window.location.replace(Routes.LANDING);
      return;
    }

    if (state.message === 'error') {
      if (state.errors?.email) toast.error(t('toast.emailRequired'));
      else if (state.errors?.password) toast.error(t('toast.passwordRequired'));
      return;
    }

    toast.error(t('toast.loginFailed'));
  }, [state]);

  const isDisabled = email.trim() === '' || password.trim() === '';

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
        disabled={isPending}
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
        disabled={isPending}
      />
      <Button
        type='submit'
        label={t('submitButton')}
        disabled={isDisabled}
        isLoading={isPending}
      />
    </form>
  );
};

export default LoginForm;
