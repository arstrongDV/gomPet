import { DefaultSession } from 'next-auth';

import { IUser } from 'src/constants/types';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    access_token: string;
    refresh_token: string;
    user: IUser;
  }

  interface User {
    access_token: any & DefaultSession['user'];
    refresh_token: any & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    access_token?: string;
    refresh_token?: string;
  }
}
