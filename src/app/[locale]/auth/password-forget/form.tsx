'use client';

import { useActionState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { Button, Input, Loader } from 'src/components';

import { passwordForget } from './actions';

import style from './PasswordForget.module.scss';
import toast from 'react-hot-toast';

const PasswordForgetForm = () => {
  const t = useTranslations('pages.auth.passwordForget');

  const [state, action, isPending] = useActionState(passwordForget, {
    message: 'idle',
    errors: undefined,
    fields: { email: '' },
  });

  useEffect(() => {
    if (state.message === 'success') {
      toast.success(t('toast.success'));
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
        label={t('emailLabel')}
        placeholder={t('emailPlaceholder')}
        defaultValue={state.fields.email}
      />
      <Button
        type='submit'
        label={t('submitButton')}
      />
      {isPending && <Loader />}
    </form>
  );
};

export default PasswordForgetForm;
