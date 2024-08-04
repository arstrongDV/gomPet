import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export type Locale = 'pl' | 'en';

export const locales = ['pl', 'en'] as Locale[];

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({ locales });
