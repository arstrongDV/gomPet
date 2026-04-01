'use client';

import React, { useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

import { CloseButton, Icon, Pill } from 'components';
import useWebsocket from 'components/hooks/useWebsocket';

import style from './Notifications.module.scss';
import NotificationItem from './components/NotificationItem';
import { WebsocketRoutes } from 'src/api/routes';

export type Notification = {
  id: number;
  seen: boolean;
  created_at: string;
  type: string;
  data: any;
};

const Notifications = () => {
  const t = useTranslations('notifications');
  const { data: session } = useSession();

  const userId = Number(session?.user?.id);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [ isReady, val, send ] = useWebsocket(WebsocketRoutes.GET_NOTIFICATIONS(userId));

  /** handle incoming message */
  useEffect(() => {
    if (!val) return;

    try{
      const parsed = JSON.parse(val);
      const notification: Notification = {
        id: Date.now(),
        seen: false,
        created_at: new Date().toISOString(),
        type: parsed.type ?? 'generic',
        data: parsed,
      };

      setNotifications((prev) => [notification, ...prev]);
    }catch(e){
      console.error('WS parse error', e);
    }

  }, [val]);

  // useEffect(() => {
  //   if (isReady && send) {
      
  //     const subscriptionMessage = {
  //       action: 'subscribe_instance',
  //       pk: userId,
  //       request_id: Date.now()
  //     };
      
  //     send(JSON.stringify(subscriptionMessage));
  //   }
  // }, [isReady, send, userId]); 
  // useEffect(() => {
  //   if (isReady) {
  //     send(
  //       JSON.stringify({
  //         action: 'subscribe_instance',
  //         pk: 1,
  //         request_id: 1
  //       })
  //     );
  //   }
  // }, [isReady, send]);

  if (!userId) return null;

  return (
    <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
      <div className={style.container}>
        <button
          className={style.button}
          onClick={() => setIsOpen((p) => !p)}
        >
          <Icon
            name={isOpen ? 'bellFilled' : 'bell'}
            className={classNames(style.icon, {
              [style.active]: isOpen,
            })}
          />

          {notifications.some((n) => !n.seen) && (
            <Pill className={style.counter}>
              {notifications.filter((n) => !n.seen).length}
            </Pill>
          )}
        </button>

        <div
          className={classNames(style.notifications, {
            [style.open]: isOpen,
          })}
        >
          <div className={style.header}>
            <h4>{t('title')}</h4>
            <CloseButton isOpen={isOpen} onClick={() => setIsOpen(false)} />
          </div>

          <ul className={style.list}>
            {notifications.length === 0 && <li className={style.empty}>{t('empty')}</li>}
            {notifications?.map((notification, index) => (
              <NotificationItem
                key={index}
                data={notification.data}
                close={() => setIsOpen(false)}
              />
            ))}
          </ul>


        {/* {notifications.length === 0 ? (
          <p>{t('empty')}</p>
         ): (
          <ul>
            {notifications.map((msg) => (
              <NotificationItem
                key={msg.id}
                data={msg}
                close={() => setIsOpen(false)}
              />
            ))}
          </ul>
         )} */}

        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default Notifications;
