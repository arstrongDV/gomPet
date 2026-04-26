'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button, SectionHeader, TabMenu } from 'src/components';
import { TabMenuItem } from 'src/components/layout/TabMenu';
import { IOrganization } from 'src/constants/types';

import Activity from '../Tabs/Activity';
import Animals from '../Tabs/Animals';
import Information from '../Tabs/Information';
import Litters from '../Tabs/Litters';
import { useSession } from 'next-auth/react';

import style from './TabView.module.scss'
import { useRouter } from 'next/navigation';
import { Routes } from 'src/constants/routes';
import { OrganizationsApi } from 'src/api';
import toast from 'react-hot-toast';
import Members from '../Tabs/Members/page';

import { useSearchParams } from 'next/navigation';

type TabViewProps = {
  data: IOrganization;
};

const TabView = ({ data }: TabViewProps) => {
  const t = useTranslations();
  const session = useSession()
  const organizationId = Number(session.data?.user.id)
  const isOwner = organizationId === data.user;

  console.log("datauserdata: ", data);

  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab');

  console.log(data)

  const router = useRouter();
  const { push } = router;

  const menu: TabMenuItem[] = useMemo(() => {
    const baseMenu: TabMenuItem[] = [
      { label: t('pages.organizations.tabs.information'), id: 'main' },
      { label: t('pages.organizations.tabs.animals'), id: 'animals' },
      { label: t('pages.organizations.tabs.litters'), id: 'litters' },
      { label: t('pages.organizations.tabs.activity'), id: 'activity' }
    ];

    if (isOwner) {
      baseMenu.push({
        label: t('pages.organizations.tabs.members'),
        id: 'members'
      });
    }

    return baseMenu;
  }, [t, isOwner]);

  const initialTab = menu.find(tab => tab.id == tabFromUrl) ?? menu[0];

  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    if (tabFromUrl === 'members' && !isOwner) {
      setTab(menu[0]);
      push('?tab=main', { scroll: false });
    }
  }, [tabFromUrl, isOwner, menu]);

  if (!data) return null;
  return (
    <>
      <SectionHeader
        title={t('pages.organizations.tabView.greeting')}
        subtitle={t('pages.organizations.tabView.welcome')}
        margin
      >
        <TabMenu
          items={menu}
          selected={tab}
          // onClick={setTab}
          onClick={(item) => {
            setTab(item);
            push(`?tab=${item.id}`, { scroll: false });
          }}
        />
      </SectionHeader>

      {tab.id === 'main' && <Information organization={data} />}
      {tab.id === 'animals' && <Animals organization={data} />}
      {tab.id === 'litters' && <Litters organization={data} />}
      {tab.id === 'activity' && <Activity organization={data} />}

      {tab.id === 'members' && isOwner && <Members />}

      {/* {isOwner && (
        <div className={style.actionButtons}>
          <Button className={style.editBtn} label="Edyt" onClick={handleUpdateClick} />
          <Button className={style.delBtn} label="Delete" onClick={deleteOrganization} />
        </div>
        )} */}
    </>
  );
};

export default TabView;