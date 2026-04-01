import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

import { Locale, locales } from './navigation';

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const fallbackLocale = locales[0];
  const requestedLocale = locale ?? (await requestLocale) ?? fallbackLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!requestedLocale || !locales.includes(requestedLocale as Locale)) notFound();

  const typedLocale = requestedLocale as Locale;

  // common translations
  const common = (await import(`../locales/${typedLocale}/common.json`)).default;
  const error = (await import(`../locales/${typedLocale}/error.json`)).default;
  const form = (await import(`../locales/${typedLocale}/form.json`)).default;
  const navigation = (await import(`../locales/${typedLocale}/navigation.json`)).default;
  const notifications = (await import(`../locales/${typedLocale}/notifications.json`)).default;

  // page translations
  const landing = (await import(`../locales/${typedLocale}/pages/landing.json`)).default;
  const animals = (await import(`../locales/${typedLocale}/pages/animals.json`)).default;
  const newAnimal = (await import(`../locales/${typedLocale}/pages/newAnimal.json`)).default;
  const myAnimals = (await import(`../locales/${typedLocale}/pages/myAnimals.json`)).default;
  const organizations = (await import(`../locales/${typedLocale}/pages/organizations.json`)).default;

  // auth page translations
  const authLogin = (await import(`../locales/${typedLocale}/pages/auth/login.json`)).default;
  const authSignup = (await import(`../locales/${typedLocale}/pages/auth/signup.json`)).default;
  const authPasswordForget = (await import(`../locales/${typedLocale}/pages/auth/password-forget.json`)).default;
  const authPasswordForgetReset = (await import(`../locales/${typedLocale}/pages/auth/password-forget-reset.json`)).default;
  const authVerifyEmail = (await import(`../locales/${typedLocale}/pages/auth/verify-email.json`)).default;
  const authVerifyEmailCheckValid = (await import(`../locales/${typedLocale}/pages/auth/verify-email-check-valid.json`))
    .default;

  return {
    locale: typedLocale,
    messages: {
      common,
      error,
      form,
      navigation,
      notifications,
      pages: {
        landing,
        animals,
        myAnimals,
        newAnimal,
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
