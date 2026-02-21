'use client'

import { Grid2, Box, Typography, IconButton } from '@mui/material';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import PersonIcon from '@mui/icons-material/Person';
import LandscapeIcon from '@mui/icons-material/Landscape';
import { useEffect, useRef } from 'react';

interface VideoAreaProps {
  cameraOn: boolean;
  onTap: () => void;
  cameraLabel?: string;
  onFlipCamera?: () => void;
  localStream?: MediaStream | null;
  facingMode?: 'user' | 'environment';
}

export default function VideoArea({
  cameraOn,
  onTap,
  cameraLabel = 'Camera',
  onFlipCamera,
  localStream,
  facingMode = 'environment',
}: VideoAreaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // stream が変わるたびに video 要素にセット
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = localStream ?? null;
    }
  }, [localStream]);

  // フロント/リアでデザインを切り替え
  const isFront = facingMode === 'user';
  const mockGradient = isFront
    ? 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)' // フロント: 青緑系
    : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'; // リア: ピンク系
  const MockIcon = isFront ? PersonIcon : LandscapeIcon;
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
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: mockGradient,
              aspectRatio: '16 / 9',
              width: '100%',
              overflow: 'hidden',
              transition: 'background 0.4s ease',
            }}
          >
            {/* 実映像（フロントはミラー反転） */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: localStream ? 'block' : 'none',
                transform: isFront ? 'scaleX(-1)' : 'none',
              }}
            />
            {/* stream なし時: アイコン + ラベル */}
            {!localStream && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, position: 'relative', zIndex: 1 }}>
                <MockIcon sx={{ color: 'rgba(255,255,255,0.8)', fontSize: { xs: 28, sm: 40 } }} />
                <Typography
                  variant="body1"
                  color="white"
                  sx={{ textAlign: 'center', px: 1, fontSize: { xs: '0.75rem', sm: '1rem' } }}
                >
                  {cameraLabel}
                </Typography>
              </Box>
            )}
            {/* フリップボタン（右上オーバーレイ） */}
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onFlipCamera?.();
              }}
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.35)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.55)' },
                padding: '4px',
                zIndex: 2,
              }}
              size="small"
              aria-label="カメラを切り替える"
            >
              <CameraswitchIcon fontSize="small" />
            </IconButton>
          </Box>
          {/* 下部：空きスペース */}
          <Box sx={{ flex: 1 }} />
        </Grid2>
      )}
    </Grid2>
  );
}
