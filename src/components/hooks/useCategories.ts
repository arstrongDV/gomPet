'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArticlesApi } from 'src/api';
import toast from 'react-hot-toast';

export type Category = {
    value: string,
    label: string,
};

export type Subcategory = {
    value: number,
    label: string,
};

type ApiCategoryResponse = {
    value: string,
    label: string,
    categories_count: number
};

interface ApiSubcategoryGroupResponse {
    id: number;
    group: string;
    code: string;
    name: string;
    slug: string;
    description: string;
}

const useCategories = (selectedCategories: string[]) => {
  const t = useTranslations('pages.knowledge.categories');
  const tSub = useTranslations('pages.knowledge.subcategories');
  const [categoriesGroups, setCategoriesGroups] = useState<ApiCategoryResponse[]>([]);
  const [subategoriesGroups, setSubcategoriesGroups] = useState<ApiSubcategoryGroupResponse[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState<boolean>(false);

  const getCategories = async () => {
    setLoading(true);
    try {
      const res = await ArticlesApi.getArticlesCategories();
      setCategoriesGroups(res.data);
    } catch (err) {
      setCategoriesGroups([]);
      toast.error('Nie udało się pobrać kategorii');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  const getSubcategory = async(selectedCategories: string[]) => {
    if (selectedCategories.length === 0) {
      setSubcategoriesGroups([]);
      return;
    }
    setSubcategoriesLoading(true);
    try{
      const group = await ArticlesApi.getArticlesCategories(selectedCategories);
      setSubcategoriesGroups(group.data.results ?? group.data ?? []);
    } catch (err){
      setSubcategoriesGroups([]);
      toast.error("Nie udalo sie pobrac group kategorii");
    } finally{
      setSubcategoriesLoading(false);
    }
  }
  const categoriesKey = selectedCategories.join(',');
  useEffect(() => {
    getSubcategory(selectedCategories)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesKey])


  const categories: Category[] = useMemo(
    () =>
      categoriesGroups.map((item) => ({
        value: item.value,
        label: (() => {
          return t(item.label);
        })(),
      })),
    [categoriesGroups, t]
  );

  const subcategories: Subcategory[] = useMemo(
    () =>
      (subategoriesGroups ?? []).map((item) => ({
        value: item.id,
        label: (() => {
          try { return tSub(item.code as any); } catch { return item.name; }
        })(),
      })),
    [subategoriesGroups, tSub]
  );

  return {
    categories,
    subcategories,
    loading,
    subcategoriesLoading
  };
};

export default useCategories;
