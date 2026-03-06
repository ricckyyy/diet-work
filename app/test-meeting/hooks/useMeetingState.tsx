'use client'

import { useState, useCallback, useEffect, useRef } from 'react';

interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

function stopStreamTracks(stream: MediaStream): void {
  stream.getTracks().forEach(track => track.stop());
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
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const localStreamRef = useRef<MediaStream | null>(null);
  const isSwitchingRef = useRef(false);

  const showNotification = useCallback((message: string, severity: NotificationState['severity']) => {
    setNotification({ open: true, message, severity });
  }, []);

  // localStream の変更を ref に同期（アンマウント時クリーンアップ用）
  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

  // マウント時にカメラを起動
  useEffect(() => {
    if (!navigator.mediaDevices) {
      setCameraOn(false);
      return;
    }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'user' } } })
      .then(stream => setLocalStream(stream))
      .catch(() => setCameraOn(false));

    return () => {
      localStreamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const toggleMic = useCallback(() => {
    setMicOn(prev => {
      const newState = !prev;
      showNotification(
        newState ? 'マイクをオンにしました' : 'マイクをミュートにしました',
        'info'
      );
      return newState;
    });
  }, [showNotification]);

  const toggleCamera = useCallback(async () => {
    if (cameraOn) {
      if (localStream) {
        stopStreamTracks(localStream);
        setLocalStream(null);
      }
      setCameraOn(false);
      showNotification('カメラをオフにしました', 'info');
    } else {
      if (!navigator.mediaDevices) {
        showNotification('カメラの起動に失敗しました', 'error');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode } }
        });
        setLocalStream(stream);
        setCameraOn(true);
        showNotification('カメラをオンにしました', 'info');
      } catch {
        showNotification('カメラの起動に失敗しました', 'error');
      }
    }
  }, [cameraOn, localStream, facingMode, showNotification]);

  const switchCamera = useCallback(async () => {
    console.log('[switchCamera] called', { cameraOn, hasStream: !!localStream, facingMode, isSwitching: isSwitchingRef.current });
    if (isSwitchingRef.current) {
      console.warn('[switchCamera] already switching, ignoring');
      return;
    }
    if (!cameraOn || !localStream) {
      console.warn('[switchCamera] aborted: cameraOn=%s, hasStream=%s', cameraOn, !!localStream);
      return;
    }
    if (!navigator.mediaDevices) {
      console.error('[switchCamera] navigator.mediaDevices not available');
      showNotification('カメラの切り替えに失敗しました', 'error');
      return;
    }
    isSwitchingRef.current = true;
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    console.log('[switchCamera] switching %s -> %s', facingMode, newMode);
    try {
      console.log('[switchCamera] stopping current tracks...');
      stopStreamTracks(localStream);
      console.log('[switchCamera] tracks stopped, requesting new stream...');
      setLocalStream(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: newMode } }
      });
      console.log('[switchCamera] new stream acquired, tracks:', stream.getVideoTracks().map(t => ({ label: t.label, settings: t.getSettings() })));
      setLocalStream(stream);
      setFacingMode(newMode);
      console.log('[switchCamera] done, facingMode set to', newMode);
    } catch (err) {
      console.error('[switchCamera] failed:', err);
      showNotification('カメラの切り替えに失敗しました', 'error');
    } finally {
      isSwitchingRef.current = false;
    }
  }, [cameraOn, localStream, facingMode, showNotification]);

  const toggleChat = useCallback(() => {
    setChatOpen(prev => !prev);
  }, []);

  const toggleControls = useCallback(() => {
    // チャットが開いている時は切り替えない（誤操作防止）
    if (chatOpen) return;
    setControlsVisible(prev => !prev);
  }, [chatOpen]);

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
  }, [showNotification]);

  return {
    micOn,
    cameraOn,
    chatOpen,
    controlsVisible,
    notification,
    localStream,
    toggleMic,
    toggleCamera,
    switchCamera,
    toggleChat,
    toggleControls,
    closeNotification,
    handleLeave
  };
}
