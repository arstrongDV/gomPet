'use server';

import { AuthApi } from 'src/api';

type Fields = {
  email: string;
};

export type PasswordForgetFormState = {
  message: 'idle' | 'success' | 'error';
  errors?: {
    email?: string;
  };
  fields: Fields;
};

export const passwordForget = async (
  state: PasswordForgetFormState,
  formData: FormData
): Promise<PasswordForgetFormState> => {
  const email = formData.get('email')?.toString().trim() ?? '';

  if (!email) {
    return {
      message: 'error',
      errors: {
        email: 'Email jest wymagany',
      },
      fields: { email },
    };
  }

  try {
    await AuthApi.requestPasswordReset({ email });

    return {
      message: 'success',
      errors: undefined,
      fields: { email: '' },
    };
  } catch (error: any) {
    return {
      message: 'error',
      errors: {
        email: error?.response?.data?.email?.[0] ?? 'Nie udało się wysłać maila',
      },
      fields: { email },
    };
  }
};
