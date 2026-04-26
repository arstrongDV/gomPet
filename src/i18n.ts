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
  const posts = (await import(`../locales/${typedLocale}/posts.json`)).default;

  // header translations
  const header = (await import(`../locales/${typedLocale}/header.json`)).default;

  // page translations
  const landing = (await import(`../locales/${typedLocale}/pages/landing.json`)).default;
  const animals = (await import(`../locales/${typedLocale}/pages/animals.json`)).default;
  const knowledge = (await import(`../locales/${typedLocale}/pages/knowledge.json`)).default;
  const newAnimal = (await import(`../locales/${typedLocale}/pages/newAnimal.json`)).default;
  const myAnimals = (await import(`../locales/${typedLocale}/pages/myAnimals.json`)).default;
  const organizations = (await import(`../locales/${typedLocale}/pages/organizations.json`)).default;
  const documents = (await import(`../locales/${typedLocale}/pages/documents.json`)).default;
  const newOrganization = (await import(`../locales/${typedLocale}/pages/newOrganization.json`)).default;
  const newLitter = (await import(`../locales/${typedLocale}/pages/newLitter.json`)).default;
  const profile = (await import(`../locales/${typedLocale}/pages/profile.json`)).default;

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
      header,
      posts,
      common,
      error,
      form,
      navigation,
      notifications,
      pages: {
        landing,
        knowledge,
        animals,
        myAnimals,
        newAnimal,
        organizations,
        documents,
        newOrganization,
        newLitter,
        profile,
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
