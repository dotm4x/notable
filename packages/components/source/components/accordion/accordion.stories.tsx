import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Accordion } from './accordion.js';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: {
    type: 'single',
    children: (
      <Accordion.Item value="shipping" title="Shipping">
        Orders ship within two business days.
      </Accordion.Item>
    ),
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Accordion type="single">
      <Accordion.Item value="shipping" title="Shipping">
        Orders ship within two business days and include tracking details.
      </Accordion.Item>
      <Accordion.Item value="returns" title="Returns">
        Unused items can be returned within thirty days of delivery.
      </Accordion.Item>
      <Accordion.Item value="warranty" title="Warranty">
        Every product is covered against manufacturing defects for one year.
      </Accordion.Item>
    </Accordion>
  ),
};

export const Single: Story = {
  render: () => (
    <Accordion type="single">
      <Accordion.Item value="general" title="General">
        Opening a new section closes the one that is currently expanded.
      </Accordion.Item>
      <Accordion.Item value="privacy" title="Privacy">
        Activating the expanded section again collapses it.
      </Accordion.Item>
      <Accordion.Item value="advanced" title="Advanced">
        Only one section is expanded at a time in single mode.
      </Accordion.Item>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple">
      <Accordion.Item value="notifications" title="Notifications">
        Choose how and when you receive updates about your workspace.
      </Accordion.Item>
      <Accordion.Item value="security" title="Security">
        Review active sessions and enable two-factor authentication.
      </Accordion.Item>
      <Accordion.Item value="billing" title="Billing">
        Update your payment method and download past invoices.
      </Accordion.Item>
    </Accordion>
  ),
};

export const InitiallyExpanded: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      <Accordion type="single" defaultValue="returns">
        <Accordion.Item value="shipping" title="Shipping">
          Orders ship within two business days.
        </Accordion.Item>
        <Accordion.Item value="returns" title="Returns">
          Returns are accepted for thirty days after delivery.
        </Accordion.Item>
      </Accordion>
      <Accordion type="multiple" defaultValue={['shipping', 'returns']}>
        <Accordion.Item value="shipping" title="Shipping">
          Orders ship within two business days.
        </Accordion.Item>
        <Accordion.Item value="returns" title="Returns">
          Returns are accepted for thirty days after delivery.
        </Accordion.Item>
      </Accordion>
    </div>
  ),
};

export const DisabledItems: Story = {
  render: () => (
    <Accordion type="multiple">
      <Accordion.Item value="available" title="Available">
        This section can be opened and closed.
      </Accordion.Item>
      <Accordion.Item value="coming-soon" title="Coming soon" disabled>
        This content is not available yet.
      </Accordion.Item>
      <Accordion.Item value="archived" title="Archived" disabled>
        Archived content cannot be expanded.
      </Accordion.Item>
    </Accordion>
  ),
};

export const DisabledAccordion: Story = {
  render: () => (
    <Accordion type="single" disabled defaultValue="general">
      <Accordion.Item value="general" title="General">
        A disabled accordion keeps its current state but cannot change.
      </Accordion.Item>
      <Accordion.Item value="privacy" title="Privacy">
        Every trigger is disabled.
      </Accordion.Item>
    </Accordion>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={['terms']}>
      <Accordion.Item
        value="terms"
        title="Terms of service and acceptable use policy for workspace administrators"
      >
        <p style={{ margin: '0 0 12px' }}>
          These terms describe how you may use the service, what you can expect
          from us, and how disputes are resolved. Please read them carefully
          before creating a workspace for your team.
        </p>
        <p style={{ margin: '0 0 12px' }}>
          Administrators are responsible for managing member access, reviewing
          shared content, and ensuring that every account complies with the
          policies that apply to their organization. Access can be revoked at
          any time when those policies are violated.
        </p>
        <p style={{ margin: 0 }}>
          Continued use after an update to these terms means you accept the
          revised version. Material changes are announced in advance through the
          workspace notification center and by email to administrators.
        </p>
      </Accordion.Item>
      <Accordion.Item value="short" title="Short section">
        A brief answer that sits below the long section.
      </Accordion.Item>
    </Accordion>
  ),
};

const faqItems = [
  {
    value: 'export',
    question: 'Can I export my notes?',
    answer:
      'Yes. Open the workspace menu and choose Export to download every note as Markdown or PDF.',
  },
  {
    value: 'offline',
    question: 'Does the app work offline?',
    answer:
      'Notes you open are cached locally, so you can keep editing without a connection. Changes sync when you reconnect.',
  },
  {
    value: 'sharing',
    question: 'How do I share a note with someone?',
    answer:
      'Use the Share button in the note header, then invite people by email. Each invitee can be given view or edit access.',
  },
];

function FaqAccordion() {
  const [openQuestion, setOpenQuestion] = useState<string | null>('export');

  return (
    <div style={{ display: 'grid', gap: '12px', maxWidth: '480px' }}>
      <Accordion
        type="single"
        value={openQuestion}
        onValueChange={setOpenQuestion}
      >
        {faqItems.map((item) => (
          <Accordion.Item
            key={item.value}
            value={item.value}
            title={item.question}
          >
            {item.answer}
          </Accordion.Item>
        ))}
      </Accordion>
      <p style={{ margin: 0 }}>Open question: {openQuestion ?? 'none'}</p>
    </div>
  );
}

export const Faq: Story = {
  render: () => <FaqAccordion />,
};

function SettingsAccordion() {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'profile',
  ]);

  return (
    <div style={{ display: 'grid', gap: '12px', maxWidth: '480px' }}>
      <Accordion
        type="multiple"
        value={expandedSections}
        onValueChange={setExpandedSections}
      >
        <Accordion.Item value="profile" title="Profile">
          Update your display name, avatar, and the email address used for
          sign-in notices.
        </Accordion.Item>
        <Accordion.Item value="appearance" title="Appearance">
          Pick a theme and choose how dense the note list should look.
        </Accordion.Item>
        <Accordion.Item value="keyboard" title="Keyboard shortcuts" disabled>
          Shortcut customization is coming in a future update.
        </Accordion.Item>
      </Accordion>
      <p style={{ margin: 0 }}>
        Expanded sections: {expandedSections.join(', ') || 'none'}
      </p>
    </div>
  );
}

export const SettingsPanel: Story = {
  render: () => <SettingsAccordion />,
};
