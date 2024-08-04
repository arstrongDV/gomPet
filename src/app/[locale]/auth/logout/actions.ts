'use server';

import { signOut } from 'src/auth';

export const logout = async () => {
  await signOut();
};
