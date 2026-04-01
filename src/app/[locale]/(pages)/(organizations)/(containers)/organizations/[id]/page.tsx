import React, { cache } from 'react';
import { setRequestLocale } from 'next-intl/server';

import { OffersApi, OrganizationsApi, PostsApi } from 'src/api';
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
    const { data } = await OrganizationsApi.getOrganizationProfile(id);
    return data;
  } catch (error) {
    throw error;
  }
});

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
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

const OrganizationPage = async ({
  params
}: Readonly<{ params: Promise<{ locale: string; id: string }> }>) => {
  const { locale, id } = await params;
  setRequestLocale(locale as Locale);
  // const session = await auth();
  const data = await getData(+id);

  if (!data) return <Loader />;
  return <TabView data={data} />;
};

export default OrganizationPage;
