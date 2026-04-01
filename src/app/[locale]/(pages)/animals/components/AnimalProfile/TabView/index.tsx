'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { SectionHeader, TabMenu } from 'src/components';
import { TabMenuItem } from 'src/components/layout/TabMenu';
import { IAnimal, IComment, IPost } from 'src/constants/types';
import AnimalInformation from '../AnimalInforamtion';
import AnimalActivity from '../AnimalActivity';

type TabViewProps = {
    animal: IAnimal;
    posts: IPost[];
    comments: IComment[];
    followers: number;
    familyTree: any;
};

const TabView = ({ animal, posts, comments, familyTree, followers}: TabViewProps) => {
  const t = useTranslations();
  const menu: TabMenuItem[] = useMemo(
    () => [
      {
        label: 'Informacje',
        id: 'main'
      },
      {
        label: 'Aktywność',
        id: 'activity'
      }
    ],
    [t]
  );

  const [tab, setTab] = useState(menu[0]);

  if (!animal) return null;

  return (
    <>
      <SectionHeader
        title='Hej!'
        subtitle={`Nazywam się ${animal?.name}`}
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
