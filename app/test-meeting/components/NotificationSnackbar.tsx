'use client'

import { Snackbar, Alert } from '@mui/material';

interface NotificationSnackbarProps {
  open: boolean;
  message: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export default function NotificationSnackbar({
  open,
  message,
  severity = 'info',
  onClose
}: NotificationSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        top: 64,
        zIndex: 1200
      }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
