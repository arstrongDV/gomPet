'use server';

import { signIn } from 'src/auth';

type Fields = {
  email: string;
  password: string;
};

export type LoginFormState = {
  message: string;
  errors: Record<keyof Fields, string> | undefined;
  fields: Fields;
};

export const login = async (state: LoginFormState, formData: FormData) => {
  try {
    await signIn('credentials', {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirect: false
    });
  } catch (e) {
    return {
      message: 'error',
      errors: {
        email: 'Email is required',
        password: 'Password is required'
      },
      fields: {
        email: formData.get('email') as string,
        password: formData.get('password') as string
      }
    };
  }

  return {
    message: 'success',
    errors: undefined,
    fields: {
      email: '',
      password: ''
    }
  };
};
