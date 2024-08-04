'use client';

import React, { useActionState } from 'react';
import { useTranslations } from 'next-intl';

import { Button, Checkbox, Input, Loader } from 'src/components';
import { Routes } from 'src/constants/routes';
import { Link } from 'src/navigation';

import { signup } from './actions';

import style from './SignUp.module.scss';

const SignUpForm = () => {
  const t = useTranslations();
  const [state, action, isPending] = useActionState(signup, {
    message: '',
    errors: undefined,
    fields: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      passwordRepeat: '',
      statute: false
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
      <Input
        key={'firstName'}
        name='firstName'
        label='Imię'
        placeholder='Wpisz swoje imię'
        defaultValue={state.fields.firstName}
      />
      <Input
        key={'lastName'}
        name='lastName'
        label='Nazwisko'
        placeholder='Wpisz swoje nazwisko'
        defaultValue={state.fields.lastName}
      />
      <Input
        type='password'
        key={'password'}
        name='password'
        label='Hasło'
        placeholder='Utwórz hasło'
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
      <Checkbox
        id='terms'
        name='terms'
        label={t.rich('form.termsAndConditions', {
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
        defaultChecked={state.fields.statute}
      />
      <Button
        type='submit'
        label='Utwórz konto'
      />
      {isPending && <Loader />}
    </form>
  );
};

export default SignUpForm;
