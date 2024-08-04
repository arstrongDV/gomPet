'use client';

import React, { useActionState } from 'react';
import { useTranslations } from 'next-intl';

import { Button, Input, Loader } from 'src/components';

import { passwordReset } from './actions';

import style from './PasswordForgetReset.module.scss';

const PasswordForgetResetForm = () => {
  const t = useTranslations();

  const [state, action, isPending] = useActionState(passwordReset, {
    message: '',
    errors: undefined,
    fields: {
      password: '',
      passwordRepeat: ''
    }
  });

  return (
    <form
      className={style.form}
      action={action}
    >
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
