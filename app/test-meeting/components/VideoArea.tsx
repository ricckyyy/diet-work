'use client'

import { Box, Typography, Avatar, Fade } from '@mui/material';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

interface VideoAreaProps {
  cameraOn: boolean;
  selfUserName?: string;
  remoteUserName?: string;
  onTap: () => void;
}

/** ユーザー名バッジ（各ペインの左下に表示） */
function NameBadge({ name }: { name: string }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: { xs: 12, sm: 16 },
        left: { xs: 12, sm: 16 },
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: { xs: '4px 10px', sm: '6px 14px' },
        borderRadius: 1,
        backdropFilter: 'blur(4px)',
      }}
    >
      <Typography variant="body2" color="white" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
        {name}
      </Typography>
    </Box>
  );
}

/** カメラOFF時のアバター表示 */
function CameraOffPlaceholder({ userName }: { userName: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Avatar
        sx={{
          width: { xs: 56, sm: 96 },
          height: { xs: 56, sm: 96 },
          backgroundColor: 'grey.700',
          fontSize: { xs: 24, sm: 40 },
        }}
      >
        {userName.charAt(0).toUpperCase()}
      </Avatar>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <VideocamOffIcon sx={{ color: 'grey.500', fontSize: { xs: 16, sm: 20 } }} />
        <Typography variant="body2" color="grey.400">
          カメラはオフです
        </Typography>
      </Box>
    </Box>
  );
}

export default function VideoArea({
  cameraOn,
  selfUserName = '自分',
  remoteUserName = '相手',
  onTap,
}: VideoAreaProps) {
  return (
    <Box
      onClick={onTap}
      sx={{
        width: '100%',
        height: '100vh',
        backgroundColor: 'grey.900',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        cursor: 'pointer',
        zIndex: 1000,
      }}
    >
      {/* ── 相手の映像（左・大） ── */}
      <Box
        sx={{
          flex: cameraOn ? 3 : 1,
          transition: 'flex 0.3s ease-in-out',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRight: cameraOn ? '2px solid rgba(255,255,255,0.1)' : 'none',
        }}
      >
        <Typography
          variant="h5"
          color="white"
          sx={{ textAlign: 'center', px: 2, fontSize: { xs: '1rem', sm: '1.5rem' } }}
        >
          相手の映像（模擬）
        </Typography>
        <NameBadge name={remoteUserName} />
      </Box>

      {/* ── 自分の映像（右）カメラON時 ── */}
      <Fade in={cameraOn} timeout={300} unmountOnExit>
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          }}
        >
          <Typography
            variant="body1"
            color="white"
            sx={{ textAlign: 'center', px: 1, fontSize: { xs: '0.75rem', sm: '1rem' } }}
          >
            自分の映像（模擬）
          </Typography>
          <NameBadge name={selfUserName} />
        </Box>
      </Fade>

      {/* ── 自分の映像（右）カメラOFF時 ── */}
      {!cameraOn && (
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey.800',
          }}
        >
          <CameraOffPlaceholder userName={selfUserName} />
          <NameBadge name={selfUserName} />
        </Box>
      )}
    </Box>
  );
}
