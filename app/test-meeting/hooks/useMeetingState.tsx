'use client'

import { useState, useCallback, useEffect, useRef } from 'react';
import { MediaMock, devices } from '@eatsjobs/media-mock';

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
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const currentStreamRef = useRef<MediaStream | null>(null);

  // facingMode でカメラストリームを開始（deviceId より確実）
  const startCamera = useCallback(async (facing: 'user' | 'environment' = 'environment') => {
    currentStreamRef.current?.getTracks().forEach((t) => t.stop());
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facing } },
      });
      currentStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (e) {
      console.warn('[startCamera] facingMode failed, retrying without constraint:', e);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        currentStreamRef.current = stream;
        setLocalStream(stream);
        return stream;
      } catch (e2) {
        console.error('[startCamera] failed completely:', e2);
        setLocalStream(null);
        return null;
      }
    }
  }, []);

  // 実機スマホは UA で判定して mock をスキップ。
  // enumerateDevices() は権限未付与時にデバイス数を正しく返さないブラウザがあるため UA を使用。
  useEffect(() => {
    const isRealMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const init = async () => {
      let inputs: MediaDeviceInfo[] = [];

      if (isRealMobile) {
        // 権限付与後にラベルが取得できるよう getUserMedia を先に呼ぶ
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((t) => t.stop());
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        inputs = deviceList.filter((d) => d.kind === 'videoinput');
        console.log('[Camera devices]', inputs.map((d, i) => `${i}: ${d.label} / ${d.deviceId}`));
      } else {
        // PC → iPhone 12 を模倣して front/rear カメラを追加
        MediaMock.mock(devices['iPhone 12']);
        const mockedList = await navigator.mediaDevices.enumerateDevices();
        inputs = mockedList.filter((d) => d.kind === 'videoinput');
      }

      setVideoDevices(inputs);
      // 背面カメラから起動
      await startCamera('environment');
    };

    init();

    // アンマウント時にストリーム停止
    return () => {
      currentStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [startCamera]);

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
      if (newState) {
        startCamera(facingMode);
        showNotification('カメラをオンにしました', 'info');
      } else {
        currentStreamRef.current?.getTracks().forEach((t) => t.stop());
        setLocalStream(null);
        showNotification('カメラをオフにしました', 'info');
      }
      return newState;
    });
  }, [facingMode, startCamera]);

  const toggleChat = useCallback(() => {
    setChatOpen(prev => !prev);
  }, []);

  const toggleControls = useCallback(() => {
    // チャットが開いている時は切り替えない（誤操作防止）
    if (chatOpen) return;
    setControlsVisible(prev => !prev);
  }, [chatOpen]);

  const handleFlipCamera = useCallback(() => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    setCurrentCameraIndex((prev) =>
      videoDevices.length > 1 ? (prev + 1) % videoDevices.length : prev
    );
    startCamera(nextFacing);
    showNotification(
      nextFacing === 'user' ? 'フロントカメラに切り替えました' : 'リアカメラに切り替えました',
      'info'
    );
  }, [facingMode, videoDevices, startCamera]);

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

  // label は権限未付与時に空文字になるため || でフォールバック
  const cameraLabel = facingMode === 'user' ? 'フロントカメラ' : 'リアカメラ';

  return {
    micOn,
    cameraOn,
    chatOpen,
    controlsVisible,
    notification,
    cameraLabel,
    facingMode,
    videoDevices,
    currentCameraIndex,
    localStream,
    toggleMic,
    toggleCamera,
    toggleChat,
    toggleControls,
    closeNotification,
    handleLeave,
    handleFlipCamera,
  };
}
