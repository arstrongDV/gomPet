import React, { cache } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { OffersApi, OrganizationsApi } from 'src/api';
import { injectToken } from 'src/api/client';
import { auth } from 'src/auth';
import { Loader } from 'src/components';
import { organizationsMock } from 'src/mocks/organizations';
import { Locale } from 'src/navigation';

import TabView from './TabView';

import style from './OrganizationPage.module.scss';

const getData = cache(async (id: number) => {
  const session = await auth();
  injectToken(session?.access_token);
  try {
    const { data } = await OffersApi.getOffer(id);
    return data;
  } catch (error) {
    throw error;
  }
});

export const generateMetadata = async ({ params: { id } }: { params: { id: string } }) => {
  const data = await getData(+id);

  return {
    title: data.title,
    description: data.description,
    image: data.image,
    openGraph: {
      images: data.image
    }
  };
};

const OrganizationPage = async ({ params: { locale, id } }: Readonly<{ params: { locale: Locale; id: string } }>) => {
  unstable_setRequestLocale(locale);
  const session = await auth();
  const data = await getData(+id);
  // const data = organizationsMock[0];

  if (!data) return <Loader />;
  return <TabView data={data} />;
};

export default OrganizationPage;
