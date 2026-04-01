import React, { cache } from 'react';
import { setRequestLocale } from 'next-intl/server';

import { injectToken } from 'src/api/client';
import { auth } from 'src/auth';
import { Loader } from 'src/components';
import { articlesMock } from 'src/mocks/articles';
import { Locale } from 'src/navigation';

import style from './BlogArticlePage.module.scss';
import { ArticlesApi } from 'src/api';
import KnowledgePage from '.';

const getData = cache(async (slug: string) => {
  const session = await auth();
  injectToken(session?.access_token);
  // const { data } = await OffersApi.getOffer(slug);
  const { data } = await ArticlesApi.getArticlePage(slug);
  return data;
  
  // return articlesMock[0];
});

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const data = await getData(slug);
  console.log(data);
  if (!data) {
    return {
      title: 'Article not found'
    };
  }

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
  params
}: Readonly<{ params: Promise<{ locale: string; slug: string }> }>) => {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  const session = await auth();
  const data = await getData(slug);

  if (!data) return <Loader />;
  return (
    <div>
      <KnowledgePage data={data} />
      {/* <h1>Offer</h1>

      {data.image && (
        <img
          src={data.image}
          alt={data.title}
        />
      )}
      <h2>{data.title}</h2>
      <p>{data.content}</p> */}
    </div>
  );
};

export default BlogArticlePage;
