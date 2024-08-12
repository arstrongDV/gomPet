import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

import { Locale, locales } from './navigation';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();

  // common translations
  const common = (await import(`../locales/${locale}/common.json`)).default;
  const error = (await import(`../locales/${locale}/error.json`)).default;
  const form = (await import(`../locales/${locale}/form.json`)).default;
  const navigation = (await import(`../locales/${locale}/navigation.json`)).default;
  const notifications = (await import(`../locales/${locale}/notifications.json`)).default;

  // page translations
  const landing = (await import(`../locales/${locale}/pages/landing.json`)).default;
  const animals = (await import(`../locales/${locale}/pages/animals.json`)).default;
  const organizations = (await import(`../locales/${locale}/pages/organizations.json`)).default;

  // auth page translations
  const authLogin = (await import(`../locales/${locale}/pages/auth/login.json`)).default;
  const authSignup = (await import(`../locales/${locale}/pages/auth/signup.json`)).default;
  const authPasswordForget = (await import(`../locales/${locale}/pages/auth/password-forget.json`)).default;
  const authPasswordForgetReset = (await import(`../locales/${locale}/pages/auth/password-forget-reset.json`)).default;
  const authVerifyEmail = (await import(`../locales/${locale}/pages/auth/verify-email.json`)).default;
  const authVerifyEmailCheckValid = (await import(`../locales/${locale}/pages/auth/verify-email-check-valid.json`))
    .default;

  return {
    messages: {
      common,
      error,
      form,
      navigation,
      notifications,
      pages: {
        landing,
        animals,
        organizations,
        auth: {
          login: authLogin,
          signup: authSignup,
          passwordForget: authPasswordForget,
          passwordForgetReset: authPasswordForgetReset,
          verifyEmail: authVerifyEmail,
          verifyEmailCheckValid: authVerifyEmailCheckValid
        }
      }
    }
  };
});
