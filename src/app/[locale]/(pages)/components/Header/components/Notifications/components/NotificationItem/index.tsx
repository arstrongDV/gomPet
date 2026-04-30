'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';

import { Avatar } from 'src/components';
import { Routes } from 'src/constants/routes';
import { NotificaitonItemType } from 'src/constants/types';

import style from './NotificationItem.module.scss';

type NotificationItemProps = {
  data: NotificaitonItemType;
  close: () => void;
};

const NotificationItem = ({ data, close }: NotificationItemProps) => {
  const t = useTranslations('common.notifications');
  const { push } = useRouter();

  const actorName = `${data.actor.first_name} ${data.actor.last_name}`.trim();
  const code = data.code || data.type;
  const targetLabel = data.origin?.label || '';

  const getUrl = (): string | null => {
    if (!data.origin) return null;
    switch (data.origin.type) {
      case 'organization': return Routes.ORGANIZATION_PROFILE(data.origin.id);
      case 'animal': return Routes.ANIMAL_PROFILE(data.origin.id);
      default: return null;
    }
  };

  const handleClick = () => {
    const url = getUrl();
    if (url) push(url);
    close();
  };

  const formatDate = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60_000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return t('justNow');
    if (diffMins < 60) return t('minutesAgo', { count: diffMins });
    if (diffHours < 24) return t('hoursAgo', { count: diffHours });
    if (diffDays < 30) return t('daysAgo', { count: diffDays });
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <li
      className={classNames(style.item, { [style.unread]: !data.is_read })}
      onClick={handleClick}
      role="button"
    >
      <Avatar profile={data.actor} className={style.avatar} />
      <div className={style.col}>
        <p className={style.content}>
          <b>{actorName}</b>{' '}
          {t(code)}
          {targetLabel && <> <b>{targetLabel}</b></>}
        </p>
        <span className={style.date}>{formatDate(data.created_at)}</span>
      </div>
      {!data.is_read && <div className={style.unreadDot} />}
    </li>
  );
};

export default NotificationItem;
