'use server';

import { AuthApi } from 'src/api';

type Fields = {
  password: string;
  passwordRepeat: string;
};

export type PasswordResetFormState = {
  message: 'idle' | 'success' | 'error';
  errors?: Partial<Record<keyof Fields, string>>;
  fields: Fields;
};

export const passwordReset = async (
  state: PasswordResetFormState,
  formData: FormData
): Promise<PasswordResetFormState> => {
  const uid = formData.get('uid')?.toString();
  const token = formData.get('token')?.toString();

  const password = formData.get('password')?.toString().trim() ?? '';
  const passwordRepeat = formData.get('passwordRepeat')?.toString().trim() ?? '';

  if (!uid || !token) {
    return {
      message: 'error',
      errors: {
        password: 'Nieprawidłowy link resetu hasła',
      },
      fields: { password, passwordRepeat },
    };
  }

  if (!password || !passwordRepeat) {
    return {
      message: 'error',
      errors: {
        password: 'Hasło jest wymagane',
        passwordRepeat: 'Powtórzenie hasła jest wymagane',
      },
      fields: { password, passwordRepeat },
    };
  }

  if (password !== passwordRepeat) {
    return {
      message: 'error',
      errors: {
        passwordRepeat: 'Hasła nie są takie same',
      },
      fields: { password, passwordRepeat },
    };
  }

  try {
    await AuthApi.resetPassword({
      uid: uid,
      token: token,
      new_password: password,
      confirm_password: passwordRepeat,
    });

    return {
      message: 'success',
      errors: undefined,
      fields: { password: '', passwordRepeat: '' },
    };
  } catch (error: any) {
    return {
      message: 'error',
      errors: {
        password:
          error?.response?.data?.new_password?.[0] ??
          'Nie udało się zaktualizować hasła',
        passwordRepeat:
          error?.response?.data?.confirm_password?.[0] ??
          'Nie udało się zaktualizować hasła',
      },
      fields: { password, passwordRepeat },
    };
  }
};
