'use client'

import { Grid2, Box, Typography } from '@mui/material';

interface VideoAreaProps {
  cameraOn: boolean;
  onTap: () => void;
}

export default function VideoArea({
  cameraOn,
  onTap,
}: VideoAreaProps) {
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
      {/* ── 相手の映像（スマホ:全幅、PC:9列） ── */}
      <Grid2
        size={cameraOn ? { xs: 12, sm: 9 } : 12}
        sx={{
          height: { xs: cameraOn ? '70vh' : '100vh', sm: '100%' },
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

      {/* ── 自分の映像（スマホ:全幅・下、PC:3列・右上）カメラON時 ── */}
      {cameraOn && (
        <Grid2
          size={{ xs: 12, sm: 3 }}
          sx={{
            height: { xs: '30vh', sm: '100%' },
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
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              aspectRatio: '16 / 9',
              width: '100%',
            }}
          >
            <Typography
              variant="body1"
              color="white"
              sx={{ textAlign: 'center', px: 1, fontSize: { xs: '0.75rem', sm: '1rem' } }}
            >
              自分の映像（模擬）
            </Typography>
          </Box>
          {/* 下部：空きスペース */}
          <Box sx={{ flex: 1 }} />
        </Grid2>
      )}
    </Grid2>
  );
}
