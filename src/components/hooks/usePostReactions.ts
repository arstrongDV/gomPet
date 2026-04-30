'use client';

import { useEffect, useState } from "react";
import useWebsocket from "./useWebsocket";
import { WebsocketRoutes } from "src/api/routes";

interface usePostReactionsProps {
    type: string;
    id: number;
}

const usePostReactions = ({ type, id }: usePostReactionsProps) => {
  const [reactions, setReactions] = useState<number>(0);

  const [ready, val, send] = useWebsocket(WebsocketRoutes.GET_REACTIONS_LIST(type, id));

  useEffect(() => {
    if (!val) return;
    try {
      const parsed = typeof val === 'string' ? JSON.parse(val) : val;
      if (parsed?.total_likes !== undefined) setReactions(parsed.total_likes);
    } catch (error) {
      console.error('WS parse error:', error);
    }
  }, [val]);

  useEffect(() => {
    if (ready && send) {
      send(JSON.stringify({ action: 'subscribe_instance', pk: id, request_id: Date.now() }));
    }
  }, [ready, send, id]);

  return {
    reactions
  }
}

export default usePostReactions;