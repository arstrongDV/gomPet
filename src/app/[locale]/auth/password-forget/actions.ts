'use server';

type Fields = {
  email: string;
};

export type PasswordForgetFormState = {
  message: string;
  errors: Record<keyof Fields, string> | undefined;
  fields: Fields;
};

export const passwordForget = async (state: PasswordForgetFormState, formData: FormData) => {
  console.log('reset request');

  return {
    message: 'success',
    errors: undefined,
    fields: {
      email: formData.get('email') as string
    }
  };
};
