'use client'

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Box,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
}

interface ChatDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatDialog({ open, onClose }: ChatDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'システム',
      message: 'チャットが開始されました',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'あなた',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          height: fullScreen ? '100vh' : '70vh',
          maxHeight: fullScreen ? '100vh' : 600,
          m: 0,
          zIndex: 1300
        }
      }}
    >
      {/* ヘッダー */}
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'primary.main',
        color: 'white',
        py: 2
      }}>
        <Typography variant="h6">チャット</Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* メッセージリスト */}
      <DialogContent
        dividers
        sx={{
          p: 2,
          backgroundColor: 'grey.50',
          overflowY: 'auto',
          flex: 1
        }}
      >
        <List sx={{ width: '100%' }}>
          {messages.map((msg) => (
            <ListItem
              key={msg.id}
              sx={{
                flexDirection: 'column',
                alignItems: msg.sender === 'あなた' ? 'flex-end' : 'flex-start',
                mb: 1,
                p: 0
              }}
            >
              <Box
                sx={{
                  maxWidth: '75%',
                  backgroundColor: msg.sender === 'あなた' ? 'primary.main' : 'white',
                  color: msg.sender === 'あなた' ? 'white' : 'text.primary',
                  borderRadius: 2,
                  p: 1.5,
                  boxShadow: 1
                }}
              >
                <Typography variant="caption" sx={{
                  display: 'block',
                  fontWeight: 'bold',
                  mb: 0.5,
                  opacity: 0.9
                }}>
                  {msg.sender}
                </Typography>
                <Typography variant="body2">
                  {msg.message}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 0.5,
                    opacity: 0.7
                  }}
                >
                  {formatTime(msg.timestamp)}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </DialogContent>

      {/* 入力エリア */}
      <DialogActions sx={{ p: 2, backgroundColor: 'white', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="メッセージを入力..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          size="small"
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
          sx={{ minWidth: { xs: 'auto', sm: 100 } }}
        >
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>送信</Box>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
