import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import VideoArea from '../app/test-meeting/components/VideoArea';

const meta: Meta<typeof VideoArea> = {
  title: 'TestMeeting/VideoArea',
  component: VideoArea,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '会議室のビデオエリア。`localStream=null` のときはモックデザイン（グラデーション＋アイコン）を表示。`facingMode` でフロント/リアのデザインが切り替わる。',
      },
    },
  },
  args: {
    cameraOn: true,
    localStream: null,
    onTap: () => {},
    onFlipCamera: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof VideoArea>;

// ── リアカメラ（mock）──────────────────────────────────
export const リアカメラMock: Story = {
  name: 'リアカメラ（mock）',
  args: {
    facingMode: 'environment',
    cameraLabel: 'リアカメラ',
  },
};

// ── フロントカメラ（mock）──────────────────────────────
export const フロントカメラMock: Story = {
  name: 'フロントカメラ（mock）',
  args: {
    facingMode: 'user',
    cameraLabel: 'フロントカメラ',
  },
};

// ── カメラ OFF ─────────────────────────────────────────
export const カメラOFF: Story = {
  name: 'カメラ OFF',
  args: {
    cameraOn: false,
    facingMode: 'environment',
  },
};

// ── インタラクティブ（フリップで切り替え確認）────────
export const フリップ切り替えデモ: Story = {
  name: 'フリップ切り替えデモ',
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [facing, setFacing] = useState<'user' | 'environment'>('environment');
    return (
      <VideoArea
        {...args}
        facingMode={facing}
        cameraLabel={facing === 'user' ? 'フロントカメラ' : 'リアカメラ'}
        onFlipCamera={() =>
          setFacing((prev) => (prev === 'user' ? 'environment' : 'user'))
        }
      />
    );
  },
};
