'use server';

import toast from 'react-hot-toast';
import { signIn } from 'src/auth';

type Fields = {
  email: string;
  password: string;
};

type ErrorData = {
  error?: {
    message?: string;
    errors?: {
      email?: string;
      password?: string;
    };
  };
};

export type LoginFormState = {
  errorData?: ErrorData;
  message: string;
  errors: Record<keyof Fields, string> | undefined;
  fields: Fields;
};


export const login = async (
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const fields = { email, password };

  // Валідація
  if (!email || !password) {
    return {
      message: 'error',
      errors: {
        email: email ? '' : 'Email is required',
        password: password ? '' : 'Password is required'
      },
      fields
    };
  }

  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    if (result?.error) {
      try {
        const errorData = JSON.parse(result.error);
        toast.error(errorData.error?.message);
        return {
          errorData,
          message: errorData.error?.message || 'Invalid credentials',
          errors: {
            email: errorData.error?.errors?.email || '',
            password: errorData.error?.errors?.password || 'Invalid credentials'
          },
          fields
        };
      } catch (e) {
        return {
          message: result.error,
          errors: {
            email: '',
            password: result.error
          },
          fields
        };
      }
    }
    return {
      message: 'success',
      errors: undefined,
      fields: {
        email: '',
        password: ''
      }
    };
  } catch (error: any) {
    return {
      message: 'wrong',
      errors: {
        email: '',
        password: error.message || 'Unexpected error occurred'
      },
      fields
    };
  }
};