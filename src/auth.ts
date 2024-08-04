import { isAxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import NextAuth from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import credentials from 'next-auth/providers/credentials';

import { AuthApi } from './api';

const isTokenValid = (token: string) => {
  try {
    const { exp } = jwtDecode(token) as { exp: number };
    return exp * 1000 >= Date.now();
  } catch (e) {
    return false;
  }
};

const refreshAccessToken = async (refreshToken: string) => {
  try {
    const { data } = await AuthApi.refreshAuthToken({ refresh: refreshToken });
    return data.access;
  } catch (e) {
    return null;
  }
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        try {
          const { data } = await AuthApi.login({
            email: credentials.email as string,
            password: credentials.password as string
          });
          const { access, refresh } = data;
          const { data: user } = await AuthApi.getLoginUser(access);

          return {
            ...user,
            access_token: access,
            refresh_token: refresh
          };
        } catch (e) {
          if (!isAxiosError(e)) return;
          throw new Error(
            JSON.stringify({
              error: e?.response?.data,
              status: e?.status
            })
          );
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, trigger, user, session }) {
      if (trigger === 'update') {
        return {
          ...token,
          access_token: token.access_token,
          refresh_token: token.refresh_token,
          user: session.user
        };
      }

      if (user) {
        return {
          ...token,
          access_token: user.access_token,
          refresh_token: user.refresh_token,
          user
        };
      }

      return token;
    },
    async session({ token, session }) {
      const user: AdapterUser = token.user as AdapterUser;

      delete user.access_token;
      delete user.refresh_token;

      let access_token: string = token.access_token as string;

      if (!isTokenValid(access_token)) {
        access_token = await refreshAccessToken(String(token.refresh_token));
      }

      return {
        ...session,
        access_token: access_token,
        refresh_token: token.refresh_token,
        user: {
          ...user
        }
      };
    }
  }
});
