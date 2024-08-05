'use client';

import React, { useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import { CloseButton, Icon, Pill, useWebsocket } from 'components';

import { WebsocketRoutes } from 'src/api/routes';

import NotificationItem from './components/NotificationItem';

import style from './Notifications.module.scss';

type NotificationType = string;

export type NotificaitonItemType = {
  id: number;
  author: number | null;
  user: number | null;
  first_name: string | null;
  last_name: string | null;
  data: {
    [key: string]: any;
  };
  metadata: object;
  created_at: string;
  seen: boolean;
  type: NotificationType;
};

const Notifications = () => {
  const t = useTranslations('notifications');

  const [ready, val, send] = useWebsocket(WebsocketRoutes.GET_NOTIFICATIONS);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notificaitons, setNotificaitons] = useState<NotificaitonItemType[]>([]);

  const handleNotificationClick = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (val) {
      try {
        //setNotificaitons(JSON.parse(JSON.parse(val).data) as NotificaitonItemType[]);
      } catch (error) {
        console.log(error);
      }
    }
  }, [val]);

  useEffect(() => {
    // if (ready) {
    //   send(
    //     JSON.stringify({
    //       action: 'subscribe_instance',
    //       pk: 1,
    //       request_id: 1
    //     })
    //   );
    // }
  }, [ready, send]);

  return (
    <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
      <div className={style.container}>
        <button
          className={style.button}
          onClick={handleNotificationClick}
          title={'Powiadomienia'}
        >
          <Icon
            name={isOpen ? 'bellFilled' : 'bell'}
            className={classNames(style.icon, { [style.active]: isOpen })}
          />
          {notificaitons?.filter((item) => !item.seen).length > 0 && (
            <Pill className={style.counter}>{notificaitons?.filter((item) => !item.seen).length || '0'}</Pill>
          )}
        </button>

        <div className={classNames(style.notifications, { [style.open]: isOpen })}>
          <div className={style.header}>
            <h4 className={style.title}>{t('title')}</h4>
            <CloseButton
              isOpen={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
              className={style.closeButton}
            />
          </div>
          <ul className={style.list}>
            {notificaitons.length === 0 && <li className={style.empty}>{t('empty')}</li>}
            {notificaitons?.map((notification, index) => (
              <NotificationItem
                key={index}
                data={notification}
                close={() => setIsOpen(false)}
              />
            ))}
          </ul>
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default Notifications;
