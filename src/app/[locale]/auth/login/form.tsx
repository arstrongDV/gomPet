'use client';

import React, { useActionState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button, Input } from 'src/components';
import { Params } from 'src/constants/params';
import { Routes } from 'src/constants/routes';
import { useRouter } from 'src/navigation';

import { login } from './actions';

import style from './Login.module.scss';

const LoginForm = () => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, action, isPending] = useActionState(login, {
    message: '',
    errors: undefined,
    fields: {
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    const redirectedFrom = searchParams.get(Params.FROM);

    if (state.message === 'success') {
      if (redirectedFrom) {
        router.replace(redirectedFrom);
      } else {
        router.replace(Routes.LOGIN_REDIRECT);
      }
    }
  }, [state.message]);

  return (
    <form
      className={style.form}
      action={action}
    >
      {state.errors && (
        <div className={style.error}>
          {Object.values(state.errors).map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
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
