'use client';

import { useActionState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('pages.auth.passwordForgetReset');
  const [state, action, isPending] = useActionState(passwordReset, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.message === 'error' && state.errors) {
      Object.values(state.errors).forEach(err => toast.error(err));
    }

    if (state.message === 'success') {
      toast.success(t('toast.success'));
      router.push(Routes.LOGIN);
    }
  }, [state.message, state.errors, router]);

  if (!uid || !token) {
    return <p>{t('invalidLink')}</p>;
  }

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
        label={t('newPasswordLabel')}
        placeholder={t('newPasswordPlaceholder')}
        defaultValue={state.fields.password}
      />
      <Input
        type='password'
        key={'passwordRepeat'}
        name='passwordRepeat'
        label={t('repeatPasswordLabel')}
        placeholder={t('repeatPasswordPlaceholder')}
        defaultValue={state.fields.passwordRepeat}
      />
      <Button
        type='submit'
        label={t('submitButton')}
      />
      {isPending && <Loader />}
    </form>
  );
};

export default PasswordForgetResetForm;
