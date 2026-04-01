import React from 'react';
import { Toaster } from 'react-hot-toast';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Raleway } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';

import { auth } from 'src/auth';
import { toastsConfig } from 'src/config/toasts';
import StoreProvider from 'src/lib/store/StoreProvider';
import { Locale, locales } from 'src/navigation';

import 'normalize.css';
import 'src/styles/reset.scss';
import 'src/styles/variables.css';
import 'src/styles/editor.scss';
import 'src/styles/global.scss';

const raleway = Raleway({
  subsets: ['latin', 'latin-ext']
});

export const dynamicParams = true;

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale: typedLocale });

  return {
    title: 'Gompet',
    description: 'Gompet'
  };
}

const RootLayout = async ({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) => {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);
  const messages = await getMessages();
  const session = await auth();

  return (
    <html lang={typedLocale}>
      <body className={raleway.className}>
        <NextIntlClientProvider messages={messages}>
          <SessionProvider session={session}>
            <StoreProvider>
              <Toaster {...toastsConfig} />
              {children}
            </StoreProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
