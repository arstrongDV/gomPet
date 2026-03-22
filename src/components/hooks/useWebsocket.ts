'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';

const BASE_URL = 'ws://localhost';
const DEFAULT_SOCKET_URL =
  "ws://localhost/ws/notifications/3/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY3NDA1NTc3LCJpYXQiOjE3NjczNjIzNzcsImp0aSI6IjYwMThjNTViMWRkMjQwNzk4MjRhNTE4ZTU0ODU4MGZlIiwidXNlcl9pZCI6IjMifQ.lEx1X-uG0915o-_YdBPdccE65Va3-PppJRfE28H6LZ0";


const useWebsocket = (path: string) => {
  const session = useSession();
  const [isReady, setIsReady] = useState(false);
  const [val, setVal] = useState(null);

  const token = session.data?.access_token;

  const ws = useRef<any>(null);

  useEffect(() => {
    if (!token) return;

    if (ws.current) {
      ws.current.close();
    }
  
    const socket = new WebSocket(`${BASE_URL}${path}?token=${token}`);

    ws.current = socket;

    socket.onopen = () => {
      setIsReady(true);
      console.log("POlaczono")
    }
    socket.onclose = () => {
      setIsReady(false);
      console.log("Zamknięto");
    }
    socket.onmessage = (event) => {
      setVal(event.data);
      console.log("Msg:", event.data);
    }

    // ws.current = socket;

    return () => {
      socket.close();
    };
  }, [session.data?.access_token]);

  return [isReady, val, ws.current?.send.bind(ws.current)];
  // return { val };
};

export default useWebsocket;