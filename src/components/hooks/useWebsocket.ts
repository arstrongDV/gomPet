'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';

const BASE_URL = 'ws://localhost';

const useWebsocket = (path: string) => {
  const session = useSession();
  const [isReady, setIsReady] = useState(false);
  const [val, setVal] = useState(null);

  const ws = useRef<any>(null);

  useEffect(() => {
    const socket = new WebSocket(`${BASE_URL}${path}?token=${session.data?.access_token}`);

    socket.onopen = () => setIsReady(true);
    socket.onclose = () => setIsReady(false);
    socket.onmessage = (event) => setVal(event.data);

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, [path, session.data?.access_token]);

  return [isReady, val, ws.current?.send.bind(ws.current)];
};

export default useWebsocket;
