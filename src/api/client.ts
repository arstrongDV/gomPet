import { Store } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';

import { logout } from 'src/app/[locale]/auth/logout/actions';
import { refreshTokens } from 'src/app/[locale]/auth/slice';

import { isNetworkError } from './utils';
import { AuthApi } from '.';

let store: Store;

export const injectStore = (_store: Store) => {
  store = _store;
};

let token: string | undefined;

export const injectToken = (_token?: string) => {
  token = _token;
};

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,   //NEXT_PUBLIC_API_BASE_URL
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en'
  },
  __tokenRequired: true
});

client.interceptors.request.use(async (config) => {
  const access = store?.getState()?.auth?.access_token || token;
  if (config.__tokenRequired && config.headers && access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (isNetworkError(error)) {
      // throttledNotifyNetworkError();
      console.log('network error');
    }
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject(error);
    }

    if (error.response.status === 401 && 
      !originalRequest._retry && 
      error.response.data?.code === 'token_not_valid') {
    originalRequest._retry = true;

      const refreshToken = store.getState().auth.refresh_token || null;
      if (!refreshToken) return;

      try {
        const { data } = await AuthApi.refreshAuthToken({ refresh: refreshToken });

        store.dispatch(
          refreshTokens({
            access_token: data.access || null,
            refresh_token: refreshToken || null
          })
        );

        return client(originalRequest);
      } catch (err) {
        Promise.reject(error);
        logout();
      }
    }
    return Promise.reject(error);
  }
);

class ApiClient {
  static get(url: string, params?: object, customConfigs?: AxiosRequestConfig) {
    const configs = { params, ...customConfigs };
    const promise = client.get(url, configs);
    return promise;
  }
  static post(url: string, data?: object, customConfigs?: object) {
    const promise = client.post(url, data, customConfigs);
    return promise;
  }
  static put(url: string, data?: object, customConfigs?: object) {
    const promise = client.put(url, data, customConfigs);
    return promise;
  }
  static patch(url: string, data?: object, customConfigs?: object) {
    const promise = client.patch(url, data, customConfigs);
    return promise;
  }
  static delete(url: string, customConfigs?: object) {
    const promise = client.delete(url, customConfigs);
    return promise;
  }
}

export default ApiClient;
