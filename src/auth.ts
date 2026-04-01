import { isAxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import NextAuth from 'next-auth';
import credentials from 'next-auth/providers/credentials';

import { AuthApi } from './api';

// const isTokenValid = (token: string) => {
//   try {
//     const { exp } = jwtDecode(token) as { exp: number };
//     return exp * 1000 >= Date.now();
//   } catch (e) {
//     return false;
//   }
// };

// const refreshAccessToken = async (refreshToken: string) => {
//   try {
//     const { data } = await AuthApi.refreshAuthToken({ refresh: refreshToken });
//     return data.access;
//   } catch (e) {
//     return null;
//   }
// };

const isTokenValid = (token?: string | null) => {
  if (typeof token !== 'string' || !token.trim()) {
    return false;
  }

  try {
    const { exp } = jwtDecode(token) as { exp: number };
    // Add 30 second buffer to avoid race conditions
    return (exp * 1000) - 30000 >= Date.now();
  } catch (e) {
    return false;
  }
};

const getTokenExpiration = (token: string) => {
  try {
    const { exp } = jwtDecode(token) as { exp: number };
    return exp * 1000;
  } catch (e) {
    return 0;
  }
};

const refreshAccessToken = async (refreshToken?: string | null) => {
  if (typeof refreshToken !== 'string' || !refreshToken.trim()) {
    return null;
  }

  try {
    const { data } = await AuthApi.refreshAuthToken({ refresh: refreshToken });

    if (typeof data?.access !== 'string' || !isTokenValid(data.access)) {
      throw new Error('Invalid token from refresh');
    }

    return data.access;
  } catch (e) {
    console.error('Refresh token failed:', e);
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
    // async jwt({ token, trigger, user, session }) {
    //   if (trigger === 'update') {
    //     return {
    //       ...token,
    //       access_token: token.access_token,
    //       refresh_token: token.refresh_token,
    //       user: session.user
    //     };
    //   }

    //   if (user) {
    //     return {
    //       ...token,
    //       access_token: user.access_token,
    //       refresh_token: user.refresh_token,
    //       user
    //     };
    //   }

    //   return token;
    // },
    // async session({ token, session }) {
    //   const user: AdapterUser = token.user as AdapterUser;

    //   delete user.access_token;
    //   delete user.refresh_token;

    //   let access_token: string = token.access_token as string;

    //   if (!isTokenValid(access_token)) {
    //     access_token = await refreshAccessToken(String(token.refresh_token));
    //   }

    //   return {
    //     ...session,
    //     access_token: access_token,
    //     refresh_token: token.refresh_token,
    //     user: {
    //       ...user
    //     }
    //   };
    // }
    async jwt({ token, user }) {
      if (user) {
        const accessToken = typeof user.access_token === 'string' ? user.access_token : null;

        return {
          ...token,
          access_token: accessToken,
          refresh_token: typeof user.refresh_token === 'string' ? user.refresh_token : null,
          user,
          accessTokenExpires: accessToken ? getTokenExpiration(accessToken) : 0,
          error: undefined
        };
      }

      const accessToken =
        typeof token.access_token === 'string' ? token.access_token : null;

      if (accessToken && isTokenValid(accessToken)) {
        return token;
      }

      const refreshedToken = await refreshAccessToken(
        typeof token.refresh_token === 'string' ? token.refresh_token : null
      );

      if (refreshedToken) {
        return {
          ...token,
          access_token: refreshedToken,
          accessTokenExpires: getTokenExpiration(refreshedToken),
          error: undefined
        };
      }

      return {
        ...token,
        access_token: null,
        refresh_token: null,
        error: 'RefreshAccessTokenError'
      };
    },

    // async session({ token, session }) {
    //   if (token.error) {
    //     throw new Error("RefreshAccessTokenError");
    //   }
    
    //   const user: AdapterUser = token.user as AdapterUser;
    
    //   // delete user.access_token;
    //   // delete user.refresh_token;
    
    //   return {
    //     ...session,
    //     access_token: token.access_token,
    //     refresh_token: token.refresh_token,
    //     user: {
    //       ...user,
    //       access_token: token.access_token,
    //       refresh_token: token.refresh_token,
    //     },
    //     error: token.error,
    //   };
    // }
    async session({ token, session }) {
      const access = typeof token.access_token === 'string' ? token.access_token : '';
      const refresh = typeof token.refresh_token === 'string' ? token.refresh_token : '';
      const tokenUser =
        token.user && typeof token.user === 'object' ? token.user : undefined;

      session.access_token = access;
      session.refresh_token = refresh;
      if (tokenUser) {
        session.user = tokenUser as typeof session.user;
      }

      if (!isTokenValid(access)) {
        return session;
      }

      try {
        const { data: freshUser } = await AuthApi.getLoginUser(access);
        session.user = freshUser;
      } catch (error) {
        if (isAxiosError(error)) {
          console.error('Unable to fetch user for session:', {
            code: error.code,
            status: error.response?.status,
            url: error.config?.url,
            baseURL: error.config?.baseURL
          });
        } else {
          console.error('Unable to fetch user for session:', error);
        }
      }

      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 // 1 day
  }
});
