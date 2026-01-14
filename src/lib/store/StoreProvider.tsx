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

  // Inicjalizacja store tylko raz
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


  useEffect(() => {
    const store = storeRef.current;
    if (!store) return;

    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const bookmarks = state.bookmarks.favorites;
      const posts = state.posts.posts
      const comments = state.comments.comments

      try {
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        localStorage.setItem('posts', JSON.stringify(posts));
        localStorage.setItem('comments', JSON.stringify(comments));
      } catch (err) {
        console.error('Failed to save localStorage', err);
      }
    });

    return () => unsubscribe();
  }, []);

  // Ustawienie danych sesji do store
  useEffect(() => {
    if (!storeRef.current) return;
  
    if (session.status === 'authenticated' && session.data) {
      storeRef.current.dispatch(setAuth({
        access_token: session.data.access_token,
        refresh_token: session.data.refresh_token,
        user: session.data.user
      }));
    } else if (session.status === 'unauthenticated') {
      storeRef.current.dispatch(clearAuth());
    }
  }, [session.status, session.data]);


  // Subskrybuj zmiany tokena w store i aktualizuj sesję jeśli potrzeba
  useEffect(() => {
    const store = storeRef.current;
    if (!store || session.status !== 'authenticated') return;

    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const storeToken = state.auth.access_token;
      const sessionToken = session.data?.access_token;

      const bookmarks = state.bookmarks.favorites;
      const posts = state.posts.posts
      const comments = state.comments.comments

      session.update({ bookmarks }).catch((err) => {
        console.error('Failed to update session bookmarks:', err);
      });
      session.update({ posts }).catch((err) => {
        console.error('Failed to update session posts:', err);
      });
      session.update({ comments }).catch((err) => {
        console.error('Failed to update session posts:', err);
      });


      if (storeToken && storeToken !== sessionToken) {
        session.update({ access_token: storeToken }).catch(() => {
          store.dispatch(clearAuth());
          logout();
        });
      }
    });

    return () => unsubscribe();
  }, [session]);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
