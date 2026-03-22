'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArticlesApi } from 'src/api';
import toast from 'react-hot-toast';

export type Category = {
  id: number;
  label: string;
};

type ApiCategory = {
  id: number;
  name: string;
};

const useCategories = () => {
  const t = useTranslations('common');
  const [data, setData] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getCategories = async () => {
    setLoading(true);
    try {
      const res = await ArticlesApi.getArticlesCategories();
      setData(res.data.results);
    } catch (err) {
      toast.error('Nie udało się pobrać kategorii');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const categories: Category[] = useMemo(
    () =>
      data.map((item) => ({
        id: item.id,
        label: t(`categories.${item.name}`),
      })),
    [data, t]
  );

  return { categories, loading };
};

export default useCategories;
