'use client'

import { useMeetingState } from './hooks/useMeetingState';
import MeetingControls from './components/MeetingControls';
import ChatDialog from './components/ChatDialog';
import VideoArea from './components/VideoArea';
import NotificationSnackbar from './components/NotificationSnackbar';
import { Box } from '@mui/material';

export default function TestMeetingPage() {
  const {
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
  } = useMeetingState();

  return (
    <Box sx={{
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* ビデオエリア */}
      <VideoArea
        cameraOn={cameraOn}
        onTap={toggleControls}
      />

      {/* コントロールバー */}
      <MeetingControls
        visible={controlsVisible}
        micOn={micOn}
        cameraOn={cameraOn}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onToggleChat={toggleChat}
        onLeave={handleLeave}
      />

      {/* チャットダイアログ */}
      <ChatDialog open={chatOpen} onClose={toggleChat} />

      {/* 通知Snackbar */}
      <NotificationSnackbar
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={closeNotification}
      />
    </Box>
  );
}
