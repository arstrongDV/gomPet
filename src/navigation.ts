import { createNavigation } from 'next-intl/navigation';

export type Locale = 'pl';

// export const locales = ['pl'] as Locale[];
export const locales = ['pl', 'en'] as const;

export const { Link, redirect, usePathname, useRouter } = createNavigation({ locales });
