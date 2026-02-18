'use client'

import { useMeetingState } from '../test-meeting/hooks/useMeetingState';
import MeetingControls from './components/MeetingControls';
import ChatDialog from '../test-meeting/components/ChatDialog';
import VideoArea from './components/VideoArea';
import NotificationSnackbar from '../test-meeting/components/NotificationSnackbar';
import { Box } from '@mui/material';

export default function TestMeetingResizePage() {
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
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* コントロールバー（通常フローで上部に配置） */}
      <MeetingControls
        visible={controlsVisible}
        micOn={micOn}
        cameraOn={cameraOn}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onToggleChat={toggleChat}
        onLeave={handleLeave}
      />

      {/* ビデオエリア（残りのスペースを占有） */}
      <VideoArea
        cameraOn={cameraOn}
        userName="テストユーザー"
        controlsVisible={controlsVisible}
        onTap={toggleControls}
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
