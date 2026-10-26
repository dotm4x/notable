import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Progress } from './progress.js';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Task progress',
    value: 40,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Indeterminate: Story = {
  args: {
    'aria-label': 'Loading',
    value: undefined,
  },
};

export const Values: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Progress {...args} aria-label="Quarter one" value={12} />
      <Progress {...args} aria-label="Quarter two" value={38} />
      <Progress {...args} aria-label="Quarter three" value={64} />
      <Progress {...args} aria-label="Quarter four" value={91} />
    </div>
  ),
};

export const ZeroAndComplete: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Progress {...args} aria-label="Not started" value={0} />
      <Progress {...args} aria-label="Complete" value={100} />
    </div>
  ),
};

export const CustomMaximum: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Progress {...args} aria-label="Steps completed" max={4} value={3} />
      <Progress {...args} aria-label="Files processed" max={250} value={180} />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Progress {...args} aria-label="Small" size="small" value={60} />
      <Progress {...args} aria-label="Medium" size="medium" value={60} />
      <Progress {...args} aria-label="Large" size="large" value={60} />
    </div>
  ),
};

export const CustomAppearance: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Progress
        {...args}
        aria-label="Custom thickness"
        thickness={12}
        value={55}
      />
      <Progress
        {...args}
        aria-label="Success color"
        color="success"
        trackColor="strong"
        value={75}
      />
      <Progress {...args} aria-label="Danger color" color="danger" value={30} />
      <Progress {...args} aria-label="Square corners" radius={0} value={45} />
      <Progress
        {...args}
        aria-label="Custom color"
        color="#0ea5e9"
        radius="md"
        value={80}
      />
    </div>
  ),
};

export const AnimationDisabled: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Progress
        {...args}
        animation="none"
        aria-label="Determinate without animation"
        value={70}
      />
      <Progress
        {...args}
        animation="none"
        aria-label="Indeterminate without animation"
        value={undefined}
      />
    </div>
  ),
};

type UploadExampleProps = {
  readonly fileName: string;
  readonly totalBytes: number;
};

function UploadExample({ fileName, totalBytes }: UploadExampleProps) {
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const isComplete = uploadedBytes >= totalBytes;

  useEffect(() => {
    if (isComplete) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setUploadedBytes((current) =>
        Math.min(current + totalBytes / 10, totalBytes),
      );
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [isComplete, totalBytes, uploadedBytes]);

  const percentage = Math.round((uploadedBytes / totalBytes) * 100);

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{fileName}</span>
        <span>{isComplete ? 'Uploaded' : `${percentage}%`}</span>
      </div>
      <Progress
        aria-label={`Uploading ${fileName}`}
        max={totalBytes}
        value={uploadedBytes}
      />
      <button
        type="button"
        onClick={() => setUploadedBytes(0)}
        style={{ justifySelf: 'start' }}
      >
        Restart upload
      </button>
    </div>
  );
}

export const UploadExampleStory: Story = {
  name: 'Upload example',
  render: () => (
    <UploadExample fileName="quarterly-report.pdf" totalBytes={10} />
  ),
};
