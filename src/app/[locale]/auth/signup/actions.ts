'use server';

import { AuthApi } from 'src/api';

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

export const signup = async (
  state: SignupFormState,
  formData: FormData
): Promise<SignupFormState> => {
  console.log('submit');

  const fields: Fields = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    passwordRepeat: formData.get('passwordRepeat') as string,
    statute: formData.get('statute') === 'on',
  };

  try {
    const res = await AuthApi.register({
      email: fields.email,
      first_name: fields.firstName,
      last_name: fields.lastName,
      password: fields.password,
    });

    return {
      message: 'success',
      errors: undefined,
      fields,
    };
  } 
  catch (error: any) {

    return {
      message: 'Błąd rejestracji!',
      errors: {
        email:
          error?.response?.data?.email?.[0] ||
          error?.response?.data?.username?.[0] ||
          error?.response?.data?.non_field_errors?.[0] ||
          'Wystąpił błąd po stronie serwera.',
        firstName: '',
        lastName: '',
        password: '',
        passwordRepeat: '',
        statute: '',
      },
      fields,
    };
  }
}