import { createNavigation } from 'next-intl/navigation';

export type Locale = 'pl';

export const locales = ['pl'] as Locale[];

export const { Link, redirect, usePathname, useRouter } = createNavigation({ locales });
