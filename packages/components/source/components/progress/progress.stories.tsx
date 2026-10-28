import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Progress, type ProgressProps } from './progress.js';

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
} satisfies Meta<ProgressProps>;

export default meta;

type Story = StoryObj<ProgressProps>;

export const Default: Story = {};

export const Indeterminate: Story = {
  args: {
    'aria-label': 'Loading',
    value: undefined,
  },
};

export const Values: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Progress aria-label="Quarter one" value={12} />
      <Progress aria-label="Quarter two" value={38} />
      <Progress aria-label="Quarter three" value={64} />
      <Progress aria-label="Quarter four" value={91} />
    </div>
  ),
};

export const ZeroAndComplete: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Progress aria-label="Not started" value={0} />
      <Progress aria-label="Complete" value={100} />
    </div>
  ),
};

export const CustomMaximum: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Progress aria-label="Steps completed" max={4} value={3} />
      <Progress aria-label="Files processed" max={250} value={180} />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Progress aria-label="Small" size="small" value={60} />
      <Progress aria-label="Medium" size="medium" value={60} />
      <Progress aria-label="Large" size="large" value={60} />
    </div>
  ),
};

export const CustomAppearance: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Progress aria-label="Custom thickness" thickness={12} value={55} />
      <Progress
        aria-label="Success color"
        color="success"
        trackColor="strong"
        value={75}
      />
      <Progress aria-label="Danger color" color="danger" value={30} />
      <Progress aria-label="Square corners" radius={0} value={45} />
      <Progress
        aria-label="Custom color"
        color="#0ea5e9"
        radius="md"
        value={80}
      />
    </div>
  ),
};

export const AnimationDisabled: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Progress
        animation="none"
        aria-label="Determinate without animation"
        value={70}
      />
      <Progress
        animation="none"
        aria-label="Indeterminate without animation"
        value={undefined}
      />
    </div>
  ),
};

export const Circular: Story = {
  args: {
    'aria-label': 'Task progress',
    variant: 'circular',
    value: 65,
  },
};

export const CircularIndeterminate: Story = {
  args: {
    'aria-label': 'Loading',
    variant: 'circular',
    value: undefined,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Progress aria-label="Linear progress" value={65} />
      <Progress aria-label="Circular progress" variant="circular" value={65} />
    </div>
  ),
};

export const CircularValues: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 24,
      }}
    >
      <Progress aria-label="Not started" variant="circular" value={0} />
      <Progress aria-label="Quarter complete" variant="circular" value={25} />
      <Progress aria-label="Half complete" variant="circular" value={50} />
      <Progress
        aria-label="Three quarters complete"
        variant="circular"
        value={75}
      />
      <Progress aria-label="Complete" variant="circular" value={100} />
    </div>
  ),
};

export const CircularSizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 24,
      }}
    >
      <Progress
        aria-label="Small ring"
        size="small"
        value={60}
        variant="circular"
      />
      <Progress
        aria-label="Medium ring"
        size="medium"
        value={60}
        variant="circular"
      />
      <Progress
        aria-label="Large ring"
        size="large"
        value={60}
        variant="circular"
      />
      <Progress
        aria-label="48 pixel ring"
        size={48}
        thickness={6}
        value={60}
        variant="circular"
      />
    </div>
  ),
};

export const CircularAppearance: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 24,
      }}
    >
      <Progress
        aria-label="Thick ring"
        size={64}
        thickness={10}
        value={55}
        variant="circular"
      />
      <Progress
        aria-label="Success ring"
        color="success"
        trackColor="strong"
        value={75}
        variant="circular"
      />
      <Progress
        aria-label="Danger ring"
        color="danger"
        value={30}
        variant="circular"
      />
      <Progress
        aria-label="Custom color ring"
        color="#0ea5e9"
        value={80}
        variant="circular"
      />
    </div>
  ),
};

export const CircularAnimationDisabled: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Progress
        animation="none"
        aria-label="Determinate ring without animation"
        value={70}
        variant="circular"
      />
      <Progress
        animation="none"
        aria-label="Indeterminate ring without animation"
        value={undefined}
        variant="circular"
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div aria-hidden="true">
            <Progress
              max={totalBytes}
              size="small"
              value={uploadedBytes}
              variant="circular"
            />
          </div>
          <span>{fileName}</span>
        </div>
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
