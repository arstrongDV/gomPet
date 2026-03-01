import React from 'react';
import { useTranslations } from 'next-intl';
import Pill from 'src/components/layout/Pill';
// import { NotificaitonItemType } from '../..';
import style from './NotificationItem.module.scss';
import { Routes } from 'src/constants/routes';
import { redirect, useRouter } from 'next/navigation';
import { NotificaitonItemType } from 'src/constants/types';

type NotificationItemProps = {
  data: NotificaitonItemType;
  close: () => void;
};

const NotificationItem = ({ data, close }: NotificationItemProps) => {
  const t = useTranslations();
  const date = new Date(data.created_at).toLocaleDateString();
  const router = useRouter();
  const { push } = router;
  console.log("datadatadata::: ", data);
  const markAsSeen = async () => {
    try {
      //await notificationsApi.markAsSeen(data.id);
      close();
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleNotificationClick = () => {
    switch (data.origin.type) {
      case 'organization':
        push(Routes.ORGANIZATION_MEMBERS(data.origin.id))
      case 'unknown':
        break;
    }
    markAsSeen();
  };

  return (
    <li
      className={style.item}
      onClick={handleNotificationClick}
      role='button'
    >
      <div className={style.col}>
        {/* <p className={style.content}>{t(`notifications:types.${data.type}`)}</p> */}
        <p className={style.content}>{data.actor.first_name} {data.verb}</p>
        <span className={style.date}>{date || ''}</span>
      </div>
      {!data.is_read && ( //seen
        <div className={style.col}>
          <Pill>{t('common:state.new')}</Pill>
        </div>
      )}
    </li>
  );
};

export default NotificationItem;