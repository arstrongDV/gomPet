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

const isServerSide = typeof window === 'undefined';
const resolvedBaseURL = isServerSide
  ? (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL)
  : process.env.NEXT_PUBLIC_API_URL;
const publicApiOrigin = (() => {
  const value = process.env.NEXT_PUBLIC_API_URL;
  if (!value) return '';
  try {
    return new URL(value).origin;
  } catch {
    return '';
  }
})();

const internalApiHosts = (() => {
  const hosts = new Set<string>(['web', 'web:8000']);
  const internalApiUrl = process.env.INTERNAL_API_URL;
  if (!internalApiUrl) return hosts;

  try {
    const parsed = new URL(internalApiUrl);
    hosts.add(parsed.host);
    hosts.add(parsed.hostname);
  } catch {
    // no-op
  }

  return hosts;
})();

const normalizeInternalMediaUrls = (value: unknown): unknown => {
  if (!isServerSide || !publicApiOrigin) return value;

  if (typeof value === 'string') {
    try {
      const parsed = new URL(value);
      const isInternalHost = internalApiHosts.has(parsed.host) || internalApiHosts.has(parsed.hostname);
      const isAssetPath = parsed.pathname.startsWith('/media/') || parsed.pathname.startsWith('/static/');

      if (isInternalHost && isAssetPath) {
        return `${publicApiOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;
      }
    } catch {
      return value;
    }

    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeInternalMediaUrls(item));
  }

  if (value && typeof value === 'object') {
    const output: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      output[key] = normalizeInternalMediaUrls(item);
    }
    return output;
  }

  return value;
};

const client = axios.create({
  baseURL: resolvedBaseURL,
  adapter: isServerSide ? 'fetch' : undefined,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en'
  },
  __tokenRequired: true
});

const RETRIABLE_NETWORK_CODES = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'EHOSTUNREACH',
  'ENETUNREACH'
]);

const RETRIABLE_METHODS = new Set(['get', 'head', 'options']);
const MAX_NETWORK_RETRIES = 2;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

client.interceptors.request.use(async (config) => {
  const access = store?.getState()?.auth?.access_token || token;
  if (config.__tokenRequired && config.headers && access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => {
    if (response?.data) {
      response.data = normalizeInternalMediaUrls(response.data);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = (error.config ?? {}) as AxiosRequestConfig & {
      _retry?: boolean;
      __networkRetryCount?: number;
    };
    
    if (!error.response) {
      const method = String(originalRequest.method || 'get').toLowerCase();
      const retryCount = Number(originalRequest.__networkRetryCount || 0);
      const errorCode = String(error?.code || '');

      if (
        isNetworkError(error) &&
        RETRIABLE_METHODS.has(method) &&
        RETRIABLE_NETWORK_CODES.has(errorCode) &&
        retryCount < MAX_NETWORK_RETRIES
      ) {
        originalRequest.__networkRetryCount = retryCount + 1;
        await sleep((retryCount + 1) * 150);
        return client(originalRequest);
      }

      console.error('Network error:', {
        code: errorCode || 'UNKNOWN',
        method: method.toUpperCase(),
        url: originalRequest.url,
        baseURL: originalRequest.baseURL,
        retryCount
      });
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
