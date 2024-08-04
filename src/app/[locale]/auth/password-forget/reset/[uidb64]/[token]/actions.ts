'use server';

type Fields = {
  password: string;
  passwordRepeat: string;
};

export type PasswordResetFormState = {
  message: string;
  errors: Record<keyof Fields, string> | undefined;
  fields: Fields;
};

export const passwordReset = async (state: PasswordResetFormState, formData: FormData) => {
  console.log('reset password');

  return {
    message: 'success',
    errors: undefined,
    fields: {
      password: formData.get('password') as string,
      passwordRepeat: formData.get('passwordRepeat') as string
    }
  };
};
