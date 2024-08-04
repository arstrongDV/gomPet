'use server';

type Fields = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordRepeat: string;
  statute: boolean;
};

export type SignupFormState = {
  message: string;
  errors: Record<keyof Fields, string> | undefined;
  fields: Fields;
};

export const signup = async (state: SignupFormState, formData: FormData) => {
  console.log('submit');

  return {
    message: 'success',
    errors: undefined,
    fields: {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      passwordRepeat: formData.get('passwordRepeat') as string,
      statute: formData.get('statute') === 'on'
    }
  };
};
