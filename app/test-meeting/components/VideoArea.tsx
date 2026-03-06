'use client'

import { useRef, useEffect } from 'react';
import { Grid2, Box, Typography } from '@mui/material';

interface VideoAreaProps {
  cameraOn: boolean;
  localStream: MediaStream | null;
  onTap: () => void;
}

export default function VideoArea({
  cameraOn,
  localStream,
  onTap,
}: VideoAreaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log('[VideoArea] localStream changed:', localStream ? `id=${localStream.id}, tracks=${localStream.getVideoTracks().length}` : 'null');
    if (videoRef.current) {
      console.log('[VideoArea] setting srcObject on video element');
      videoRef.current.srcObject = localStream;
    } else {
      console.warn('[VideoArea] videoRef.current is null, cannot set srcObject');
    }
  }, [localStream]);

  return (
    <Grid2
      container
      onClick={onTap}
      sx={{
        width: '100%',
        height: '100vh',
        backgroundColor: 'grey.900',
        overflow: 'hidden',
        cursor: 'pointer',
        zIndex: 1000,
      }}
    >
      {/* ── 相手の映像（スマホ縦:12、スマホ横:6、PC:9） ── */}
      <Grid2
        size={cameraOn ? { xs: 12, sm: 6, md: 9 } : 12}
        sx={{
          height: { xs: cameraOn ? '50vh' : '100vh', sm: '100%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRight: { xs: 'none', sm: cameraOn ? '2px solid rgba(255,255,255,0.1)' : 'none' },
          borderBottom: { xs: cameraOn ? '2px solid rgba(255,255,255,0.1)' : 'none', sm: 'none' },
        }}
      >
        <Typography
          variant="h5"
          color="white"
          sx={{ textAlign: 'center', px: 2, fontSize: { xs: '1rem', sm: '1.5rem' } }}
        >
          相手の映像（模擬）
        </Typography>
      </Grid2>

      {/* ── 自分の映像（スマホ縦:12、スマホ横:6、PC:3）カメラON時 ── */}
      {cameraOn && (
        <Grid2
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{
            height: { xs: '50vh', sm: '100%' },
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'grey.900',
          }}
        >
          {/* 上部：自分の映像 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.800',
              aspectRatio: '16 / 9',
              width: '100%',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
          {/* 下部：空きスペース */}
          <Box sx={{ flex: 1 }} />
        </Grid2>
      )}
    </Grid2>
  );
}
