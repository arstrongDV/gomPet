'use client';
import React, { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { useSession } from 'next-auth/react';

import { injectStore } from 'src/api/client';
import { logout } from 'src/app/[locale]/auth/logout/actions';
import { clearAuth, setAuth } from 'src/app/[locale]/auth/slice';
import { AppStore, makeStore } from 'src/lib/store';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();

    // If the user is authenticated, set the auth state
    if (session.status === 'authenticated') {
      storeRef.current.dispatch(setAuth(session.data));
    }

    injectStore(storeRef.current);
  }

  useEffect(() => {
    // If the user logs out, clear the auth state
    if (storeRef.current && session.status === 'unauthenticated') {
      storeRef.current.dispatch(clearAuth());
    }
  }, [session.status]);

  // Used for token refresh, if the access token changes in the store, update the session token
  useEffect(() => {
    const storeToken = storeRef?.current?.getState().auth.access_token;
    const sessionToken = session.data?.access_token;

    const refreshToken = async () => {
      if (storeToken !== sessionToken) {
        if (session.status === 'authenticated') {
          try {
            await session.update({
              access_token: storeToken
            });
          } catch (e) {
            logout();
          }
        } else {
          storeRef?.current?.dispatch(clearAuth());
        }
      }
    };

    refreshToken();
  }, [storeRef.current.getState().auth.access_token]);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
