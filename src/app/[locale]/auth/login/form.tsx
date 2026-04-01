'use client';

import React, { useActionState, useEffect } from 'react';

import { Button, Input } from 'src/components';
import { Routes } from 'src/constants/routes';

import { login } from './actions';

import style from './Login.module.scss';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const [state, action, isPending] = useActionState(login, {
    message: '',
    errors: undefined,
    fields: {
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    if(state.message == 'error'){
      if(state.errors?.email) toast.error('Email is required');
      if(state.errors?.password) toast.error('Password is required');
    }
    
    if (state.message == 'wrong') {
      toast.error("Nie udalo się zalogowac");
    }

    if (state.message === 'success') {
      window.location.replace(Routes.LANDING);
    }
  }, [state.message]);

  return (
    <form
      className={style.form}
      action={action}
    >
      <Input
        type='email'
        key={'email'}
        name='email'
        label='Email'
        placeholder='Wpisz swój email'
        defaultValue={state.fields.email}
        disabled={isPending}
      />
      <Input
        type='password'
        key={'password'}
        name='password'
        label='Hasło'
        placeholder='Podaj hasło'
        defaultValue={state.fields.password}
        disabled={isPending}
      />
      <Button
        type='submit'
        label='Zaloguj się'
        isLoading={isPending}
      />
    </form>
  );
};

export default LoginForm;
