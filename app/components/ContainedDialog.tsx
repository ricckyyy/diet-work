'use client';

import { RefObject } from 'react';
import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material';

interface ContainedDialogProps {
  open: boolean;
  onClose: () => void;
  containerRef: RefObject<HTMLDivElement | null>;
}

export default function ContainedDialog({ open, onClose, containerRef }: ContainedDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      container={() => containerRef.current}
      disablePortal
      sx={{
        position: 'absolute',
      }}
    >
      <DialogTitle>Box内のDialog（コンポーネント版）</DialogTitle>
      <DialogContent>
        このDialogはコンポーネント化されています！
        <br />
        <br />
        containerRefをpropsとして受け取り、正しく動作しています。
      </DialogContent>
      <Button onClick={onClose}>閉じる</Button>
    </Dialog>
  );
}
