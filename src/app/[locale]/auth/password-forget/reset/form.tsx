'use client';

import React, { useActionState, useEffect } from 'react';
import { Button, Input, Loader } from 'src/components';
import { passwordReset, PasswordResetFormState } from './actions';

import style from './PasswordForgetReset.module.scss';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Routes } from 'src/constants/routes';

type PasswordForgetResetFormProps = {
  uid: string | null;
  token: string | null;
};

const initialState: PasswordResetFormState = {
  message: 'idle',
  errors: undefined,
  fields: {
    password: '',
    passwordRepeat: '',
  },
};

const PasswordForgetResetForm = ({ uid, token }: PasswordForgetResetFormProps) => {
  const [state, action, isPending] = useActionState(passwordReset, initialState);
  const router = useRouter();

  if (!uid || !token) {
    return <p>Nieprawidłowy lub wygasły link resetu hasła</p>;
  }

  useEffect(() => {
    if (state.message === 'error' && state.errors) {
      Object.values(state.errors).forEach(err => toast.error(err));
    }
  
    if (state.message === 'success') {
      toast.success('Hasło zaktualizowane!');
      router.push(Routes.LOGIN);
    }
  }, [state.message, state.errors, router]);

  return (
    <form
      className={style.form}
      action={action}
    >
      <input type="hidden" name="uid" value={uid} />
      <input type="hidden" name="token" value={token} />

      <Input
        type='password'
        key={'password'}
        name='password'
        label='Nowe hasło'
        placeholder='Utwórz nowe hasło'
        defaultValue={state.fields.password}
      />
      <Input
        type='password'
        key={'passwordRepeat'}
        name='passwordRepeat'
        label='Powtórz hasło'
        placeholder='Powtórz hasło'
        defaultValue={state.fields.passwordRepeat}
      />
      <Button
        type='submit'
        label='Ustaw nowe hasło'
      />
      {isPending && <Loader />}
    </form>
  );
};

export default PasswordForgetResetForm;
