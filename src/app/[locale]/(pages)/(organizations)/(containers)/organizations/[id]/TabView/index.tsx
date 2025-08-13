'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { SectionHeader, TabMenu } from 'src/components';
import { TabMenuItem } from 'src/components/layout/TabMenu';
import { IOrganization } from 'src/constants/types';

import Activity from '../Tabs/Activity';
import Animals from '../Tabs/Animals';
import Information from '../Tabs/Information';
import Litters from '../Tabs/Litters';

type TabViewProps = {
  data: IOrganization;
};

const TabView = ({ data }: TabViewProps) => {
  const t = useTranslations();
  const menu: TabMenuItem[] = useMemo(
    () => [
      {
        label: 'Informacje',
        id: 'main'
      },
      {
        label: 'Podopieczni',
        id: 'animals'
      },
      {
        label: 'Mioty',
        id: 'litters'
      },
      {
        label: 'Aktywność',
        id: 'activity'
      }
    ],
    [t]
  );

  const [tab, setTab] = useState(menu[0]);

  if (!data) return null;
  return (
    <>
      <SectionHeader
        title='Hej!'
        subtitle='Witamy na naszym profilu'
        margin
      >
        <TabMenu
          items={menu}
          selected={tab}
          onClick={setTab}
        />
      </SectionHeader>

      {tab.id === 'main' && <Information organization={data} />}
      {tab.id === 'animals' && <Animals organization={data} />}
      {tab.id === 'litters' && <Litters organization={data} />}
      {tab.id === 'activity' && <Activity organization={data} />}
    </>
  );
};

export default TabView;
