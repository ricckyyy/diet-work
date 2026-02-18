'use client'

import { useState, useCallback } from 'react';

interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export function useMeetingState() {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'info'
  });

  const toggleMic = useCallback(() => {
    setMicOn(prev => {
      const newState = !prev;
      showNotification(
        newState ? 'マイクをオンにしました' : 'マイクをミュートにしました',
        'info'
      );
      return newState;
    });
  }, []);

  const toggleCamera = useCallback(() => {
    setCameraOn(prev => {
      const newState = !prev;
      showNotification(
        newState ? 'カメラをオンにしました' : 'カメラをオフにしました',
        'info'
      );
      return newState;
    });
  }, []);

  const toggleChat = useCallback(() => {
    setChatOpen(prev => !prev);
  }, []);

  const toggleControls = useCallback(() => {
    // チャットが開いている時は切り替えない（誤操作防止）
    if (chatOpen) return;
    setControlsVisible(prev => !prev);
  }, [chatOpen]);

  const showNotification = useCallback((message: string, severity: NotificationState['severity']) => {
    setNotification({ open: true, message, severity });
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  const handleLeave = useCallback(() => {
    if (window.confirm('会議室を退出しますか?')) {
      showNotification('会議室から退出しました', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  }, []);

  return {
    micOn,
    cameraOn,
    chatOpen,
    controlsVisible,
    notification,
    toggleMic,
    toggleCamera,
    toggleChat,
    toggleControls,
    closeNotification,
    handleLeave
  };
}
