'use client';

import React from 'react';
import { useLocale } from 'next-intl';

import { Locale } from 'src/navigation';
import { usePathname, useRouter } from 'src/navigation';

const LanguageSwitcher = () => {
  const current = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locale = e.target.value as Locale;
    router.push(pathname, { locale });
  };

  return (
    <label>
      <select
        defaultValue={current}
        onChange={onChange}
      >
        <option value='pl'>Polski</option>
        <option value='en'>English</option>
      </select>
    </label>
  );
};

export default LanguageSwitcher;
