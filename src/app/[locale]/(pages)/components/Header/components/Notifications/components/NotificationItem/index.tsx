import React from 'react';
import { useTranslations } from 'next-intl';

import Pill from 'src/components/layout/Pill';

import { NotificaitonItemType } from '../..';

import style from './NotificationItem.module.scss';

type NotificationItemProps = {
  data: NotificaitonItemType;
  close: () => void;
};

const NotificationItem = ({ data, close }: NotificationItemProps) => {
  const t = useTranslations();
  const date = new Date(data.created_at).toLocaleDateString();

  const markAsSeen = async () => {
    try {
      //await notificationsApi.markAsSeen(data.id);
      close();
    } catch (error) {
      console.log(error);
    }
  };

  const handleNotificationClick = () => {
    switch (data.type) {
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
        <p className={style.content}>{t(`notifications:types.${data.type}`)}</p>
        <span className={style.date}>{date || ''}</span>
      </div>
      {!data.seen && (
        <div className={style.col}>
          <Pill>{t('common:state.new')}</Pill>
        </div>
      )}
    </li>
  );
};

export default NotificationItem;
