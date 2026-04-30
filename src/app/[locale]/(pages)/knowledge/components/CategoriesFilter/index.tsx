'use client';

import { Loader } from 'src/components';
import style from './CategoriesFilter.module.scss'
import { useEffect, useState } from 'react';
import useCategories from 'src/components/hooks/useCategories';
import { useRouter, useSearchParams } from 'next/navigation';
import classNames from 'classnames';

const CategoriesFilter = () => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectSubcategories, setSelectSubcategories] = useState<string[]>([]);
    const { categories, subcategories, loading, subcategoriesLoading } = useCategories(selectedCategories);

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('category');
        const base = params.toString();
        const catPart = selectSubcategories.length > 0
            ? `category=${selectSubcategories.join(',')}`
            : '';
        const query = [base, catPart].filter(Boolean).join('&');
        router.push(`?${query}`);
    }, [selectSubcategories]);

    const toggleCategory = (value: string) => {
        setSelectedCategories(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
        setSelectSubcategories([]);
    };

    const toggleSubcategory = (value: string) => {
        setSelectSubcategories(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
    };

    if (loading) return <Loader />;

    return (
        <div className={style.wrapper}>
            <div className={style.categories}>
                {categories.map(cat => (
                    <button
                        key={cat.value}
                        className={classNames(style.categoryBtn, {
                            [style.active]: selectedCategories.includes(String(cat.value))
                        })}
                        onClick={() => toggleCategory(String(cat.value))}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {selectedCategories.length > 0 && (
                <div className={style.subcategoriesWrapper}>
                    <span className={style.subcategoriesLabel}>Podkategorie</span>
                    {subcategoriesLoading ? (
                        <Loader />
                    ) : (
                        <div className={style.subcategories}>
                            {subcategories.map(cat => (
                                <button
                                    key={cat.value}
                                    className={classNames(style.subcategoryBtn, {
                                        [style.active]: selectSubcategories.includes(String(cat.value))
                                    })}
                                    onClick={() => toggleSubcategory(String(cat.value))}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CategoriesFilter;
