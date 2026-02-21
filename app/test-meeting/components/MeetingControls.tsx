'use client'

import { AppBar, Toolbar, IconButton, Button, Tooltip, Slide } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ChatIcon from '@mui/icons-material/Chat';
import CallEndIcon from '@mui/icons-material/CallEnd';

interface MeetingControlsProps {
  visible: boolean;
  micOn: boolean;
  cameraOn: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleChat: () => void;
  onLeave: () => void;
}

export default function MeetingControls({
  visible,
  micOn,
  cameraOn,
  onToggleMic,
  onToggleCamera,
  onToggleChat,
  onLeave
}: MeetingControlsProps) {
  return (
    <Slide direction="down" in={visible} mountOnEnter unmountOnExit>
      <AppBar
        position="fixed"
        sx={{
          top: 0,
          backgroundColor: 'rgba(30, 30, 30, 0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 1100
        }}
      >
        <Toolbar sx={{
          justifyContent: 'center',
          gap: { xs: 1, sm: 2, md: 3 },
          minHeight: { xs: 64, sm: 72 },
          px: { xs: 1, sm: 2 }
        }}>

          {/* マイクコントロール */}
          <Tooltip title={micOn ? "マイクをミュート" : "マイクをオン"}>
            <IconButton
              color="inherit"
              onClick={onToggleMic}
              sx={{
                width: { xs: 44, sm: 52, md: 56 },
                height: { xs: 44, sm: 52, md: 56 },
                backgroundColor: micOn ? 'primary.main' : 'grey.700',
                '&:hover': {
                  backgroundColor: micOn ? 'primary.dark' : 'grey.600'
                }
              }}
            >
              {micOn ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
          </Tooltip>

          {/* カメラコントロール */}
          <Tooltip title={cameraOn ? "カメラをオフ" : "カメラをオン"}>
            <IconButton
              color="inherit"
              onClick={onToggleCamera}
              sx={{
                width: { xs: 44, sm: 52, md: 56 },
                height: { xs: 44, sm: 52, md: 56 },
                backgroundColor: cameraOn ? 'primary.main' : 'grey.700',
                '&:hover': {
                  backgroundColor: cameraOn ? 'primary.dark' : 'grey.600'
                }
              }}
            >
              {cameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
          </Tooltip>

          {/* チャットコントロール */}
          <Tooltip title="チャットを開く">
            <IconButton
              color="inherit"
              onClick={onToggleChat}
              sx={{
                width: { xs: 44, sm: 52, md: 56 },
                height: { xs: 44, sm: 52, md: 56 },
                backgroundColor: 'grey.700',
                '&:hover': { backgroundColor: 'grey.600' }
              }}
            >
              <ChatIcon />
            </IconButton>
          </Tooltip>

          {/* 退出ボタン（デスクトップ） */}
          <Button
            variant="contained"
            color="error"
            startIcon={<CallEndIcon />}
            onClick={onLeave}
            sx={{
              ml: { xs: 1, md: 3 },
              display: { xs: 'none', sm: 'flex' },
              px: { sm: 2, md: 3 }
            }}
          >
            退出
          </Button>

          {/* 退出ボタン（モバイル） */}
          <IconButton
            color="error"
            onClick={onLeave}
            sx={{
              display: { xs: 'flex', sm: 'none' },
              width: 44,
              height: 44,
              backgroundColor: 'error.main',
              '&:hover': { backgroundColor: 'error.dark' }
            }}
          >
            <CallEndIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Slide>
  );
}
