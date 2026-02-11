'use client';

import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material';

interface NormalDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function NormalDialog({ open, onClose }: NormalDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>通常のDialog（コンポーネント版）</DialogTitle>
      <DialogContent>
        これはページ全体に表示される通常のDialogです（コンポーネント化）
      </DialogContent>
      <Button onClick={onClose}>閉じる</Button>
    </Dialog>
  );
}
