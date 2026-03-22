'use client'
import { HorizontalScroll, LabelLink, Loader } from 'src/components';
import style from './KnowledgeScroll.module.scss'
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import KnowledgeCard from '../../../knowledge/components/ArticleCard';
import { ArticlesApi } from 'src/api';
import { IArticle } from 'src/constants/types';
import { Routes } from 'src/constants/routes';

const KnowledgeScroll = () => {
    const t = useTranslations('pages.landing');

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [knowledges, setKnowledge] = useState<IArticle[]>([]);

    const fetchKnowledge = async() => {
        try {
            const res = await ArticlesApi.getLatestArticles(3, true);
            setKnowledge(res.data.results ?? []);
          } catch (err) {
            setKnowledge([]);
          } finally {
            setIsLoading(false);
          }
    }
    useEffect(() => {
        fetchKnowledge();
    }, [])

    return(
        <div className={style.container}>
            <header className={style.header}>
                <h3 className={style.title}>
                    {t.rich('knowledgeScroll.title', {
                        highlight: (chunks) => <span className={style.highlight}>{chunks}</span>
                    })}
                </h3>
            </header>
            {isLoading || knowledges.length !== 0 ? (
                <HorizontalScroll className={style.list}>
                    {isLoading && <Loader />}
                    {knowledges.map((knowledge) => (
                        <KnowledgeCard
                            key={knowledge.id}
                            // className={style.item}
                            article={knowledge}
                        />
                    ))}
                </HorizontalScroll>
            ) : (
                <p className={style.noArticles}>Brak artyklow</p>
            )}

            <LabelLink
                href={Routes.KNOWLEDGE}
                label={t('knowledgeScroll.seeAll')}
                color='dimmed'
            />
        </div>
    )
}

export default KnowledgeScroll;