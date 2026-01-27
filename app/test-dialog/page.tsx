'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Button } from '@mui/material';
import Link from 'next/link';
import NormalDialog from '../components/NormalDialog';
import ContainedDialog from '../components/ContainedDialog';

export default function TestDialogPage() {
  const [open, setOpen] = useState(false);
  const [openBox, setOpenBox] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // コンポーネント版の状態
  const [openComponent, setOpenComponent] = useState(false);
  const [openBoxComponent, setOpenBoxComponent] = useState(false);
  const containerRefComponent = useRef<HTMLDivElement>(null);

  return (
    <Box sx={{ p: 5 }}>
      <h1 style={{ marginBottom: '20px' }}>Dialog in Box テスト</h1>
      <p style={{ marginBottom: '20px' }}>
        青い枠の中だけにDialogが表示されるかテストします
      </p>
      
      {/* 通常のDialog（ページ全体） */}
      <div style={{ marginBottom: '40px' }}>
        <h2>通常のDialog（インライン版）</h2>
        <Button variant="contained" onClick={() => setOpen(true)}>
          通常のDialogを開く
        </Button>
        
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
        >
          <DialogTitle>通常のDialog</DialogTitle>
          <DialogContent>
            これはページ全体に表示される通常のDialogです
          </DialogContent>
          <Button onClick={() => setOpen(false)}>閉じる</Button>
        </Dialog>
      </div>

      {/* Box内のDialog */}
      <div style={{ marginBottom: '40px' }}>
        <h2>Box内に制限されたDialog（インライン版）</h2>
        <Box 
          ref={containerRef} 
          sx={{ 
            position: 'relative', 
            width: '600px', 
            height: '400px', 
            border: '3px solid blue', 
            overflow: 'hidden',
            backgroundColor: '#f5f5f5',
            padding: 2
          }}
        >
          <Button variant="contained" color="secondary" onClick={() => setOpenBox(true)}>
            Box内Dialogを開く
          </Button>
          
          <p style={{ marginTop: '10px', color: '#666' }}>
            この青い枠の中だけにDialogが表示されるはずです
          </p>
          
          <Dialog
            open={openBox}
            onClose={() => setOpenBox(false)}
            container={() => containerRef.current}
            disablePortal
            sx={{
              position: 'absolute',
            }}
          >
            <DialogTitle>Box内のDialog</DialogTitle>
            <DialogContent>
              このDialogは青い枠内だけに表示されています！
              <br />
              <br />
              disablePortal と container プロップを使用しています。
            </DialogContent>
            <Button onClick={() => setOpenBox(false)}>閉じる</Button>
          </Dialog>
        </Box>
      </div>

      {/* コンポーネント化バージョン */}
      <div style={{ marginBottom: '40px', borderTop: '2px solid #ccc', paddingTop: '40px' }}>
        <h2 style={{ color: '#2e7d32' }}>コンポーネント化バージョン</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Dialogをコンポーネントに分離しても正しく動作することを確認
        </p>
        
        {/* コンポーネント版：通常のDialog */}
        <div style={{ marginBottom: '30px' }}>
          <h3>通常のDialog（コンポーネント版）</h3>
          <Button variant="contained" onClick={() => setOpenComponent(true)}>
            コンポーネント版Dialogを開く
          </Button>
          
          <NormalDialog 
            open={openComponent}
            onClose={() => setOpenComponent(false)}
          />
        </div>

        {/* コンポーネント版：Box内のDialog */}
        <div>
          <h3>Box内に制限されたDialog（コンポーネント版）</h3>
          <Box 
            ref={containerRefComponent} 
            sx={{ 
              position: 'relative', 
              width: '600px', 
              height: '400px', 
              border: '3px solid green', 
              overflow: 'hidden',
              backgroundColor: '#e8f5e9',
              padding: 2
            }}
          >
            <Button variant="contained" color="success" onClick={() => setOpenBoxComponent(true)}>
              コンポーネント版Box内Dialogを開く
            </Button>
            
            <p style={{ marginTop: '10px', color: '#2e7d32' }}>
              この緑の枠の中だけにコンポーネント版Dialogが表示されるはずです
            </p>
            
            <ContainedDialog
              open={openBoxComponent}
              onClose={() => setOpenBoxComponent(false)}
              containerRef={containerRefComponent}
            />
          </Box>
        </div>
      </div>

      <Box sx={{ mt: 5 }}>
        <Link href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
          ← トップページに戻る
        </Link>
      </Box>
    </Box>
  );
}
