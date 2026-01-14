'use server';

import { AuthApi } from 'src/api';

type LocationPoint = {
  type: 'Point';
  coordinates: [number, number];
};

type Fields = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordRepeat: string;
  statute: boolean;
  location?: LocationPoint | null;
};

export type SignupFormState = {
  message: string;
  text?: string | undefined;
  errors: Record<keyof Fields, string> | undefined;
  fields: Fields;
};


export const signup = async (
  state: SignupFormState,
  formData: FormData
): Promise<SignupFormState> => {
  console.log('submit');

  const locationRaw = formData.get('location');

  const location = locationRaw
    ? JSON.parse(locationRaw.toString())
    : null;

  const fields: Fields = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    passwordRepeat: formData.get('passwordRepeat') as string,
    statute: formData.get('statute') === 'on',
    location,
  };
  try {
    const res = await AuthApi.register({
      email: fields.email,
      first_name: fields.firstName,
      last_name: fields.lastName,
      password: fields.password,
      confirm_password: fields.passwordRepeat,
      location: fields.location,
    });

    return {
      message: 'success',
      text: 'Profile zostal stworzony',
      errors: undefined,
      fields,
    };
  } 
  catch (error: any) {
    console.error('REGISTER ERROR:', {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });
    return {
      message: 'error',
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
        location: '',
        statute: '',
      },
      fields,
    };
  }
}