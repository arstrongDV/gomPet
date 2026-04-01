import createNextIntlPlugin from 'next-intl/plugin';
<<<<<<< HEAD

const withNextIntl = createNextIntlPlugin();
=======
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
>>>>>>> 1d841ed (fillters fixed)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
<<<<<<< HEAD
=======
  outputFileTracingRoot: __dirname,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src'), path.join(__dirname, 'src/styles')]
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js'
      }
    }
  },
>>>>>>> 1d841ed (fillters fixed)
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack']
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  }
};

export default withNextIntl(nextConfig);
