'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { SectionHeader, TabMenu } from 'src/components';
import { TabMenuItem } from 'src/components/layout/TabMenu';
import { IAnimal, IComment, IPost } from 'src/constants/types';
import AnimalInformation from '../AnimalInforamtion';
import AnimalActivity from '../AnimalActivity';
import { notFound } from 'next/navigation';

type TabViewProps = {
    animal: IAnimal;
    posts: IPost[];
    comments: IComment[];
    followers: number;
    familyTree: any;
};

const TabView = ({ animal, posts, comments, familyTree, followers}: TabViewProps) => {
  const t = useTranslations('pages.animals.profile');
  const menu: TabMenuItem[] = useMemo(
    () => [
      {
        label: t('tabs.information'),
        id: 'main'
      },
      {
        label: t('tabs.activity'),
        id: 'activity'
      }
    ],
    [t]
  );

  const [tab, setTab] = useState(menu[0]);

  if (!animal) notFound();

  return (
    <>
      <SectionHeader
        title={t('greeting')}
        subtitle={t('myNameIs', { name: animal?.name })}
        margin
      >
        <TabMenu
          items={menu}
          selected={tab}
          onClick={setTab}
        />
      </SectionHeader>

      {tab.id === 'main' && <AnimalInformation animal={animal} followers={followers} comments={comments} familyTree={familyTree}  />}
      {tab.id === 'activity' && (
        <AnimalActivity
          postsData={posts}
          animalId={animal.id}
          animalOwnerId={typeof animal.owner === 'number' ? animal.owner : animal.owner?.id}
        />
      )}
    </>
  );
};

export default TabView;
