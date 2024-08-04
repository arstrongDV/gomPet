'use client';

import React, { useActionState } from 'react';
import { useTranslations } from 'next-intl';

import { Button, Input, Loader } from 'src/components';

import { passwordForget } from './actions';

import style from './PasswordForget.module.scss';

const PasswordForgetForm = () => {
  const t = useTranslations();

  const [state, action, isPending] = useActionState(passwordForget, {
    message: '',
    errors: undefined,
    fields: {
      email: ''
    }
  });

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
