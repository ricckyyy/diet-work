'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3b82f6', // 既存プロジェクトのblue-600
      light: '#60a5fa',
      dark: '#2563eb'
    },
    secondary: {
      main: '#8b5cf6', // purple-500
      light: '#a78bfa',
      dark: '#7c3aed'
    },
    error: {
      main: '#ef4444', // red-500
      light: '#f87171',
      dark: '#dc2626'
    },
    success: {
      main: '#10b981', // green-500
      light: '#34d399',
      dark: '#059669'
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    }
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    h6: {
      fontWeight: 700
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // 大文字変換を無効化
          borderRadius: 8
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    }
  }
});
