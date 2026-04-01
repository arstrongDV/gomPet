'use client';

import React, { useActionState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { Button, Input, Loader } from 'src/components';

import { passwordForget } from './actions';

import style from './PasswordForget.module.scss';
import toast from 'react-hot-toast';

const PasswordForgetForm = () => {
  const t = useTranslations();

  const [state, action, isPending] = useActionState(passwordForget, {
    message: 'idle',
    errors: undefined,
    fields: { email: '' },
  });

  useEffect(() => {
    if(state.message === 'success'){
      toast.success("Jeśli email istnieje, wysłaliśmy link do resetu hasła")
    }
  }, [state.message])

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
      />
      <Button
        type='submit'
        label='Wyślij link do resetu hasła'
      />
      {isPending && <Loader />}
    </form>
  );
};

export default PasswordForgetForm;