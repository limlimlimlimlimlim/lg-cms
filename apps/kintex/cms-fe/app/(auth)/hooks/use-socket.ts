'use client';

import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';

const useSocket = () => {
  const [socket, setSocket] = useState<any>();

  useEffect(() => {
    const socketIO = io(
      `${window.location.protocol}//${window.location.hostname}:4001`,
    );

    socketIO.on('connect', () => {
      console.log('Connected to server');
    });

    // socketIO.on('sync', (data) => {
    //   console.log('Received message from server:', data);
    // });

    setSocket(socketIO);

    return () => {
      socketIO.disconnect();
    };
  }, []);

  const emit = useCallback(
    (event, message) => {
      socket.emit(event, message);
    },
    [socket],
  );

  const on = useCallback(
    (event, callback) => {
      socket.on(event, callback);
    },
    [socket],
  );

  return {
    emit,
    on,
  };
};

export default useSocket;