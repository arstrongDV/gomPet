import { isServer } from './helpers';

export const getLocalStorageItem = (key: string) => {
  if (isServer()) return null;

  const value = window.localStorage.getItem(key);
  if (value === '') {
    return null;
  }
  return value;
};

export const setLocalStorageItem = (key: string, value: string) => {
  if (isServer()) return;

  if (value == null) {
    value = '';
  }
  window.localStorage.setItem(key, value);
};

export const deleteLocalStorageItem = (key: string) => {
  if (isServer()) return;
  window.localStorage.removeItem(key);
};

export const getSessionStorageItem = (key: string) => {
  if (isServer()) return null;

  const value = window.sessionStorage.getItem(key);
  if (value === '') {
    return null;
  }
  return value;
};

export const setSessionStorageItem = (key: string, value: string) => {
  if (isServer()) return;

  if (value == null) {
    value = '';
  }
  window.sessionStorage.setItem(key, value);
};

export const deleteSessionStorageItem = (key: string) => {
  if (isServer()) return;
  window.sessionStorage.removeItem(key);
};
