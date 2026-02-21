'use client'

import { Box, Typography, Avatar } from '@mui/material';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

const CONTROLS_HEIGHT = 72;

interface VideoAreaProps {
  cameraOn: boolean;
  userName?: string;
  controlsVisible: boolean;
  onTap: () => void;
}

export default function VideoArea({ cameraOn, userName = "ゲスト", controlsVisible, onTap }: VideoAreaProps) {
  return (
    <Box
      onClick={onTap}
      sx={{
        width: '100%',
        height: controlsVisible ? `calc(100vh - ${CONTROLS_HEIGHT}px)` : '100vh',
        transition: 'height 0.3s ease-in-out',
        backgroundColor: 'grey.900',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {cameraOn ? (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="h4" color="white" sx={{ textAlign: 'center', px: 2 }}>
            カメラ ON (模擬表示)
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Avatar
            sx={{
              width: { xs: 80, sm: 120 },
              height: { xs: 80, sm: 120 },
              backgroundColor: 'grey.700',
              fontSize: { xs: 32, sm: 48 }
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VideocamOffIcon sx={{ color: 'grey.500' }} />
            <Typography variant="h6" color="grey.400">
              カメラはオフです
            </Typography>
          </Box>
        </Box>
      )}

      {/* ユーザー名表示（左下） */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 16, sm: 24 },
          left: { xs: 16, sm: 24 },
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          padding: { xs: '6px 12px', sm: '8px 16px' },
          borderRadius: 1,
          backdropFilter: 'blur(4px)'
        }}
      >
        <Typography variant="body2" color="white">
          {userName}
        </Typography>
      </Box>
    </Box>
  );
}
