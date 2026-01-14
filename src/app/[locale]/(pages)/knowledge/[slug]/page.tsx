import React, { cache } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { injectToken } from 'src/api/client';
import { auth } from 'src/auth';
import { Loader } from 'src/components';
import { articlesMock } from 'src/mocks/articles';
import { Locale } from 'src/navigation';

import style from './BlogArticlePage.module.scss';

const getData = cache(async (slug: string) => {
  const session = await auth();
  injectToken(session?.access_token);
  // const { data } = await OffersApi.getOffer(slug);

  // return data;

  return articlesMock[0];
});

export const generateMetadata = async ({ params: { slug } }: { params: { slug: string } }) => {
  const data = await getData(slug);

  return {
    title: data.title,
    description: data.content,
    image: data.image,
    openGraph: {
      images: data.image
    }
  };
};

const BlogArticlePage = async ({
  params: { locale, slug }
}: Readonly<{ params: { locale: Locale; slug: string } }>) => {
  unstable_setRequestLocale(locale);
  const session = await auth();
  const data = await getData(slug);

  if (!data) return <Loader />;
  return (
    <div>
      <h1>Offer</h1>

      {data.image && (
        <img
          src={data.image}
          alt={data.title}
        />
      )}
      <h2>{data.title}</h2>
      <p>{data.content}</p>
    </div>
  );
};

export default BlogArticlePage;
