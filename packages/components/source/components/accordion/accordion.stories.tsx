import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Accordion, AccordionItem } from './accordion.js';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: {
    type: 'single',
    children: (
      <AccordionItem value="shipping" title="Shipping">
        Orders ship within two business days.
      </AccordionItem>
    ),
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Accordion type="single">
      <AccordionItem value="shipping" title="Shipping">
        Orders ship within two business days and include tracking details.
      </AccordionItem>
      <AccordionItem value="returns" title="Returns">
        Unused items can be returned within thirty days of delivery.
      </AccordionItem>
      <AccordionItem value="warranty" title="Warranty">
        Every product is covered against manufacturing defects for one year.
      </AccordionItem>
    </Accordion>
  ),
};

export const Single: Story = {
  render: () => (
    <Accordion type="single">
      <AccordionItem value="general" title="General">
        Opening a new section closes the one that is currently expanded.
      </AccordionItem>
      <AccordionItem value="privacy" title="Privacy">
        Activating the expanded section again collapses it.
      </AccordionItem>
      <AccordionItem value="advanced" title="Advanced">
        Only one section is expanded at a time in single mode.
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple">
      <AccordionItem value="notifications" title="Notifications">
        Choose how and when you receive updates about your workspace.
      </AccordionItem>
      <AccordionItem value="security" title="Security">
        Review active sessions and enable two-factor authentication.
      </AccordionItem>
      <AccordionItem value="billing" title="Billing">
        Update your payment method and download past invoices.
      </AccordionItem>
    </Accordion>
  ),
};

export const InitiallyExpanded: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      <Accordion type="single" defaultValue="returns">
        <AccordionItem value="shipping" title="Shipping">
          Orders ship within two business days.
        </AccordionItem>
        <AccordionItem value="returns" title="Returns">
          Returns are accepted for thirty days after delivery.
        </AccordionItem>
      </Accordion>
      <Accordion type="multiple" defaultValue={['shipping', 'returns']}>
        <AccordionItem value="shipping" title="Shipping">
          Orders ship within two business days.
        </AccordionItem>
        <AccordionItem value="returns" title="Returns">
          Returns are accepted for thirty days after delivery.
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const DisabledItems: Story = {
  render: () => (
    <Accordion type="multiple">
      <AccordionItem value="available" title="Available">
        This section can be opened and closed.
      </AccordionItem>
      <AccordionItem value="coming-soon" title="Coming soon" disabled>
        This content is not available yet.
      </AccordionItem>
      <AccordionItem value="archived" title="Archived" disabled>
        Archived content cannot be expanded.
      </AccordionItem>
    </Accordion>
  ),
};

export const DisabledAccordion: Story = {
  render: () => (
    <Accordion type="single" disabled defaultValue="general">
      <AccordionItem value="general" title="General">
        A disabled accordion keeps its current state but cannot change.
      </AccordionItem>
      <AccordionItem value="privacy" title="Privacy">
        Every trigger is disabled.
      </AccordionItem>
    </Accordion>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={['terms']}>
      <AccordionItem
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
      </AccordionItem>
      <AccordionItem value="short" title="Short section">
        A brief answer that sits below the long section.
      </AccordionItem>
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
          <AccordionItem
            key={item.value}
            value={item.value}
            title={item.question}
          >
            {item.answer}
          </AccordionItem>
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
        <AccordionItem value="profile" title="Profile">
          Update your display name, avatar, and the email address used for
          sign-in notices.
        </AccordionItem>
        <AccordionItem value="appearance" title="Appearance">
          Pick a theme and choose how dense the note list should look.
        </AccordionItem>
        <AccordionItem value="keyboard" title="Keyboard shortcuts" disabled>
          Shortcut customization is coming in a future update.
        </AccordionItem>
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
