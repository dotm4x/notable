import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Callout as PublicCallout } from '../../components/index.js';
import { Callout } from './callout.js';

describe('Callout', () => {
  it('renders a note with the info tone by default', () => {
    render(<Callout>Message</Callout>);

    const callout = screen.getByRole('note');
    expect(callout).toHaveClass('one-callout');
    expect(callout).toHaveAttribute('data-tone', 'info');
  });

  it.each(['info', 'success', 'warning', 'danger'] as const)(
    'supports the %s tone',
    (tone) => {
      render(<Callout tone={tone}>Message</Callout>);

      expect(screen.getByRole('note')).toHaveAttribute('data-tone', tone);
    },
  );

  it('lets consumers change the accessible role', () => {
    render(<Callout role="alert">Message</Callout>);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders compound parts with their classes and default elements', () => {
    render(
      <Callout>
        <Callout.Icon data-testid="icon">!</Callout.Icon>
        <Callout.Content>
          <Callout.Title>Heads up</Callout.Title>
          <p>Review the settings before continuing.</p>
        </Callout.Content>
        <Callout.Actions>
          <button type="button">Review</button>
        </Callout.Actions>
      </Callout>,
    );

    expect(screen.getByTestId('icon')).toHaveClass('one-callout__icon');
    expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Heads up').tagName).toBe('P');
    expect(screen.getByText('Heads up')).toHaveClass('one-callout__title');
    expect(
      screen.getByText('Review the settings before continuing.').parentElement,
    ).toHaveClass('one-callout__content');
    expect(screen.getByText('Review').parentElement).toHaveClass(
      'one-callout__actions',
    );
  });

  it('renders the title as a heading when requested', () => {
    render(<Callout.Title as="h3">Warning</Callout.Title>);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Warning' }),
    ).toBeInTheDocument();
  });

  it('forwards refs and native attributes', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Callout className="custom" data-testid="callout" id="notice" ref={ref}>
        Message
      </Callout>,
    );

    const callout = screen.getByTestId('callout');
    expect(callout).toHaveClass('one-callout', 'custom');
    expect(callout).toHaveAttribute('id', 'notice');
    expect(ref.current).toBe(callout);
  });

  it('is exported from the package entry point', () => {
    expect(PublicCallout).toBe(Callout);
    expect(PublicCallout.Icon).toBe(Callout.Icon);
    expect(PublicCallout.Title).toBe(Callout.Title);
    expect(PublicCallout.Content).toBe(Callout.Content);
    expect(PublicCallout.Actions).toBe(Callout.Actions);
  });
});
