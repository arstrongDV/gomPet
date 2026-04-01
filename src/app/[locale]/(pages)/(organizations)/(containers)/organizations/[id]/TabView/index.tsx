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

  // const deleteOrganization = async() => {
  //   try{
  //     const res_delete = await OrganizationsApi.deleteOrganizationProfile(data.id)
  //     console.log(res_delete);
  //     push('/my-animals')
  //     toast.success("Organizacja usunieta")
  //   }catch(err){
  //     console.log(err);
  //     toast.error("Nie udalo sie usunac organizacje")
  //   }
  // }

  // const handleUpdateClick = () => {
  //   push(Routes.ORGANIZATION_EDIT(data.id))
  // };

  // const menu: TabMenuItem[] = useMemo(
  //   () => [
  //     {
  //       label: 'Informacje',
  //       id: 'main'
  //     },
  //     {
  //       label: 'Podopieczni',
  //       id: 'animals'
  //     },
  //     {
  //       label: 'Mioty',
  //       id: 'litters'
  //     },
  //     {
  //       label: 'Aktywność',
  //       id: 'activity'
  //     }
      
  //   ],
  //   [t]
  // );

  const menu: TabMenuItem[] = useMemo(() => {
    const baseMenu: TabMenuItem[] = [
      { label: 'Informacje', id: 'main' },
      { label: 'Podopieczni', id: 'animals' },
      { label: 'Mioty', id: 'litters' },
      { label: 'Aktywność', id: 'activity' }
    ];
  
    if (isOwner) {
      baseMenu.push({
        label: 'Members',
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
        title='Hej!'
        subtitle='Witamy na naszym profilu'
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